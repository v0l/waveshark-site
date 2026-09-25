import { useEffect, useMemo, useState } from 'preact/hooks';
import { FormattedMessage, FormattedRelativeTime, useIntl } from 'react-intl';
import { SiteHeader } from '../components/header';
import { TunerMap } from '../components/tuner-map';
import { RELAYS, addr, hasSlot, hears, now, watch, type Station, type Tuner } from '../directory';
import { useLocalePath } from '../i18n/context';

const HARDWARE: Record<string, [string, string?]> = {
  rtlsdr: ['RTL-SDR', '/hardware/rtl-sdr/'],
  hackrf: ['HackRF', '/hardware/hackrf/'],
  limesdr: ['LimeSDR', '/hardware/limesdr/'],
  airspy: ['Airspy'],
  airspyhf: ['Airspy HF+'],
  sdrplay: ['SDRplay'],
};

const toMhz = (hz: number) => +(hz / 1e6).toFixed(3);

function mhz(text: string): number | undefined {
  const v = Number(text.trim().replace(',', '.'));
  return text.trim() && Number.isFinite(v) && v > 0 ? Math.round(v * 1e6) : undefined;
}

function Ago({ secs }: { secs: number }) {
  if (secs < 90) return <FormattedMessage defaultMessage="listed just now" />;
  const [value, unit] = secs < 5400 ? [Math.round(secs / 60), 'minute' as const] : [Math.round(secs / 3600), 'hour' as const];
  return (
    <FormattedMessage
      defaultMessage="listed {ago}"
      values={{ ago: <FormattedRelativeTime value={-value} unit={unit} numeric="auto" style="short" /> }}
    />
  );
}

function Hardware({ id }: { id: string }) {
  const to = useLocalePath();
  const [name, href] = HARDWARE[id] ?? [id];
  return href ? <a href={to(href)}>{name}</a> : <>{name}</>;
}

function Reach({ t }: { t: Tuner }) {
  return t.dial.tunable ? (
    <FormattedMessage defaultMessage="{span} MHz span, tunable" values={{ span: toMhz(t.rate) }} />
  ) : (
    <FormattedMessage defaultMessage="{span} MHz span, fixed" values={{ span: toMhz(t.rate) }} />
  );
}

function TunerRow({ t }: { t: Tuner }) {
  return (
    <li>
      <span class="tuner-f">{toMhz(t.center)} MHz</span>
      <span class="tuner-n">
        {t.name || <FormattedMessage defaultMessage="tuner {id}" values={{ id: t.id }} />} &middot;{' '}
        <Hardware id={t.hardware} />
        {t.antenna && <> &middot; {t.antenna}</>}
      </span>
      <span class="tuner-r">
        <Reach t={t} />
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
      {done ? <FormattedMessage defaultMessage="Copied" /> : <FormattedMessage defaultMessage="Copy" />}
    </button>
  );
}

function Slots({ s }: { s: Station }) {
  const listening =
    s.maxClients === undefined ? (
      <FormattedMessage defaultMessage="{clients} listening when listed" values={{ clients: s.clients }} />
    ) : (
      <FormattedMessage
        defaultMessage="{clients} of {max} listening when listed"
        values={{ clients: s.clients, max: s.maxClients }}
      />
    );
  return hasSlot(s) ? (
    <span class="free">{listening}</span>
  ) : (
    <span class="full">
      <FormattedMessage defaultMessage="full, {listening}" values={{ listening }} />
    </span>
  );
}

function StationCard({ s, at, picked, onPick }: { s: Station; at: number; picked: boolean; onPick: () => void }) {
  const command = `waveshark --stream ${addr(s)}`;
  return (
    <li id={`station-${s.author.slice(0, 16)}`} class={`station${picked ? ' on' : ''}`} onClick={onPick}>
      <p class="freq">
        {s.location ? (
          <button type="button" class="where" onClick={onPick}>
            <FormattedMessage defaultMessage="Show on map" />
          </button>
        ) : (
          <span class="nowhere">
            <FormattedMessage defaultMessage="No location given" />
          </span>
        )}
        <span>
          <Ago secs={at - s.seen} />
        </span>
      </p>
      <h2>{s.name || s.host}</h2>
      {s.description && <p class="station-d">{s.description}</p>}
      <ul class="tuners">
        {s.tuners.map(t => (
          <TunerRow key={t.id} t={t} />
        ))}
      </ul>
      <p class="station-meta">
        <Slots s={s} />
        {s.sessionLimit !== undefined && (
          <span>
            <FormattedMessage
              defaultMessage="{minutes} min sessions"
              values={{ minutes: Math.round(s.sessionLimit / 60) }}
            />
          </span>
        )}
        <span>iqstream {s.version}</span>
      </p>
      <div class="station-cmd">
        <code>{command}</code>
        <Copy text={command} />
      </div>
    </li>
  );
}

function Status(props: { stations?: Station[]; shown: Station[]; answered: number; failed: number }) {
  const { stations, shown, answered, failed } = props;
  const settled = answered + failed;
  if (stations === undefined) return <FormattedMessage defaultMessage="Asking the relays" />;
  if (settled < RELAYS.length && stations.length === 0) {
    return (
      <FormattedMessage
        defaultMessage="Asking the relays, {settled} of {relays} answered"
        values={{ settled, relays: RELAYS.length }}
      />
    );
  }
  return (
    <FormattedMessage
      defaultMessage="{shown} of {total, plural, one {# station} other {# stations}}, {placed} on the map, from {answered} of {relays} relays"
      values={{
        shown: shown.length,
        total: stations.length,
        placed: shown.filter(s => s.location).length,
        answered,
        relays: RELAYS.length,
      }}
    />
  );
}

export function Tuners() {
  const intl = useIntl();
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


  return (
    <>
      <SiteHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <p class="eyebrow">
              <FormattedMessage defaultMessage="The IQStream directory, read live from nostr" />
            </p>
            <h1>
              <FormattedMessage defaultMessage="Public tuners" />
            </h1>
            <p class="lede">
              <FormattedMessage
                defaultMessage="Receivers people have chosen to share. Each one is an iqstream server announced on <nostr>nostr</nostr>, so any copy of WaveShark can open it as a remote radio and decode what that antenna hears."
                values={{ nostr: chunks => <a href="https://nostr.how">{chunks}</a> }}
              />
            </p>
          </div>
        </section>

        <section class="wrap">
          <form class="tuner-filter" onSubmit={e => e.preventDefault()}>
            <label>
              <span>
                <FormattedMessage defaultMessage="Hears" />
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder={intl.formatMessage({ defaultMessage: 'MHz, e.g. 1090' })}
                value={freq}
                onInput={e => setFreq(e.currentTarget.value)}
              />
            </label>
            <label class="check">
              <input type="checkbox" checked={free} onChange={e => setFree(e.currentTarget.checked)} />
              <span>
                <FormattedMessage defaultMessage="Free slot" />
              </span>
            </label>
            <label class="check">
              <input type="checkbox" checked={tunable} onChange={e => setTunable(e.currentTarget.checked)} />
              <span>
                <FormattedMessage defaultMessage="Tunable" />
              </span>
            </label>
            <p class="tuner-status" aria-live="polite">
              <Status stations={stations} shown={shown} answered={relays.answered} failed={relays.failed} />
            </p>
          </form>

          <TunerMap stations={shown} selected={selected} onSelect={pick} />

          {stations !== undefined && shown.length === 0 && (
            <p class="note">
              {stations.length === 0 ? (
                <FormattedMessage defaultMessage="Nobody has listed a station in the last day. Yours could be the first." />
              ) : (
                <FormattedMessage defaultMessage="No listed station matches that. Clear the filter to see them all." />
              )}
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
              <h2 class="section-h balance">
                <FormattedMessage defaultMessage="List your own" />
              </h2>
              <p class="prose">
                <FormattedMessage defaultMessage="Serve the span over iqstream from the setup card or with <code>--iqstream-listen</code>, then switch on <strong>list</strong> in the directory section of the settings, and <strong>locate</strong> to be on the map. Leave the public host blank and the router is asked to open the port over UPnP, PCP or NAT-PMP. A <code>wave1090</code> box lists itself with <code>--iqstream-list</code>." />
              </p>
            </div>
            <div class="prose">
              <p>
                <FormattedMessage defaultMessage="A listing is a signed nostr event of kind 10690, replaced each time the station announces and expired after a day, so a receiver that goes away drops off here on its own. The location is a five character geohash, a cell about five kilometres across, never the antenna itself." />
              </p>
              <p>
                <FormattedMessage defaultMessage="In WaveShark the same list is in the remote tuners dialog, where TUNE opens a station as a radio. From a terminal, <code>--stream</code> takes the address on each card." />
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
