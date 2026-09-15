import { useEffect, useRef } from 'preact/hooks';
import { HomeHeader } from '../components/header';
import { Code } from '../components/code';
import { CARDS, VIEWS, RIGS } from '../content';

const REPO = 'https://github.com/v0l/waveshark';

const CLI = [
  '<span class="c">$</span> waveshark --tune 868.3 --record captures',
  '<span class="c">$</span> waveshark --replay captures',
  '',
  '<span class="d">--tune &lt;mhz&gt;</span>         start tuned and listening',
  '<span class="d">--mode &lt;mode&gt;</span>        wfm, nfm, am, usb, lsb or cw',
  '<span class="d">--span &lt;khz&gt;</span>         nearest span, narrowed in software',
  '<span class="d">--stream &lt;host&gt;</span>      offer an iqstream server as a radio',
  '<span class="d">--headless</span>           run with no window, scanning and logging',
  '<span class="d">--mcp-listen &lt;addr&gt;</span>  where to serve MCP, or off',
  '<span class="d">--ha-broker &lt;host&gt;</span>   publish what is heard to Home Assistant',
  '<span class="d">--print-log</span>          print every packet as it arrives',
  '<span class="d">--fetch-data</span>         warm the dataset cache before going offline',
].join('\n');

function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rows = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!canvas.current || !rows.current) return;
    let stop: (() => void) | undefined;
    let live = true;
    import('../hero/scope').then(({ startScope }) => {
      if (!live || !canvas.current || !rows.current) return;
      stop = startScope(canvas.current, rows.current);
    });
    return () => {
      live = false;
      stop?.();
    };
  }, []);

  return (
    <section class="hero">
      <div class="scope" aria-hidden="true">
        <canvas ref={canvas} id="scope" width={1600} height={520} />
        <div class="scope-fade" />
      </div>
      <div class="hero-copy">
        <p class="eyebrow">433.920 MHz &middot; span 2400 kHz &middot; 41 scanners running</p>
        <h1>Wireshark for the<br />radio spectrum</h1>
        <p class="lede">
          Leave a cheap dongle on a band and WaveShark tells you what is transmitting around you,
          instead of what is on the one frequency somebody already told you about.
        </p>
        <div class="cta">
          <a class="btn" href="/download">Download for Linux, Windows and macOS</a>
          <a class="btn btn-ghost" href={REPO}>Read the source</a>
        </div>
        <p class="fineprint">GPL-3.0 &middot; RTL-SDR, HackRF One, LimeSDR &middot; no account, no cloud</p>
      </div>
      <div class="ticker" id="ticker" aria-label="Bursts heard in the last minute">
        <div class="ticker-head">
          <span>TIME</span><span>FREQ</span><span>MOD</span><span>SNR</span><span>DECODED AS</span>
        </div>
        <ol class="ticker-rows" ref={rows} id="ticker-rows" />
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <HomeHeader />
      <main id="main">
        <Hero />

        <section class="band" id="work">
          <div class="wrap two">
            <div>
              <h2 class="section-h balance">The dial is where you look. The span is what you collect.</h2>
            </div>
            <div class="prose">
              <p>
                Decoding does not follow the dial. Every scanner inside the sampled span runs all the
                time, so a sensor that transmits once a minute is caught whether or not you were
                pointing at it when it fired.
              </p>
              <p>
                Everything heard goes in the list along the bottom, decoded or not: frequency,
                modulation, RSSI, SNR and what was made of it. Click a row for its envelope, its
                instantaneous frequency and a hex dump. A burst nothing claims still gets its coding
                inferred and its bits sliced out, which is enough to recognise the same device again
                and start reversing it.
              </p>
            </div>
          </div>
        </section>

        <section class="band tight" id="hears">
          <div class="wrap">
            <p class="eyebrow">Organised by where you point the radio</p>
            <h2 class="section-h">What it hears</h2>
            <ul class="cards">
              {CARDS.map(c => (
                <li key={c.title} class={c.tx ? 'card card-tx' : 'card'}>
                  <p class="freq">{c.freq}</p>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </li>
              ))}
            </ul>
            <p class="note">
              ISM coverage is the thin part: rtl_433 has roughly 250 device decoders and matching it
              is the job. <a href={`${REPO}/blob/master/crates/nodes/src/protocol.rs`}>The registry</a>{' '}
              is every protocol the receiver can reach, and{' '}
              <a href={`${REPO}/blob/master/CHANGELOG.md`}>the changelog</a> is what landed last.
            </p>
          </div>
        </section>

        <section class="band shot">
          <div class="wrap">
            <figure>
              <img
                src="/assets/screenshot.png"
                alt="WaveShark decoding a weather station on 433.92 MHz: spectrum and waterfall above, packet list below."
                width={734}
                height={704}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                Decoding a weather station on 433.92 MHz. The tab strip swaps the spectrum for the
                signal chain, the map and its track table, the call list, the transcript, the
                messages, the picture or the keys.
              </figcaption>
            </figure>
          </div>
        </section>

        <section class="band" id="views">
          <div class="wrap">
            <p class="eyebrow">A strip of tabs, Ctrl and a digit for the first ten, Ctrl+` to go back</p>
            <h2 class="section-h">Fourteen views on one stream</h2>
            <p class="prose views-intro">
              Every decoded frame arrives in one place, and each view is a different reading of it.
              None of them knows a protocol: a DMR call, a TETRA call and an M17 call are the same row
              with different fields filled in, and an aircraft, a vessel and a mesh node are the same
              track. The packet list runs along the bottom of all of them, newest last, with the
              selected burst’s envelope, instantaneous frequency and hex dump beside it.
            </p>
            <ol class="views">
              {VIEWS.map(v => (
                <li key={v.title}>
                  <span class="key">{v.key}</span>
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section class="band" id="agents">
          <div class="wrap two">
            <div>
              <p class="eyebrow">MCP on the loopback, and MQTT to the house</p>
              <h2 class="section-h balance">Something else can drive it</h2>
            </div>
            <div class="prose">
              <p>
                Every run serves the receiver over the Model Context Protocol at{' '}
                <code>http://127.0.0.1:8931/mcp</code>. It is the receiver on the screen, not a second
                one: what an agent tunes, opens or switches on appears in the window, and it can take a
                picture of that window to see what it did. It reads the spectrum, the packets, the
                calls, the transcript and the tracker, changes anything in the signal chain and draws
                the chain itself. It cannot transmit, and <code>--mcp-listen off</code> stops it
                listening.
              </p>
              <p>
                Point <code>--ha-broker</code> at the MQTT broker Home Assistant already uses and every
                transmitter the decoders can name becomes a device there: a weather station’s
                temperature and humidity, a meter’s reading, a tyre sensor’s pressure, and the
                level each was heard at. <code>--ha-spaces ism,wmbus</code> keeps it to your own sensors
                and meters rather than a street full of passing phones.
              </p>
            </div>
          </div>
        </section>

        <section class="band" id="hardware">
          <div class="wrap">
            <p class="eyebrow">Three radios, and one over the network</p>
            <h2 class="section-h">Hardware</h2>
            <ul class="rigs">
              {RIGS.map(r => (
                <li key={r.title}>
                  <p class="freq">{r.freq}</p>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section class="band cli">
          <div class="wrap two">
            <div>
              <p class="eyebrow">Capture once, decode forever</p>
              <h2 class="section-h">A capture that decodes is a test fixture</h2>
              <p class="prose">
                <code>--record</code> writes each burst as an rtl_433 style capture, so both WaveShark
                and rtl_433 can read it back. Capture a band once, then replay after every change: no
                radio, same answer every time.
              </p>
            </div>
            <div>
              <Code html={CLI} />
            </div>
          </div>
        </section>

        <section class="band verified">
          <div class="wrap two">
            <div>
              <p class="eyebrow">Status</p>
              <h2 class="section-h">Checked against other people’s decoders</h2>
            </div>
            <div class="prose">
              <p>
                <strong>52 recordings</strong> from rtl_433’s corpus are replayed field for field
                against what rtl_433 25.02 made of them. ADS-B is asserted against dump1090. Off-air
                captures of M17, DMR, TETRA and Meshtastic are checked against what the transmission
                itself says.
              </p>
              <p>
                The browser build is still a plan, and the decoder count is the part that needs to
                grow. The code is the documentation: <a href={`${REPO}/blob/master/crates/app/src/chain.rs`}>
                crates/app/src/chain.rs</a> draws the graph the receiver runs.
              </p>
            </div>
          </div>
        </section>

        <section class="band" id="support">
          <div class="wrap two">
            <div>
              <p class="eyebrow">GitHub Sponsors</p>
              <h2 class="section-h balance">Support the work</h2>
            </div>
            <div class="prose">
              <p>
                WaveShark is GPL-3.0 and free, with no account and nothing phoning home. Sponsorship
                pays for the radios, the test gear and the hours that go into the next batch of
                decoders.
              </p>
              <p>
                Not in a position to sponsor? Filing a good bug with a capture attached is worth just
                as much, and a decoder that is wrong on real signals is the most useful thing you can
                send.
              </p>
              <div class="cta">
                <a class="btn" href="https://github.com/sponsors/v0l">Sponsor on GitHub</a>
                <a class="btn btn-ghost" href={`${REPO}/issues`}>Report a bug</a>
              </div>
            </div>
          </div>
        </section>

        <section class="closer">
          <div class="wrap">
            <h2>Plug in a radio and press play.</h2>
            <p>It opens on a dashboard, and the dial starts at 433.92 MHz where the devices it decodes are.</p>
            <a class="btn btn-lg" href="/download">Download WaveShark</a>
          </div>
        </section>
      </main>
    </>
  );
}
