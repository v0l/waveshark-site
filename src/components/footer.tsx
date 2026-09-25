import { FormattedMessage, useIntl } from 'react-intl';
import { useLocalePath } from '../i18n/context';

const REPO = 'https://github.com/v0l/waveshark';

export function Footer() {
  const to = useLocalePath();
  const intl = useIntl();
  return (
    <footer class="foot">
      <div class="wrap foot-grid wide">
        <div>
          <img class="foot-logo" src="/assets/waveshark-horizontal.svg" alt="WaveShark" width="266" height="50" />
          <p>
            <FormattedMessage defaultMessage="An OSINT tool for RF. GPL-3.0-or-later." />
          </p>
        </div>
        <nav aria-label={intl.formatMessage({ defaultMessage: 'What it reads' })}>
          <p class="foot-h">
            <FormattedMessage defaultMessage="What it reads" />
          </p>
          <a href={to('/decodes/')}>
            <FormattedMessage defaultMessage="Decoders" />
          </a>
          <a href={to('/bands/')}>
            <FormattedMessage defaultMessage="Bands" />
          </a>
          <a href={to('/views/')}>
            <FormattedMessage defaultMessage="Views" />
          </a>
          <a href={to('/use-cases/')}>
            <FormattedMessage defaultMessage="Use cases" />
          </a>
        </nav>
        <nav aria-label={intl.formatMessage({ defaultMessage: 'Running it' })}>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Running it" />
          </p>
          <a href={to('/download/')}>
            <FormattedMessage defaultMessage="Download" />
          </a>
          <a href={to('/hardware/')}>
            <FormattedMessage defaultMessage="Hardware" />
          </a>
          <a href={to('/tuners/')}>
            <FormattedMessage defaultMessage="Public tuners" />
          </a>
          <a href={to('/cli/')}>
            <FormattedMessage defaultMessage="Command line" />
          </a>
          <a href={to('/mcp/')}>
            <FormattedMessage defaultMessage="Agents and MCP" />
          </a>
          <a href={to('/home-assistant/')}>
            <FormattedMessage defaultMessage="Home Assistant" />
          </a>
        </nav>
        <nav aria-label={intl.formatMessage({ defaultMessage: 'Compared with' })}>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Compared with" />
          </p>
          <a href={to('/vs/rtl-433/')}>rtl_433</a>
          <a href={to('/vs/sdrangel/')}>SDRangel</a>
          <a href={to('/vs/gqrx/')}>Gqrx</a>
        </nav>
        <nav aria-label={intl.formatMessage({ defaultMessage: 'Project' })}>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Project" />
          </p>
          <a href={REPO}>
            <FormattedMessage defaultMessage="Repository" />
          </a>
          <a href={`${REPO}/releases`}>
            <FormattedMessage defaultMessage="Releases" />
          </a>
          <a href={`${REPO}/blob/master/CHANGELOG.md`}>
            <FormattedMessage defaultMessage="Changelog" />
          </a>
          <a href={`${REPO}/issues`}>
            <FormattedMessage defaultMessage="Issues" />
          </a>
          <a href="https://github.com/sponsors/v0l">
            <FormattedMessage defaultMessage="Sponsor" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
