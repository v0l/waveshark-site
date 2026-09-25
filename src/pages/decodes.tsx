import { useRoute } from 'preact-iso';
import { FormattedMessage } from 'react-intl';
import { SiteHeader } from '../components/header';
import { Article, Closer, Para, PageHead } from '../components/article';
import { Code } from '../components/code';
import { DECODES } from '../decodes';
import { BANDS } from '../bands';
import { NotFound } from './not-found';
import { useCopy, useLocalePath, useString } from '../i18n/context';

const bandName = (bands: typeof BANDS, slug: string) => bands.find(b => b.slug === slug)?.name ?? slug;

const viewAnchor = (title: string) => title.toLowerCase().replace(/\s+/g, '-');

export function Decodes() {
  const to = useLocalePath();
  const copy = useCopy();
  const bands = copy(BANDS);
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHead
          kicker={
            <FormattedMessage defaultMessage="{count} decoders, one packet stream" values={{ count: DECODES.length }} />
          }
          title={<FormattedMessage defaultMessage="What WaveShark decodes" />}
          lede={
            <FormattedMessage defaultMessage="Every scanner inside the sampled span runs at once, so these are not modes you switch between. Point the receiver at a band and whichever of them live there are already running." />
          }
        />
        <section class="wrap">
          <ul class="cases">
            {copy(DECODES).map(d => (
              <li key={d.slug} class="case">
                <p class="freq">{d.kicker}</p>
                <h2 class="case-h">
                  <a href={to(`/decodes/${d.slug}/`)}>{d.name}</a>
                </h2>
                <p class="case-sum">{d.summary}</p>
                <p class="case-meta">
                  <span class="case-gear">{d.hardware}</span>
                  <a class="chip" href={to(`/bands/${d.band}/`)}>{bandName(bands, d.band)}</a>
                </p>
                <a class="case-more" href={to(`/decodes/${d.slug}/`)}>
                  <FormattedMessage defaultMessage="What it gives you →" />
                </a>
              </li>
            ))}
          </ul>
          <p class="note">
            <FormattedMessage
              defaultMessage="Coverage is the thin part on ISM: rtl_433 has roughly 250 device decoders and WaveShark has forty-five, checked field for field against it. <bands>The bands</bands> say what lives where, and <cases>the use cases</cases> are the jobs these get used for."
              values={{
                bands: chunks => <a href={to('/bands/')}>{chunks}</a>,
                cases: chunks => <a href={to('/use-cases/')}>{chunks}</a>,
              }}
            />
          </p>
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

export function DecodePage() {
  const { params } = useRoute();
  const to = useLocalePath();
  const copy = useCopy();
  const t = useString();
  const decodes = copy(DECODES);
  const bands = copy(BANDS);
  const item = decodes.find(d => d.slug === params.id);
  if (!item) return <NotFound />;

  const related = item.related
    .map(slug => decodes.find(d => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <Article
      trail={[
        ['WaveShark', '/'],
        [<FormattedMessage defaultMessage="Decoders" />, '/decodes/'],
      ]}
      kicker={item.kicker}
      title={item.name}
      lede={item.summary}
      aside={
        <>
          <p class="foot-h">
            <FormattedMessage defaultMessage="What you need" />
          </p>
          <p>{item.hardware}</p>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Band" />
          </p>
          <p class="chips">
            <a class="chip" href={to(`/bands/${item.band}/`)}>{bandName(bands, item.band)}</a>
          </p>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Where it lands" />
          </p>
          <p class="chips">
            {item.views.map(v => (
              <a key={v} class="chip" href={to(`/views/#${viewAnchor(v)}`)}>
                {t(v)}
              </a>
            ))}
          </p>
          {item.aka ? (
            <>
              <p class="foot-h">
                <FormattedMessage defaultMessage="Also called" />
              </p>
              <p>{item.aka}</p>
            </>
          ) : null}
          <a class="btn btn-sm" href={to('/download/')}>
            <FormattedMessage defaultMessage="Download" />
          </a>
        </>
      }
      closer={
        <Closer
          title={<FormattedMessage defaultMessage="Something did not decode?" />}
          body={
            <FormattedMessage defaultMessage="Record the burst with --record and open an issue with the capture. A capture that decodes becomes a test fixture." />
          }
          href="https://github.com/v0l/waveshark/issues"
          cta={<FormattedMessage defaultMessage="Open an issue" />}
        />
      }
    >
      {item.body.map((p, i) => (
        <Para key={i} html={p} />
      ))}
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="What comes out" />
      </h2>
      <ul class="ticks">
        {item.fields.map(f => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      {item.gap ? <p class="caveat">{item.gap}</p> : null}
      {item.cli ? <Code html={item.cli} /> : null}
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="Read next" />
      </h2>
      <p class="chips">
        {related.map(r => (
          <a key={r.slug} class="chip" href={to(`/decodes/${r.slug}/`)}>
            {r.name}
          </a>
        ))}
      </p>
    </Article>
  );
}
