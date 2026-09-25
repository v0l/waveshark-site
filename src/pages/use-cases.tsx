import { FormattedMessage } from 'react-intl';
import { SiteHeader } from '../components/header';
import { USE_CASES } from '../content';
import { useCopy, useLocalePath, useString } from '../i18n/context';

export function UseCases() {
  const to = useLocalePath();
  const t = useString();
  const useCases = useCopy()(USE_CASES);
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <p class="eyebrow">
              <FormattedMessage defaultMessage="{count} jobs one receiver does" values={{ count: USE_CASES.length }} />
            </p>
            <h1>
              <FormattedMessage defaultMessage="What you can do with WaveShark" />
            </h1>
            <p class="lede">
              <FormattedMessage defaultMessage="The same receiver covers a band, decodes everything inside it and keeps what it heard. What changes between these is the antenna, the dial and which view you sit on." />
            </p>
          </div>
        </section>

        <section class="wrap">
          <ul class="cases">
            {useCases.map(c => (
              <li key={c.id} class="case">
                <p class="freq">{c.kicker}</p>
                <h2>
                  <a href={to(`/use-cases/${c.id}/`)}>{c.title}</a>
                </h2>
                <p class="case-sum">{c.summary}</p>
                <p class="case-meta">
                  <span class="case-gear">{c.gear}</span>
                  {c.views.map(v => (
                    <span key={v} class="chip">{t(v)}</span>
                  ))}
                </p>
                <a class="case-more" href={to(`/use-cases/${c.id}/`)}>
                  <FormattedMessage defaultMessage="How it works →" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section class="closer">
          <div class="wrap">
            <h2>
              <FormattedMessage defaultMessage="Plug in a radio and press play." />
            </h2>
            <p>
              <FormattedMessage defaultMessage="It opens on a dashboard, and the dial starts at 433.92 MHz where the devices it decodes are." />
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
