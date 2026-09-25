import { FormattedMessage, useIntl } from 'react-intl';
import { SiteHeader } from '../components/header';
import { VIEWS } from '../content';
import { useCopy, useLocalePath } from '../i18n/context';

export function Views() {
  const to = useLocalePath();
  const copy = useCopy();
  const intl = useIntl();
  const views = copy(VIEWS);
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <p class="eyebrow">
              <FormattedMessage defaultMessage="A strip of tabs, Ctrl and a digit for the first ten, Ctrl+` to go back" />
            </p>
            <h1>
              <FormattedMessage defaultMessage="Fifteen views on one stream" />
            </h1>
            <p class="lede">
              <FormattedMessage defaultMessage="Every decoded frame arrives in one place, and each view is a different reading of it. None of them knows a protocol: a DMR call, a TETRA call and an M17 call are the same row with different fields filled in, and an aircraft, a vessel and a mesh node are the same track." />
            </p>
          </div>
        </section>

        <section class="wrap">
          <p class="prose views-intro">
            <FormattedMessage defaultMessage="The packet list runs along the bottom of all of them, newest last, with the selected burst’s envelope, instantaneous frequency and hex dump beside it. The top row of tabs is what the receiver can do and what it heard; the bottom row is who is out there." />
          </p>
          <ol class="views">
            {VIEWS.map((v, i) => (
              <li key={v.title} id={v.title.toLowerCase().replace(/\s+/g, '-')}>
                <span class="key">{v.key}</span>
                <h2>{views[i].title}</h2>
                <p>{views[i].body}</p>
              </li>
            ))}
          </ol>
          <p class="note">
            <FormattedMessage
              defaultMessage="<cases>The use cases</cases> are the jobs these views get used for, from a device survey to letting an agent drive the radio."
              values={{ cases: chunks => <a href={to('/use-cases/')}>{chunks}</a> }}
            />
          </p>
        </section>

        <section class="band shot">
          <div class="wrap">
            <figure>
              <img
                src="/assets/screenshot.png"
                alt={intl.formatMessage({
                  defaultMessage:
                    'WaveShark decoding a weather station on 433.92 MHz: spectrum and waterfall above, packet list below.',
                })}
                width={734}
                height={704}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <FormattedMessage defaultMessage="Decoding a weather station on 433.92 MHz. The tab strip swaps the spectrum for the signal chain, the map and its track table, the call list, the transcript, the messages, the picture or the keys." />
              </figcaption>
            </figure>
          </div>
        </section>

        <section class="closer">
          <div class="wrap">
            <h2>
              <FormattedMessage defaultMessage="Plug in a radio and press play." />
            </h2>
            <p>
              <FormattedMessage defaultMessage="It opens on the dashboard, and the dial starts at 433.92 MHz where the devices it decodes are." />
            </p>
            <a class="btn btn-lg" href={to('/download/')}>
              <FormattedMessage defaultMessage="Download WaveShark" />
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
