import { useRoute } from 'preact-iso';
import { SiteHeader } from '../components/header';
import { Article, Closer, Para, PageHead } from '../components/article';
import { Code } from '../components/code';
import { BANDS } from '../bands';
import { DECODES } from '../decodes';
import { NotFound } from './not-found';

const livesOn = (slug: string) => DECODES.filter(d => d.band === slug);

export function Bands() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHead
          kicker="The dial is where you look, the span is what you collect"
          title="What is transmitting on each band"
          lede="Pick a band, point a radio at it and every decoder that lives there runs at once. These pages say what is on each one, what it takes to hear it and where to start."
        />
        <section class="wrap">
          <ul class="cases">
            {BANDS.map(b => (
              <li key={b.slug} class="case">
                <p class="freq">{b.range}</p>
                <h2 class="case-h">
                  <a href={`/bands/${b.slug}/`}>{b.name}</a>
                </h2>
                <p class="case-sum">{b.summary}</p>
                <p class="case-meta">
                  <span class="case-gear">{b.hardware}</span>
                  {livesOn(b.slug).slice(0, 4).map(d => (
                    <span key={d.slug} class="chip">{d.name}</span>
                  ))}
                </p>
                <a class="case-more" href={`/bands/${b.slug}/`}>What is on it &rarr;</a>
              </li>
            ))}
          </ul>
        </section>
        <Closer
          title="Plug in a radio and press play."
          body="It opens on the dashboard, and the dial starts at 433.92 MHz where the devices it decodes are."
          href="/download/"
          cta="Download WaveShark"
        />
      </main>
    </>
  );
}

export function BandPage() {
  const { params } = useRoute();
  const band = BANDS.find(b => b.slug === params.id);
  if (!band) return <NotFound />;
  const here = livesOn(band.slug);

  return (
    <Article
      trail={[['WaveShark', '/'], ['Bands', '/bands/']]}
      kicker={band.range}
      title={band.name}
      lede={band.summary}
      aside={
        <>
          <p class="foot-h">What you need</p>
          <p>{band.hardware}</p>
          <p class="foot-h">Decoders here</p>
          <p class="chips">
            {here.map(d => (
              <a key={d.slug} class="chip" href={`/decodes/${d.slug}/`}>{d.name}</a>
            ))}
          </p>
          <a class="btn btn-sm" href="/download/">Download</a>
        </>
      }
      closer={
        <Closer
          title="Every band, one receiver."
          body="The decoders do not follow the dial: everything inside the span runs all the time."
          href="/bands/"
          cta="All the bands"
        />
      }
    >
      {band.body.map((p, i) => (
        <Para key={i} html={p} />
      ))}
      <Code html={band.start} />
      <h2 class="sub-h">What lives here</h2>
      <ul class="band-list">
        {here.map(d => (
          <li key={d.slug}>
            <a href={`/decodes/${d.slug}/`}>{d.name}</a>
            <span>{d.summary}</span>
          </li>
        ))}
      </ul>
    </Article>
  );
}
