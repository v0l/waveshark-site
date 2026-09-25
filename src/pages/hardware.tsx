import { useRoute } from 'preact-iso';
import { FormattedMessage } from 'react-intl';
import { SiteHeader } from '../components/header';
import { Article, Closer, Para, PageHead } from '../components/article';
import { RADIOS } from '../radios';
import { DECODES } from '../decodes';
import { NotFound } from './not-found';
import { useCopy, useLocalePath } from '../i18n/context';

/// The decoders a wide radio unlocks, which is the honest reason to buy one.
const WIDE = DECODES.filter(d => /^HackRF|^RTL-SDR, an L band/.test(d.hardware)).map(d => d.slug);

export function Hardware() {
  const to = useLocalePath();
  const copy = useCopy();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHead
          kicker={<FormattedMessage defaultMessage="Four radios, and none of them expensive" />}
          title={<FormattedMessage defaultMessage="Hardware for WaveShark" />}
          lede={
            <FormattedMessage defaultMessage="A €30 dongle does most of what this site describes. A HackRF or a LimeSDR buys the wide protocols and a transmitter, and a tuner on another machine puts the antenna where the signals are." />
          }
        />
        <section class="wrap">
          <ul class="cases">
            {copy(RADIOS).map(r => (
              <li key={r.slug} class="case">
                <p class="freq">{r.kicker}</p>
                <h2 class="case-h">
                  <a href={to(`/hardware/${r.slug}/`)}>{r.name}</a>
                </h2>
                <p class="case-sum">{r.summary}</p>
                <a class="case-more" href={to(`/hardware/${r.slug}/`)}>
                  <FormattedMessage defaultMessage="What it reaches →" />
                </a>
              </li>
            ))}
          </ul>
          <p class="note">
            <FormattedMessage
              defaultMessage="The dividing line is bandwidth, not cleverness: one Wi-Fi channel is 20 MHz and a television multiplex is 8, where a dongle carries about 2.4. Everything narrower than that, which is most of <decodes>the decoder list</decodes>, runs on the cheapest receiver ever made."
              values={{ decodes: chunks => <a href={to('/decodes/')}>{chunks}</a> }}
            />
          </p>
        </section>
        <Closer
          title={<FormattedMessage defaultMessage="Got a radio already?" />}
          body={
            <FormattedMessage defaultMessage="Plug it in and press play. It opens on 433.92 MHz, where the devices it decodes are." />
          }
          href="/download/"
          cta={<FormattedMessage defaultMessage="Download WaveShark" />}
        />
      </main>
    </>
  );
}

export function RadioPage() {
  const { params } = useRoute();
  const to = useLocalePath();
  const copy = useCopy();
  const radio = copy(RADIOS).find(r => r.slug === params.id);
  const wide = copy(DECODES).filter(d => WIDE.includes(d.slug));
  if (!radio) return <NotFound />;

  return (
    <Article
      trail={[
        ['WaveShark', '/'],
        [<FormattedMessage defaultMessage="Hardware" />, '/hardware/'],
      ]}
      kicker={radio.kicker}
      title={radio.name}
      lede={radio.summary}
      aside={
        <>
          <table class="flags specs">
            <tbody>
              {radio.specs.map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {radio.slug !== 'remote-tuners' ? (
            <>
              <p class="foot-h">
                <FormattedMessage defaultMessage="Wide protocols" />
              </p>
              <p class="chips">
                {wide.slice(0, 6).map(d => (
                  <a key={d.slug} class="chip" href={to(`/decodes/${d.slug}/`)}>
                    {d.name}
                  </a>
                ))}
              </p>
            </>
          ) : null}
          <a class="btn btn-sm" href={to('/download/')}>
            <FormattedMessage defaultMessage="Download" />
          </a>
        </>
      }
      closer={
        <Closer
          title={<FormattedMessage defaultMessage="Which radio for which job?" />}
          body={
            <FormattedMessage defaultMessage="The use cases say what each one is for, from a device survey on a dongle to drone Remote ID on a HackRF." />
          }
          href="/use-cases/"
          cta={<FormattedMessage defaultMessage="Read the use cases" />}
        />
      }
    >
      {radio.body.map((p, i) => (
        <Para key={i} html={p} />
      ))}
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="What it reaches" />
      </h2>
      <ul class="ticks">
        {radio.reach.map(x => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="What it will not do" />
      </h2>
      <ul class="ticks crosses">
        {radio.limits.map(x => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      {radio.setup ? (
        <>
          <h2 class="sub-h">
            <FormattedMessage defaultMessage="Setup" />
          </h2>
          <Para html={radio.setup} />
        </>
      ) : null}
    </Article>
  );
}
