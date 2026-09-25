import { FormattedMessage } from 'react-intl';
import { Article, Closer, Para } from '../components/article';
import { Code } from '../components/code';
import { FLAGS, HA_BODY, MCP_BODY, VIEW_FLAGS } from '../features';
import { useCopy, useLocalePath, useString } from '../i18n/context';

const REPO = 'https://github.com/v0l/waveshark';

export function Mcp() {
  const to = useLocalePath();
  const copy = useCopy();
  return (
    <Article
      trail={[
        ['WaveShark', '/'],
        [<FormattedMessage defaultMessage="Use cases" />, '/use-cases/'],
      ]}
      kicker={<FormattedMessage defaultMessage="MCP on 127.0.0.1:8931" />}
      title={<FormattedMessage defaultMessage="Let an agent drive the radio" />}
      lede={
        <FormattedMessage defaultMessage="An SDR receiver an LLM can operate: tune it, open channels, read what arrived, rewire the signal chain, and watch it happen in the window in front of you." />
      }
      aside={
        <>
          <p class="foot-h">
            <FormattedMessage defaultMessage="What an agent can do" />
          </p>
          <ul class="ticks">
            <li>
              <FormattedMessage defaultMessage="Tune, set gains, open and close channels" />
            </li>
            <li>
              <FormattedMessage defaultMessage="Read the spectrum, packets, calls and transcript" />
            </li>
            <li>
              <FormattedMessage defaultMessage="Edit the signal chain stage by stage" />
            </li>
            <li>
              <FormattedMessage defaultMessage="Change any setting, including the scanner table" />
            </li>
            <li>
              <FormattedMessage defaultMessage="Screenshot the window to check its own work" />
            </li>
          </ul>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Where it stops" />
          </p>
          <p>
            <FormattedMessage defaultMessage="Loopback by default, and it will not transmit unless a channel is set up for it." />
          </p>
          <a class="btn btn-sm" href={to('/download/')}>
            <FormattedMessage defaultMessage="Download" />
          </a>
        </>
      }
      closer={
        <Closer
          title={<FormattedMessage defaultMessage="Run it with no window at all" />}
          body={
            <FormattedMessage defaultMessage="--headless scans and logs exactly as the interface would, which is what belongs on the machine at the antenna." />
          }
          href="/cli/"
          cta={<FormattedMessage defaultMessage="The command line" />}
        />
      }
    >
      {copy(MCP_BODY).map((p, i) => (
        <Para key={i} html={p} />
      ))}
      <Code
        html={[
          '<span class="c">$</span> waveshark --headless --mcp-listen 8931 --print-log',
          '<span class="c">$</span> waveshark --mcp-listen off',
        ].join('\n')}
      />
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="Why it drives the visible receiver" />
      </h2>
      <p>
        <FormattedMessage defaultMessage="An agent with its own hidden radio is an agent whose mistakes are invisible. Driving the window means every tune, every channel and every edit to the chain is on the screen while it happens, and the screenshot tool means the model can see the same thing you can." />
      </p>
      <p>
        <FormattedMessage
          defaultMessage="The <readme>read me</readme> has the full tool list, and <usecase>the use case</usecase> is the shorter version."
          values={{
            readme: chunks => <a href={`${REPO}#readme`}>{chunks}</a>,
            usecase: chunks => <a href={to('/use-cases/agents/')}>{chunks}</a>,
          }}
        />
      </p>
    </Article>
  );
}

export function HomeAssistant() {
  const to = useLocalePath();
  const copy = useCopy();
  return (
    <Article
      trail={[
        ['WaveShark', '/'],
        [<FormattedMessage defaultMessage="Use cases" />, '/use-cases/'],
      ]}
      kicker="MQTT discovery · --ha-broker"
      title={<FormattedMessage defaultMessage="RF sensors into Home Assistant" />}
      lede={
        <FormattedMessage defaultMessage="Your own weather station, meters and tyre sensors as Home Assistant devices, from a €30 dongle and no vendor hub." />
      }
      aside={
        <>
          <p class="foot-h">
            <FormattedMessage defaultMessage="What appears" />
          </p>
          <ul class="ticks">
            <li>
              <FormattedMessage defaultMessage="Weather stations: temperature, humidity, rain, wind" />
            </li>
            <li>
              <FormattedMessage defaultMessage="Wireless M-Bus and ERT meters: the reading" />
            </li>
            <li>
              <FormattedMessage defaultMessage="TPMS: pressure, temperature, moving or not" />
            </li>
            <li>
              <FormattedMessage defaultMessage="Signal level for each device heard" />
            </li>
            <li>
              <FormattedMessage defaultMessage="A call bus, a message bus and an on-air lamp" />
            </li>
          </ul>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Bands worth pointing at" />
          </p>
          <p class="chips">
            <a class="chip" href={to('/bands/433-mhz/')}>433 MHz</a>
            <a class="chip" href={to('/bands/868-mhz/')}>868 MHz</a>
            <a class="chip" href={to('/bands/915-mhz/')}>915 MHz</a>
          </p>
          <a class="btn btn-sm" href={to('/download/')}>
            <FormattedMessage defaultMessage="Download" />
          </a>
        </>
      }
      closer={
        <Closer
          title={<FormattedMessage defaultMessage="Leave it running on the machine at the antenna" />}
          body={
            <FormattedMessage defaultMessage="--headless runs the whole receiver with no window, scanning and publishing as it would with one." />
          }
          href="/use-cases/home-assistant/"
          cta={<FormattedMessage defaultMessage="Read the use case" />}
        />
      }
    >
      {copy(HA_BODY).map((p, i) => (
        <Para key={i} html={p} />
      ))}
      <Code
        html={
          '<span class="c">$</span> waveshark --tune 868.3 --headless \\\n    --ha-broker homeassistant.local --ha-spaces ism,wmbus'
        }
      />
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="A warning worth repeating" />
      </h2>
      <p>
        <FormattedMessage defaultMessage="Publishing everything heard is a bad idea on a busy band. Device identities are a record of who was where, and a phone or a tag that passes your window every morning is a person. Keeping it to <code>ism,wmbus</code> keeps it to your own house." />
      </p>
    </Article>
  );
}

export function Cli() {
  const to = useLocalePath();
  const copy = useCopy();
  const t = useString();
  return (
    <Article
      trail={[
        ['WaveShark', '/'],
        [<FormattedMessage defaultMessage="Download" />, '/download/'],
      ]}
      kicker={<FormattedMessage defaultMessage="waveshark --help has the rest" />}
      title={<FormattedMessage defaultMessage="Command line reference" />}
      lede={
        <FormattedMessage defaultMessage="Every switch that sets the receiver up so a session can be reproduced without a dozen clicks, and every diagnostic that prints numbers and exits." />
      }
      aside={
        <>
          <p class="foot-h">
            <FormattedMessage defaultMessage="The two that matter most" />
          </p>
          <p>
            <FormattedMessage defaultMessage="<code>--record</code> writes captures that replay identically forever, and <code>--headless</code> runs the whole receiver on a machine with no screen." />
          </p>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Opening on a view" />
          </p>
          <p>{t(VIEW_FLAGS)}</p>
          <a class="btn btn-sm" href={to('/download/')}>
            <FormattedMessage defaultMessage="Download" />
          </a>
        </>
      }
      closer={
        <Closer
          title={<FormattedMessage defaultMessage="Capture once, decode forever" />}
          body={
            <FormattedMessage defaultMessage="A capture that decodes is a test fixture: no radio, same answer every run." />
          }
          href="/use-cases/reverse-engineering/"
          cta={<FormattedMessage defaultMessage="Reverse engineering" />}
        />
      }
    >
      <p>
        <FormattedMessage defaultMessage="Running WaveShark with no arguments gives you the interactive receiver. Everything below either sets that receiver up, or is a diagnostic that prints and exits." />
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
            <th>
              <FormattedMessage defaultMessage="Flag" />
            </th>
            <th>
              <FormattedMessage defaultMessage="What it does" />
            </th>
          </tr>
        </thead>
        <tbody>
          {copy(FLAGS).map(({ flag, what }) => (
            <tr key={flag}>
              <td>
                <code>{flag}</code>
              </td>
              <td>{what}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p class="note">{t(VIEW_FLAGS)}</p>
    </Article>
  );
}
