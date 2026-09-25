import { useRoute } from 'preact-iso';
import { FormattedMessage, useIntl } from 'react-intl';
import { Code } from '../components/code';
import { USE_CASES } from '../content';
import { NotFound } from './not-found';
import { SiteHeader } from '../components/header';
import { useCopy, useLocalePath, useString } from '../i18n/context';

/// Anything with a paragraph that names a flag or a file carries markup in the
/// copy, so the body is written as HTML rather than escaped text.
function Para({ html }: { html: string }) {
  return <p dangerouslySetInnerHTML={{ __html: html }} />;
}

export function UseCase() {
  const { params } = useRoute();
  const to = useLocalePath();
  const intl = useIntl();
  const t = useString();
  const useCases = useCopy()(USE_CASES);
  const item = useCases.find(c => c.id === params.id);
  if (!item) return <NotFound />;

  const i = useCases.indexOf(item);
  const next = useCases[(i + 1) % useCases.length];

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <nav class="crumbs" aria-label={intl.formatMessage({ defaultMessage: 'Breadcrumb' })}>
              <a href={to('/')}>WaveShark</a> <span>/</span>{' '}
              <a href={to('/use-cases/')}>
                <FormattedMessage defaultMessage="Use cases" />
              </a>
            </nav>
            <p class="eyebrow">{item.kicker}</p>
            <h1>{item.title}</h1>
            <p class="lede">{item.summary}</p>
          </div>
        </section>

        <section class="wrap case-body">
          <div class="prose">
            {item.body.map((p, n) => (
              <Para key={n} html={p} />
            ))}
            {item.cli ? <Code html={item.cli} /> : null}
          </div>
          <aside class="case-side">
            <p class="foot-h">
              <FormattedMessage defaultMessage="What you need" />
            </p>
            <p>{item.gear}</p>
            <p class="foot-h">
              <FormattedMessage defaultMessage="Where it lives" />
            </p>
            <p class="chips">
              {item.views.map(v => (
                <span key={v} class="chip">{t(v)}</span>
              ))}
            </p>
            <a class="btn btn-sm" href={to('/download/')}>
              <FormattedMessage defaultMessage="Download" />
            </a>
          </aside>
        </section>

        <section class="closer">
          <div class="wrap">
            <h2>{next.title}</h2>
            <p>{next.summary}</p>
            <a class="btn btn-lg" href={to(`/use-cases/${next.id}/`)}>
              <FormattedMessage defaultMessage="Read that one" />
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
