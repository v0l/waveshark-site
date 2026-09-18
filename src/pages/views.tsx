import { Header } from '../components/header';
import { VIEWS } from '../content';

const REPO = 'https://github.com/v0l/waveshark';

export function ViewsHeader() {
  return (
    <Header
      links={[
        { href: '/#hears', label: 'What it hears' },
        { href: '/views/', label: 'Views' },
        { href: '/use-cases/', label: 'Use cases' },
        { href: '/#hardware', label: 'Hardware' },
        { href: REPO, label: 'Source' },
        { href: '/download/', label: 'Download', button: true },
      ]}
    />
  );
}

export function Views() {
  return (
    <>
      <ViewsHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <p class="eyebrow">A strip of tabs, Ctrl and a digit for the first ten, Ctrl+` to go back</p>
            <h1>Fifteen views on one stream</h1>
            <p class="lede">
              Every decoded frame arrives in one place, and each view is a different reading of it.
              None of them knows a protocol: a DMR call, a TETRA call and an M17 call are the same row
              with different fields filled in, and an aircraft, a vessel and a mesh node are the same
              track.
            </p>
          </div>
        </section>

        <section class="wrap">
          <p class="prose views-intro">
            The packet list runs along the bottom of all of them, newest last, with the selected
            burst&rsquo;s envelope, instantaneous frequency and hex dump beside it. The top row of tabs
            is what the receiver can do and what it heard; the bottom row is who is out there.
          </p>
          <ol class="views">
            {VIEWS.map(v => (
              <li key={v.title} id={v.title.toLowerCase().replace(/\s+/g, '-')}>
                <span class="key">{v.key}</span>
                <h2>{v.title}</h2>
                <p>{v.body}</p>
              </li>
            ))}
          </ol>
          <p class="note">
            <a href="/use-cases/">The use cases</a> are the jobs these views get used for, from a
            device survey to letting an agent drive the radio.
          </p>
        </section>

        <section class="band shot">
          <div class="wrap">
            <figure>
              <img
                src="/assets/screenshot.png"
                alt="WaveShark decoding a weather station on 433.92 MHz: spectrum and waterfall above, packet list below."
                width={734}
                height={704}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                Decoding a weather station on 433.92 MHz. The tab strip swaps the spectrum for the
                signal chain, the map and its track table, the call list, the transcript, the
                messages, the picture or the keys.
              </figcaption>
            </figure>
          </div>
        </section>

        <section class="closer">
          <div class="wrap">
            <h2>Plug in a radio and press play.</h2>
            <p>
              It opens on the dashboard, and the dial starts at 433.92 MHz where the devices it
              decodes are.
            </p>
            <a class="btn btn-lg" href="/download/">Download WaveShark</a>
          </div>
        </section>
      </main>
    </>
  );
}
