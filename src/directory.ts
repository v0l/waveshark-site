export const KIND = 10_690;
export const STALE_AFTER_SECS = 24 * 60 * 60;
export const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.primal.net',
  'wss://relay.snort.social',
];

const SCHEME = 'iqstream://';

export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export type Dial = { tunable: false } | { tunable: true; min?: number; max?: number };

export interface Tuner {
  id: number;
  name: string;
  hardware: string;
  antenna: string;
  center: number;
  rate: number;
  dial: Dial;
}

export interface Station {
  author: string;
  seen: number;
  host: string;
  port: number;
  name: string;
  description: string;
  version: string;
  clients: number;
  maxClients?: number;
  sessionLimit?: number;
  geohash?: string;
  location?: { lat: number; lon: number };
  tuners: Tuner[];
}

export const now = () => Math.floor(Date.now() / 1000);

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function geohashCenter(hash: string): { lat: number; lon: number } | undefined {
  const lat = [-90, 90];
  const lon = [-180, 180];
  let even = true;
  for (const c of hash.toLowerCase()) {
    const v = BASE32.indexOf(c);
    if (v < 0) return undefined;
    for (let bit = 4; bit >= 0; bit--) {
      const range = even ? lon : lat;
      const mid = (range[0] + range[1]) / 2;
      if ((v >> bit) & 1) range[0] = mid;
      else range[1] = mid;
      even = !even;
    }
  }
  return hash ? { lat: (lat[0] + lat[1]) / 2, lon: (lon[0] + lon[1]) / 2 } : undefined;
}

function hostPort(addr: string): [string, number] | undefined {
  const v6 = addr.startsWith('[');
  const at = v6 ? addr.indexOf(']:') : addr.lastIndexOf(':');
  if (at <= 0) return undefined;
  const host = v6 ? addr.slice(1, at) : addr.slice(0, at);
  const port = Number(addr.slice(at + (v6 ? 2 : 1)));
  return host && Number.isInteger(port) && port > 0 && port < 65536 ? [host, port] : undefined;
}

function count(v: string | undefined): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v.trim());
  if (!Number.isFinite(n) || n < 0) throw new Error(`${v} is not a number`);
  return n;
}

function tuner(fields: string[]): Tuner {
  const get = (key: string) => {
    for (const f of fields) {
      const space = f.indexOf(' ');
      if (space > 0 && f.slice(0, space) === key) return f.slice(space + 1);
    }
    return undefined;
  };
  const need = (key: string) => {
    const n = count(get(key));
    if (n === undefined) throw new Error(`tuner without ${key}`);
    return n;
  };
  const hardware = get('type');
  if (hardware === undefined) throw new Error('tuner without type');
  return {
    id: need('id'),
    name: get('name') ?? '',
    hardware,
    antenna: get('antenna') ?? '',
    center: need('center'),
    rate: need('rate'),
    dial:
      get('tunable') === '1'
        ? { tunable: true, min: count(get('min')), max: count(get('max')) }
        : { tunable: false },
  };
}

export function read(e: NostrEvent, at: number): Station | undefined {
  if (e.kind !== KIND) return undefined;
  const first = (key: string) => e.tags.find(t => t[0] === key)?.[1]?.trim();
  const expiration = count(first('expiration'));
  if (expiration !== undefined && expiration <= at) return undefined;
  if (at - e.created_at >= STALE_AFTER_SECS) return undefined;
  try {
    const address = e.tags
      .filter(t => t[0] === 'r' && t[1]?.trim().startsWith(SCHEME))
      .map(t => hostPort(t[1].trim().slice(SCHEME.length)))
      .find(Boolean);
    const version = first('version');
    if (!address || !version || !/^\d+\.\d+$/.test(version)) return undefined;
    const geohash = e.tags
      .filter(t => t[0] === 'g' && t[1])
      .map(t => t[1])
      .reduce<string | undefined>((a, b) => (a && a.length >= b.length ? a : b), undefined);
    return {
      author: e.pubkey,
      seen: e.created_at,
      host: address[0],
      port: address[1],
      name: first('name') ?? '',
      description: first('description') ?? '',
      version,
      clients: count(first('clients')) ?? 0,
      maxClients: count(first('max_clients')),
      sessionLimit: count(first('session_limit')),
      geohash,
      location: geohash ? geohashCenter(geohash) : undefined,
      tuners: e.tags.filter(t => t[0] === 'tuner').map(t => tuner(t.slice(1))),
    };
  } catch {
    return undefined;
  }
}

export function addr(s: Pick<Station, 'host' | 'port'>): string {
  return s.host.includes(':') ? `[${s.host}]:${s.port}` : `${s.host}:${s.port}`;
}

export function hasSlot(s: Station): boolean {
  return s.maxClients === undefined || s.clients < s.maxClients;
}

export function span(t: Tuner): [number, number] {
  return [Math.max(0, t.center - t.rate / 2), t.center + t.rate / 2];
}

export function hears(t: Tuner, hz: number): boolean {
  const [lo, hi] = span(t);
  if (hz >= lo && hz <= hi) return true;
  return t.dial.tunable && t.dial.min !== undefined && t.dial.max !== undefined
    ? hz >= t.dial.min && hz <= t.dial.max
    : false;
}

export interface Watch {
  close(): void;
}

export function watch(
  onStations: (stations: Station[]) => void,
  onRelays: (answered: number, failed: number) => void,
  relays: string[] = RELAYS,
): Watch {
  const events = new Map<string, NostrEvent>();
  const checked = new Set<string>();
  const sockets: WebSocket[] = [];
  let answered = 0;
  let failed = 0;
  let closed = false;
  let pending: ReturnType<typeof setTimeout> | undefined;

  const publish = () => {
    pending = undefined;
    const at = now();
    const stations = [...events.values()]
      .map(e => read(e, at))
      .filter((s): s is Station => !!s)
      .sort((a, b) => b.seen - a.seen || addr(a).localeCompare(addr(b)));
    onStations(stations);
  };
  const soon = () => {
    if (!pending && !closed) pending = setTimeout(publish, 60);
  };

  const verifier = import('./verify').then(m => m.verify);
  const newer = (e: NostrEvent) => {
    const held = events.get(e.pubkey);
    return !held || held.created_at < e.created_at;
  };
  const take = (e: NostrEvent) => {
    if (checked.has(e.id) || !newer(e)) return;
    checked.add(e.id);
    verifier.then(verify => {
      if (closed || !newer(e) || !verify(e)) return;
      events.set(e.pubkey, e);
      soon();
    });
  };

  const sub = Math.random().toString(36).slice(2, 10);
  const since = now() - STALE_AFTER_SECS;
  for (const url of relays) {
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      failed++;
      onRelays(answered, failed);
      continue;
    }
    sockets.push(ws);
    let settled = false;
    const settle = (ok: boolean) => {
      if (settled || closed) return;
      settled = true;
      verifier.then(() => {
        if (closed) return;
        ok ? answered++ : failed++;
        onRelays(answered, failed);
        publish();
      });
    };
    const timeout = setTimeout(() => settle(false), 10_000);
    ws.onopen = () => ws.send(JSON.stringify(['REQ', sub, { kinds: [KIND], since }]));
    ws.onmessage = m => {
      let v: unknown;
      try {
        v = JSON.parse(m.data);
      } catch {
        return;
      }
      if (!Array.isArray(v) || v[1] !== sub) return;
      if (v[0] === 'EVENT' && v[2] && typeof v[2] === 'object') take(v[2] as NostrEvent);
      else if (v[0] === 'EOSE' || v[0] === 'CLOSED') {
        clearTimeout(timeout);
        settle(v[0] === 'EOSE');
      }
    };
    ws.onerror = () => {
      clearTimeout(timeout);
      settle(false);
    };
  }
  if (!relays.length) onStations([]);

  const tick = setInterval(publish, 60_000);
  return {
    close() {
      closed = true;
      clearInterval(tick);
      if (pending) clearTimeout(pending);
      for (const ws of sockets) {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(['CLOSE', sub]));
        ws.close();
      }
    },
  };
}
