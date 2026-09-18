import { Header } from '../components/header';

export function NotFound() {
  return (
    <>
      <Header
        links={[
          { href: '/#hears', label: 'What it hears' },
          { href: 'https://github.com/v0l/waveshark', label: 'Source' },
          { href: '/download', label: 'Download', button: true },
        ]}
      />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <p class="eyebrow">404</p>
            <h1>Nothing on this frequency</h1>
            <p class="lede">The page you asked for is not here. The spectrum is.</p>
            <div class="cta">
              <a class="btn" href="/">Back to the front page</a>
              <a class="btn btn-ghost" href="/download/">Download</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
