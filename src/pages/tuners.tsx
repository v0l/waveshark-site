import { useEffect, useMemo, useState } from 'preact/hooks';
import { SiteHeader } from '../components/header';
import { TunerMap } from '../components/tuner-map';
import { RELAYS, addr, hasSlot, hears, now, watch, type Station, type Tuner } from '../directory';

const HARDWARE: Record<string, [string, string?]> = {
  rtlsdr: ['RTL-SDR', '/hardware/rtl-sdr/'],
  hackrf: ['HackRF', '/hardware/hackrf/'],
  limesdr: ['LimeSDR', '/hardware/limesdr/'],
  airspy: ['Airspy'],
  airspyhf: ['Airspy HF+'],
  sdrplay: ['SDRplay'],
};

function mhzText(v: number): string {
  return `${+(v / 1e6).toFixed(3)} MHz`;
}

function ago(secs: number): string {
  if (secs < 90) return 'just now';
  if (secs < 5400) return `${Math.round(secs / 60)} min ago`;
  return `${Math.round(secs / 3600)} h ago`;
}

function mhz(text: string): number | undefined {
  const v = Number(text.trim().replace(',', '.'));
  return text.trim() && Number.isFinite(v) && v > 0 ? Math.round(v * 1e6) : undefined;
}

function Hardware({ id }: { id: string }) {
  const [name, href] = HARDWARE[id] ?? [id];
  return href ? <a href={href}>{name}</a> : <>{name}</>;
}

function TunerRow({ t }: { t: Tuner }) {
  const reach =
    t.dial.tunable && t.dial.min !== undefined && t.dial.max !== undefined
      ? `tunes ${+(t.dial.min / 1e6).toFixed(3)} to ${mhzText(t.dial.max)}`
      : t.dial.tunable
        ? 'tunable'
        : 'fixed';
  return (
    <li>
      <span class="tuner-f">{mhzText(t.center)}</span>
      <span class="tuner-n">
        {t.name || `tuner ${t.id}`} &middot; <Hardware id={t.hardware} />
        {t.antenna && <> &middot; {t.antenna}</>}
      </span>
      <span class="tuner-r">
        {mhzText(t.rate)} span, {reach}
      </span>
    </li>
  );
}

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      class="copy"
      onClick={() =>
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        })
      }
    >
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

function StationCard({ s, at, picked, onPick }: { s: Station; at: number; picked: boolean; onPick: () => void }) {
  const command = `waveshark --stream ${addr(s)}`;
  const slots =
    s.maxClients === undefined
      ? `${s.clients} listening when listed`
      : `${s.clients} of ${s.maxClients} listening when listed`;
  return (
    <li id={`station-${s.author.slice(0, 16)}`} class={`station${picked ? ' on' : ''}`} onClick={onPick}>
      <p class="freq">
        {s.location ? (
          <button type="button" class="where" onClick={onPick}>
            Show on map
          </button>
        ) : (
          <span class="nowhere">No location given</span>
        )}
        <span>listed {ago(at - s.seen)}</span>
      </p>
      <h2>{s.name || s.host}</h2>
      {s.description && <p class="station-d">{s.description}</p>}
      <ul class="tuners">
        {s.tuners.map(t => (
          <TunerRow key={t.id} t={t} />
        ))}
      </ul>
      <p class="station-meta">
        <span class={hasSlot(s) ? 'free' : 'full'}>{hasSlot(s) ? slots : `full, ${slots}`}</span>
        {s.sessionLimit !== undefined && <span>{Math.round(s.sessionLimit / 60)} min sessions</span>}
        <span>iqstream {s.version}</span>
      </p>
      <div class="station-cmd">
        <code>{command}</code>
        <Copy text={command} />
      </div>
    </li>
  );
}

export function Tuners() {
  const [stations, setStations] = useState<Station[] | undefined>();
  const [relays, setRelays] = useState({ answered: 0, failed: 0 });
  const [selected, setSelected] = useState<string>();
  const [freq, setFreq] = useState('');
  const [free, setFree] = useState(false);
  const [tunable, setTunable] = useState(false);
  const [at, setAt] = useState(now());

  useEffect(() => {
    const w = watch(
      s => {
        setStations(s);
        setAt(now());
      },
      (answered, failed) => setRelays({ answered, failed }),
    );
    const tick = setInterval(() => setAt(now()), 30_000);
    return () => {
      clearInterval(tick);
      w.close();
    };
  }, []);

  const wanted = mhz(freq);
  const shown = useMemo(
    () =>
      (stations ?? []).filter(
        s =>
          (!free || hasSlot(s)) &&
          (s.tuners.length === 0
            ? wanted === undefined && !tunable
            : s.tuners.some(t => (wanted === undefined || hears(t, wanted)) && (!tunable || t.dial.tunable))),
      ),
    [stations, wanted, free, tunable],
  );

  const pick = (author: string) => {
    setSelected(author);
    document.getElementById(`station-${author.slice(0, 16)}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const settled = relays.answered + relays.failed;
  const placed = shown.filter(s => s.location).length;
  const status =
    stations === undefined
      ? 'Asking the relays'
      : settled < RELAYS.length && stations.length === 0
        ? `Asking the relays, ${settled} of ${RELAYS.length} answered`
        : `${shown.length} of ${stations.length} ${stations.length === 1 ? 'station' : 'stations'}, ${placed} on the map, from ${relays.answered} of ${RELAYS.length} relays`;

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <p class="eyebrow">The IQStream directory, read live from nostr</p>
            <h1>Public tuners</h1>
            <p class="lede">
              Receivers people have chosen to share. Each one is an iqstream server announced on
              <a href="https://nostr.how">nostr</a>, so any copy of WaveShark can open it as a remote radio and decode what that
              antenna hears.
            </p>
          </div>
        </section>

        <section class="wrap">
          <form class="tuner-filter" onSubmit={e => e.preventDefault()}>
            <label>
              <span>Hears</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="MHz, e.g. 1090"
                value={freq}
                onInput={e => setFreq(e.currentTarget.value)}
              />
            </label>
            <label class="check">
              <input type="checkbox" checked={free} onChange={e => setFree(e.currentTarget.checked)} />
              <span>Free slot</span>
            </label>
            <label class="check">
              <input type="checkbox" checked={tunable} onChange={e => setTunable(e.currentTarget.checked)} />
              <span>Tunable</span>
            </label>
            <p class="tuner-status" aria-live="polite">
              {status}
            </p>
          </form>

          <TunerMap stations={shown} selected={selected} onSelect={pick} />

          {stations !== undefined && shown.length === 0 && (
            <p class="note">
              {stations.length === 0
                ? 'Nobody has listed a station in the last day. Yours could be the first.'
                : 'No listed station matches that. Clear the filter to see them all.'}
            </p>
          )}
          <ul class="stations">
            {shown.map(s => (
              <StationCard key={s.author} s={s} at={at} picked={s.author === selected} onPick={() => setSelected(s.author)} />
            ))}
          </ul>
        </section>

        <section class="band tight">
          <div class="wrap two">
            <div>
              <h2 class="section-h balance">List your own</h2>
              <p class="prose">
                Serve the span over iqstream from the setup card or with <code>--iqstream-listen</code>,
                then switch on <strong>list</strong> in the directory section of the settings, and{' '}
                <strong>locate</strong> to be on the map. Leave the public host blank and the router is
                asked to open the port over UPnP, PCP or NAT-PMP. A <code>wave1090</code> box lists
                itself with <code>--iqstream-list</code>.
              </p>
            </div>
            <div class="prose">
              <p>
                A listing is a signed nostr event of kind 10690, replaced each time the station
                announces and expired after a day, so a receiver that goes away drops off here on its
                own. The location is a five character geohash, a cell about five kilometres across,
                never the antenna itself.
              </p>
              <p>
                In WaveShark the same list is in the remote tuners dialog, where TUNE opens a station
                as a radio. From a terminal, <code>--stream</code> takes the address on each card.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
