import { FormattedMessage } from 'react-intl';
import { SiteHeader } from '../components/header';
import { useLocalePath } from '../i18n/context';

export function NotFound() {
  const to = useLocalePath();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <p class="eyebrow">404</p>
            <h1>
              <FormattedMessage defaultMessage="Nothing on this frequency" />
            </h1>
            <p class="lede">
              <FormattedMessage defaultMessage="The page you asked for is not here. The spectrum is." />
            </p>
            <div class="cta">
              <a class="btn" href={to('/')}>
                <FormattedMessage defaultMessage="Back to the front page" />
              </a>
              <a class="btn btn-ghost" href={to('/download/')}>
                <FormattedMessage defaultMessage="Download" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
