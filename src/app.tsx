import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import { useEffect } from 'preact/hooks';
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
import { NotFound } from './pages/not-found';
import { Footer } from './components/footer';
import { PAGES } from './meta';

function Title() {
  const { path } = useLocation();
  useEffect(() => {
    const page = PAGES[path];
    if (page) document.title = page.title;
  }, [path]);
  return null;
}

export function App(props: { url?: string }) {
  return (
    <LocationProvider {...props}>
      <Title />
      <a class="skip" href="#main">Skip to content</a>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/download" component={Download} />
        <Route path="/views" component={Views} />
        <Route path="/decodes" component={Decodes} />
        <Route path="/decodes/:id" component={DecodePage} />
        <Route path="/bands" component={Bands} />
        <Route path="/bands/:id" component={BandPage} />
        <Route path="/hardware" component={Hardware} />
        <Route path="/hardware/:id" component={RadioPage} />
        <Route path="/download/:id" component={PlatformPage} />
        <Route path="/vs/:id" component={ComparisonPage} />
        <Route path="/mcp" component={Mcp} />
        <Route path="/home-assistant" component={HomeAssistant} />
        <Route path="/cli" component={Cli} />
        <Route path="/use-cases" component={UseCases} />
        <Route path="/use-cases/:id" component={UseCase} />
        <Route default component={NotFound} />
      </Router>
      <Footer />
    </LocationProvider>
  );
}
