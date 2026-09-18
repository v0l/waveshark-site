import { useRoute } from 'preact-iso';
import { SiteHeader } from '../components/header';
import { Article, Closer, Para, PageHead } from '../components/article';
import { Code } from '../components/code';
import { DECODES } from '../decodes';
import { BANDS } from '../bands';
import { NotFound } from './not-found';

const bandName = (slug: string) => BANDS.find(b => b.slug === slug)?.name ?? slug;

export function Decodes() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHead
          kicker={`${DECODES.length} decoders, one packet stream`}
          title="What WaveShark decodes"
          lede="Every scanner inside the sampled span runs at once, so these are not modes you switch between. Point the receiver at a band and whichever of them live there are already running."
        />
        <section class="wrap">
          <ul class="cases">
            {DECODES.map(d => (
              <li key={d.slug} class="case">
                <p class="freq">{d.kicker}</p>
                <h2 class="case-h">
                  <a href={`/decodes/${d.slug}/`}>{d.name}</a>
                </h2>
                <p class="case-sum">{d.summary}</p>
                <p class="case-meta">
                  <span class="case-gear">{d.hardware}</span>
                  <a class="chip" href={`/bands/${d.band}/`}>{bandName(d.band)}</a>
                </p>
                <a class="case-more" href={`/decodes/${d.slug}/`}>What it gives you &rarr;</a>
              </li>
            ))}
          </ul>
          <p class="note">
            Coverage is the thin part on ISM: rtl_433 has roughly 250 device decoders and WaveShark
            has forty-five, checked field for field against it. <a href="/bands/">The bands</a> say
            what lives where, and <a href="/use-cases/">the use cases</a> are the jobs these get used
            for.
          </p>
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

export function DecodePage() {
  const { params } = useRoute();
  const item = DECODES.find(d => d.slug === params.id);
  if (!item) return <NotFound />;

  const related = item.related
    .map(slug => DECODES.find(d => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <Article
      trail={[['WaveShark', '/'], ['Decoders', '/decodes/']]}
      kicker={item.kicker}
      title={item.name}
      lede={item.summary}
      aside={
        <>
          <p class="foot-h">What you need</p>
          <p>{item.hardware}</p>
          <p class="foot-h">Band</p>
          <p class="chips">
            <a class="chip" href={`/bands/${item.band}/`}>{bandName(item.band)}</a>
          </p>
          <p class="foot-h">Where it lands</p>
          <p class="chips">
            {item.views.map(v => (
              <a key={v} class="chip" href={`/views/#${v.toLowerCase().replace(/\s+/g, '-')}`}>{v}</a>
            ))}
          </p>
          {item.aka ? (
            <>
              <p class="foot-h">Also called</p>
              <p>{item.aka}</p>
            </>
          ) : null}
          <a class="btn btn-sm" href="/download/">Download</a>
        </>
      }
      closer={
        <Closer
          title="Something did not decode?"
          body="Record the burst with --record and open an issue with the capture. A capture that decodes becomes a test fixture."
          href="https://github.com/v0l/waveshark/issues"
          cta="Open an issue"
        />
      }
    >
      {item.body.map((p, i) => (
        <Para key={i} html={p} />
      ))}
      <h2 class="sub-h">What comes out</h2>
      <ul class="ticks">
        {item.fields.map(f => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      {item.gap ? <p class="caveat">{item.gap}</p> : null}
      {item.cli ? <Code html={item.cli} /> : null}
      <h2 class="sub-h">Read next</h2>
      <p class="chips">
        {related.map(r => (
          <a key={r.slug} class="chip" href={`/decodes/${r.slug}/`}>{r.name}</a>
        ))}
      </p>
    </Article>
  );
}
