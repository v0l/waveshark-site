import { Article, Closer, Para } from '../components/article';
import { Code } from '../components/code';

const REPO = 'https://github.com/v0l/waveshark';

const MCP_BODY = [
  'Every run of WaveShark serves the receiver over the Model Context Protocol at <code>http://127.0.0.1:8931/mcp</code>. It is the receiver on the screen rather than a headless second one, so what the agent tunes, opens or switches on appears in the window, and it can take a picture of that window to check what it did.',
  'It reads the spectrum, the packets, the calls, the transcript and the tracker. It changes anything in the signal chain and draws the chain itself: add stages, wire them, delete them, undo, and go back to the automatic graph. It reaches the settings too, so it can add a scanner, store a memory, pick a voice, turn on a feed or manage the cached datasets.',
  'The default listens on loopback only, because a socket that drives a radio should not be handed to a network by leaving a host out. <code>--mcp-listen off</code> stops it entirely, and a <code>host:port</code> puts it somewhere else deliberately.',
  'On a radio that can transmit, a channel\u2019s transmit source can be the agent itself. Give it a name and it answers when called: it hears the over, replies in its own voice through a local speech model, and keeps the conversation going for half a minute without being named again.',
];

export function Mcp() {
  return (
    <Article
      trail={[['WaveShark', '/'], ['Use cases', '/use-cases/']]}
      kicker="MCP on 127.0.0.1:8931"
      title="Let an agent drive the radio"
      lede="An SDR receiver an LLM can operate: tune it, open channels, read what arrived, rewire the signal chain, and watch it happen in the window in front of you."
      aside={
        <>
          <p class="foot-h">What an agent can do</p>
          <ul class="ticks">
            <li>Tune, set gains, open and close channels</li>
            <li>Read the spectrum, packets, calls and transcript</li>
            <li>Edit the signal chain stage by stage</li>
            <li>Change any setting, including the scanner table</li>
            <li>Screenshot the window to check its own work</li>
          </ul>
          <p class="foot-h">Where it stops</p>
          <p>Loopback by default, and it will not transmit unless a channel is set up for it.</p>
          <a class="btn btn-sm" href="/download/">Download</a>
        </>
      }
      closer={
        <Closer
          title="Run it with no window at all"
          body="--headless scans and logs exactly as the interface would, which is what belongs on the machine at the antenna."
          href="/cli/"
          cta="The command line"
        />
      }
    >
      {MCP_BODY.map((p, i) => (
        <Para key={i} html={p} />
      ))}
      <Code
        html={[
          '<span class="c">$</span> waveshark --headless --mcp-listen 8931 --print-log',
          '<span class="c">$</span> waveshark --mcp-listen off',
        ].join('\n')}
      />
      <h2 class="sub-h">Why it drives the visible receiver</h2>
      <p>
        An agent with its own hidden radio is an agent whose mistakes are invisible. Driving the
        window means every tune, every channel and every edit to the chain is on the screen while it
        happens, and the screenshot tool means the model can see the same thing you can.
      </p>
      <p>
        The <a href={`${REPO}#readme`}>read me</a> has the full tool list, and{' '}
        <a href="/use-cases/agents/">the use case</a> is the shorter version.
      </p>
    </Article>
  );
}

const HA_BODY = [
  'Point <code>--ha-broker</code> at the MQTT broker Home Assistant already uses and every transmitter the decoders can name becomes a device there, through MQTT discovery. A weather station\u2019s temperature and humidity, a meter\u2019s reading, a tyre sensor\u2019s pressure, and the level each was heard at.',
  'The point is that none of it needs the vendor\u2019s hub. A sensor you already own, transmitting in clear on 433 or 868 MHz, becomes a Home Assistant entity because something listened to it, not because a bridge was bought and an account was made.',
  '<code>--ha-spaces ism,wmbus</code> keeps it to your own sensors and meters, which is almost always what you want. Leave it open on a band full of handsets and the house fills up with devices that rotate their address every quarter of an hour, so the default is the narrow one.',
  'There is a call bus and a message bus as well, with an on-air lamp, so an automation can react to a channel going busy or to a page arriving.',
];

export function HomeAssistant() {
  return (
    <Article
      trail={[['WaveShark', '/'], ['Use cases', '/use-cases/']]}
      kicker="MQTT discovery \u00b7 --ha-broker"
      title="RF sensors into Home Assistant"
      lede="Your own weather station, meters and tyre sensors as Home Assistant devices, from a €30 dongle and no vendor hub."
      aside={
        <>
          <p class="foot-h">What appears</p>
          <ul class="ticks">
            <li>Weather stations: temperature, humidity, rain, wind</li>
            <li>Wireless M-Bus and ERT meters: the reading</li>
            <li>TPMS: pressure, temperature, moving or not</li>
            <li>Signal level for each device heard</li>
            <li>A call bus, a message bus and an on-air lamp</li>
          </ul>
          <p class="foot-h">Bands worth pointing at</p>
          <p class="chips">
            <a class="chip" href="/bands/433-mhz/">433 MHz</a>
            <a class="chip" href="/bands/868-mhz/">868 MHz</a>
            <a class="chip" href="/bands/915-mhz/">915 MHz</a>
          </p>
          <a class="btn btn-sm" href="/download/">Download</a>
        </>
      }
      closer={
        <Closer
          title="Leave it running on the machine at the antenna"
          body="--headless runs the whole receiver with no window, scanning and publishing as it would with one."
          href="/use-cases/home-assistant/"
          cta="Read the use case"
        />
      }
    >
      {HA_BODY.map((p, i) => (
        <Para key={i} html={p} />
      ))}
      <Code
        html={
          '<span class="c">$</span> waveshark --tune 868.3 --headless \\\n    --ha-broker homeassistant.local --ha-spaces ism,wmbus'
        }
      />
      <h2 class="sub-h">A warning worth repeating</h2>
      <p>
        Publishing everything heard is a bad idea on a busy band. Device identities are a record of
        who was where, and a phone or a tag that passes your window every morning is a person.
        Keeping it to <code>ism,wmbus</code> keeps it to your own house.
      </p>
    </Article>
  );
}

const FLAGS: [string, string][] = [
  ['--tune <mhz>', 'Start tuned and listening. Repeat it for several channels at once.'],
  ['--mode <mode>', 'wfm, nfm, am, usb, lsb or cw.'],
  ['--span <khz>', 'Nearest span to this, narrowed in software when the radio cannot sample that slowly.'],
  ['--device <name>', 'Pick a radio when several are plugged in.'],
  ['--gain <db>', 'Total tuner gain, distributed across the radio\u2019s stages.'],
  ['--stream <host>', 'Offer a network tuner as a radio: iqstream, or rtl_tcp://host:port. Repeatable.'],
  ['--iqstream-listen <addr>', 'Serve this span so another machine can read the same samples. Add ,tune to let a subscriber move the dial.'],
  ['--location <lat,lon>', 'The receiver position, which lets one ADS-B frame place an aircraft instead of needing a pair.'],
  ['--record [dir]', 'Write every burst that decodes as an rtl_433 style capture.'],
  ['--capture-iq', 'Write the raw span from the moment the radio starts.'],
  ['--replay [path]', 'Decode a capture, a directory of them, or a packet log, and print what came out.'],
  ['--packet-log <dir>', 'Where the binary packet log goes, one file a day.'],
  ['--survey [file]', 'Record a database of the devices heard and where they were heard.'],
  ['--headless', 'Run with no window, scanning and logging as the interface would.'],
  ['--print-log', 'Print every packet as it arrives, window or not.'],
  ['--mcp-listen <addr>', 'Where to serve MCP, or off. 127.0.0.1:8931 unless told otherwise.'],
  ['--kiss-listen <addr>', 'Serve a KISS TNC, so packet software can use the radio and key AX.25 through it.'],
  ['--ha-broker <broker>', 'Publish every device heard to Home Assistant over MQTT.'],
  ['--ha-spaces <kinds>', 'Which identity spaces are worth publishing, e.g. ism,wmbus.'],
  ['--fetch-data', 'Warm the dataset cache before going somewhere without a connection.'],
  ['--probe [mhz]', 'Check the signal path with no display.'],
  ['--squelch-probe [mhz]', 'Report what the squelch reads on a frequency, for setting one.'],
  ['--settings <name>', 'Open with a settings dialog up: agent, radio, spectrum, waterfall, log, scanners, memory, data or app.'],
];

const VIEW_FLAGS =
  '--chain, --flights, --calls, --messages, --transcript, --links, --control, --channels, --video, --scanners, --gain and --setup open the receiver on a view.';

export function Cli() {
  return (
    <Article
      trail={[['WaveShark', '/'], ['Download', '/download/']]}
      kicker="waveshark --help has the rest"
      title="Command line reference"
      lede="Every switch that sets the receiver up so a session can be reproduced without a dozen clicks, and every diagnostic that prints numbers and exits."
      aside={
        <>
          <p class="foot-h">The two that matter most</p>
          <p>
            <code>--record</code> writes captures that replay identically forever, and{' '}
            <code>--headless</code> runs the whole receiver on a machine with no screen.
          </p>
          <p class="foot-h">Opening on a view</p>
          <p>{VIEW_FLAGS}</p>
          <a class="btn btn-sm" href="/download/">Download</a>
        </>
      }
      closer={
        <Closer
          title="Capture once, decode forever"
          body="A capture that decodes is a test fixture: no radio, same answer every run."
          href="/use-cases/reverse-engineering/"
          cta="Reverse engineering"
        />
      }
    >
      <p>
        Running WaveShark with no arguments gives you the interactive receiver. Everything below
        either sets that receiver up, or is a diagnostic that prints and exits.
      </p>
      <Code
        html={[
          '<span class="c">$</span> waveshark --tune 868.3 --record captures',
          '<span class="c">$</span> waveshark --replay captures',
          '<span class="c">$</span> waveshark --headless --print-log --ha-broker homeassistant.local',
        ].join('\n')}
      />
      <table class="flags">
        <thead>
          <tr>
            <th>Flag</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          {FLAGS.map(([flag, what]) => (
            <tr key={flag}>
              <td><code>{flag}</code></td>
              <td>{what}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p class="note">{VIEW_FLAGS}</p>
    </Article>
  );
}
