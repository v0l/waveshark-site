import { Header } from '../components/header';
import { USE_CASES } from '../content';

const REPO = 'https://github.com/v0l/waveshark';

export function UseCasesHeader() {
  return (
    <Header
      links={[
        { href: '/#hears', label: 'What it hears' },
        { href: '/#views', label: 'Views' },
        { href: '/use-cases/', label: 'Use cases' },
        { href: '/#hardware', label: 'Hardware' },
        { href: REPO, label: 'Source' },
        { href: '/download/', label: 'Download', button: true },
      ]}
    />
  );
}

export function UseCases() {
  return (
    <>
      <UseCasesHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <p class="eyebrow">{USE_CASES.length} jobs one receiver does</p>
            <h1>What you can do with WaveShark</h1>
            <p class="lede">
              The same receiver covers a band, decodes everything inside it and keeps what it heard.
              What changes between these is the antenna, the dial and which view you sit on.
            </p>
          </div>
        </section>

        <section class="wrap">
          <ul class="cases">
            {USE_CASES.map(c => (
              <li key={c.id} class="case">
                <p class="freq">{c.kicker}</p>
                <h2>
                  <a href={`/use-cases/${c.id}/`}>{c.title}</a>
                </h2>
                <p class="case-sum">{c.summary}</p>
                <p class="case-meta">
                  <span class="case-gear">{c.gear}</span>
                  {c.views.map(v => (
                    <span key={v} class="chip">{v}</span>
                  ))}
                </p>
                <a class="case-more" href={`/use-cases/${c.id}/`}>
                  How it works &rarr;
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section class="closer">
          <div class="wrap">
            <h2>Plug in a radio and press play.</h2>
            <p>
              It opens on a dashboard, and the dial starts at 433.92 MHz where the devices it decodes
              are.
            </p>
            <a class="btn btn-lg" href="/download/">Download WaveShark</a>
          </div>
        </section>
      </main>
    </>
  );
}
