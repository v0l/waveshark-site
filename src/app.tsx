import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import { useEffect } from 'preact/hooks';
import { Home } from './pages/home';
import { Download } from './pages/download';
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
        <Route default component={NotFound} />
      </Router>
      <Footer />
    </LocationProvider>
  );
}
