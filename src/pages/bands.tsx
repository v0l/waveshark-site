import { useRoute } from 'preact-iso';
import { FormattedMessage } from 'react-intl';
import { SiteHeader } from '../components/header';
import { Article, Closer, Para, PageHead } from '../components/article';
import { Code } from '../components/code';
import { BANDS } from '../bands';
import { DECODES } from '../decodes';
import { NotFound } from './not-found';
import { useCopy, useLocalePath } from '../i18n/context';

const livesOn = (decodes: typeof DECODES, slug: string) => decodes.filter(d => d.band === slug);

export function Bands() {
  const to = useLocalePath();
  const copy = useCopy();
  const decodes = copy(DECODES);
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHead
          kicker={<FormattedMessage defaultMessage="The dial is where you look, the span is what you collect" />}
          title={<FormattedMessage defaultMessage="What is transmitting on each band" />}
          lede={
            <FormattedMessage defaultMessage="Pick a band, point a radio at it and every decoder that lives there runs at once. These pages say what is on each one, what it takes to hear it and where to start." />
          }
        />
        <section class="wrap">
          <ul class="cases">
            {copy(BANDS).map(b => (
              <li key={b.slug} class="case">
                <p class="freq">{b.range}</p>
                <h2 class="case-h">
                  <a href={to(`/bands/${b.slug}/`)}>{b.name}</a>
                </h2>
                <p class="case-sum">{b.summary}</p>
                <p class="case-meta">
                  <span class="case-gear">{b.hardware}</span>
                  {livesOn(decodes, b.slug).slice(0, 4).map(d => (
                    <span key={d.slug} class="chip">{d.name}</span>
                  ))}
                </p>
                <a class="case-more" href={to(`/bands/${b.slug}/`)}>
                  <FormattedMessage defaultMessage="What is on it →" />
                </a>
              </li>
            ))}
          </ul>
        </section>
        <Closer
          title={<FormattedMessage defaultMessage="Plug in a radio and press play." />}
          body={
            <FormattedMessage defaultMessage="It opens on the dashboard, and the dial starts at 433.92 MHz where the devices it decodes are." />
          }
          href="/download/"
          cta={<FormattedMessage defaultMessage="Download WaveShark" />}
        />
      </main>
    </>
  );
}

export function BandPage() {
  const { params } = useRoute();
  const to = useLocalePath();
  const copy = useCopy();
  const band = copy(BANDS).find(b => b.slug === params.id);
  const decodes = copy(DECODES);
  if (!band) return <NotFound />;
  const here = livesOn(decodes, band.slug);

  return (
    <Article
      trail={[
        ['WaveShark', '/'],
        [<FormattedMessage defaultMessage="Bands" />, '/bands/'],
      ]}
      kicker={band.range}
      title={band.name}
      lede={band.summary}
      aside={
        <>
          <p class="foot-h">
            <FormattedMessage defaultMessage="What you need" />
          </p>
          <p>{band.hardware}</p>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Decoders here" />
          </p>
          <p class="chips">
            {here.map(d => (
              <a key={d.slug} class="chip" href={to(`/decodes/${d.slug}/`)}>
                {d.name}
              </a>
            ))}
          </p>
          <a class="btn btn-sm" href={to('/download/')}>
            <FormattedMessage defaultMessage="Download" />
          </a>
        </>
      }
      closer={
        <Closer
          title={<FormattedMessage defaultMessage="Every band, one receiver." />}
          body={
            <FormattedMessage defaultMessage="The decoders do not follow the dial: everything inside the span runs all the time." />
          }
          href="/bands/"
          cta={<FormattedMessage defaultMessage="All the bands" />}
        />
      }
    >
      {band.body.map((p, i) => (
        <Para key={i} html={p} />
      ))}
      <Code html={band.start} />
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="What lives here" />
      </h2>
      <ul class="band-list">
        {here.map(d => (
          <li key={d.slug}>
            <a href={to(`/decodes/${d.slug}/`)}>{d.name}</a>
            <span>{d.summary}</span>
          </li>
        ))}
      </ul>
    </Article>
  );
}
