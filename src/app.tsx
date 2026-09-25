import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import { useEffect, useState } from 'preact/hooks';
import type { ComponentType } from 'preact';
import { Home } from './pages/home';
import { Download } from './pages/download';
import { Views } from './pages/views';
import { Decodes, DecodePage } from './pages/decodes';
import { Bands, BandPage } from './pages/bands';
import { Hardware, RadioPage } from './pages/hardware';
import { PlatformPage, ComparisonPage } from './pages/guides';
import { Mcp, HomeAssistant, Cli } from './pages/features';
import { UseCases } from './pages/use-cases';
import { UseCase } from './pages/use-case';
import { Tuners } from './pages/tuners';
import { NotFound } from './pages/not-found';
import { Footer } from './components/footer';
import { PAGES } from './meta';
import { LocaleProvider, useString } from './i18n/context';
import { LOCALES, LOCALE_CODES, localePath, splitPath, type Locale } from './i18n/locales';
import { loadMessages } from './i18n/messages';
import type { Messages } from './i18n/copy';
import { FormattedMessage } from 'react-intl';

const PAGE_ROUTES: [string, ComponentType][] = [
  ['/', Home],
  ['/download', Download],
  ['/views', Views],
  ['/decodes', Decodes],
  ['/decodes/:id', DecodePage],
  ['/bands', Bands],
  ['/bands/:id', BandPage],
  ['/hardware', Hardware],
  ['/hardware/:id', RadioPage],
  ['/download/:id', PlatformPage],
  ['/vs/:id', ComparisonPage],
  ['/mcp', Mcp],
  ['/home-assistant', HomeAssistant],
  ['/cli', Cli],
  ['/use-cases', UseCases],
  ['/use-cases/:id', UseCase],
  ['/tuners', Tuners],
];

const LOCALIZED_ROUTES = LOCALE_CODES.flatMap(locale =>
  PAGE_ROUTES.map(([path, component]) => ({
    path: localePath(locale, path).replace(/(.)\/$/, '$1'),
    component,
  })),
);

function Title() {
  const { path } = useLocation();
  const t = useString();
  useEffect(() => {
    const page = PAGES[splitPath(path)[1]];
    if (page) document.title = t(page.title);
  }, [path, t]);
  return null;
}

function Localized(props: { locale: Locale; messages: Messages }) {
  const { path } = useLocation();
  const [locale] = splitPath(path);
  const [held, setHeld] = useState(props);

  useEffect(() => {
    if (locale === held.locale) return;
    let current = true;
    loadMessages(locale).then(messages => current && setHeld({ locale, messages }));
    return () => {
      current = false;
    };
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = LOCALES[held.locale].tag;
  }, [held.locale]);

  return (
    <LocaleProvider locale={held.locale} messages={held.messages}>
      <Title />
      <Skip />
      <Router>
        {LOCALIZED_ROUTES.map(r => (
          <Route key={r.path} path={r.path} component={r.component} />
        ))}
        <Route default component={NotFound} />
      </Router>
      <Footer />
    </LocaleProvider>
  );
}

function Skip() {
  return (
    <a class="skip" href="#main">
      <FormattedMessage defaultMessage="Skip to content" />
    </a>
  );
}

export function App(props: { url?: string; locale: Locale; messages: Messages }) {
  return (
    <LocationProvider {...{ url: props.url }}>
      <Localized locale={props.locale} messages={props.messages} />
    </LocationProvider>
  );
}
