import { useLocation } from 'preact-iso';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocale, useLocalePath } from '../i18n/context';
import { LOCALES, LOCALE_CODES, localePath, splitPath, type Locale } from '../i18n/locales';

const REPO = 'https://github.com/v0l/waveshark';

function LanguagePicker() {
  const { path, route } = useLocation();
  const locale = useLocale();
  const intl = useIntl();
  const change = (next: Locale) => route(localePath(next, splitPath(path)[1]).replace(/\/?$/, '/'));
  return (
    <select
      class="lang"
      value={locale}
      aria-label={intl.formatMessage({ defaultMessage: 'Language' })}
      onChange={e => change(e.currentTarget.value as Locale)}
    >
      {LOCALE_CODES.map(l => (
        <option key={l} value={l} lang={LOCALES[l].tag}>
          {LOCALES[l].name}
        </option>
      ))}
    </select>
  );
}

/// One nav everywhere, so a page added to the site is reachable from every
/// other page rather than from the one that happened to link it.
export function SiteHeader() {
  const to = useLocalePath();
  const intl = useIntl();
  return (
    <header class="topbar">
      <a class="brand" href={to('/')} aria-label={intl.formatMessage({ defaultMessage: 'WaveShark home' })}>
        <img src="/assets/waveshark-horizontal.svg" alt="WaveShark" width="266" height="50" />
      </a>
      <nav class="nav" aria-label={intl.formatMessage({ defaultMessage: 'Primary' })}>
        <a href={to('/decodes/')}>
          <FormattedMessage defaultMessage="Decoders" />
        </a>
        <a href={to('/bands/')}>
          <FormattedMessage defaultMessage="Bands" />
        </a>
        <a href={to('/hardware/')}>
          <FormattedMessage defaultMessage="Hardware" />
        </a>
        <a href={to('/views/')}>
          <FormattedMessage defaultMessage="Views" />
        </a>
        <a href={to('/use-cases/')}>
          <FormattedMessage defaultMessage="Use cases" />
        </a>
        <a href={to('/tuners/')}>
          <FormattedMessage defaultMessage="Tuners" />
        </a>
        <LanguagePicker />
        <a class="btn btn-sm" href={to('/download/')}>
          <FormattedMessage defaultMessage="Download" />
        </a>
      </nav>
    </header>
  );
}

export const HomeHeader = SiteHeader;
export const DownloadHeader = SiteHeader;

export { REPO };
