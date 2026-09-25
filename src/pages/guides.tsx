import { useRoute } from 'preact-iso';
import { FormattedMessage } from 'react-intl';
import { Article, Closer, Para } from '../components/article';
import { Code } from '../components/code';
import { PLATFORMS, COMPARISONS } from '../guides';
import { NotFound } from './not-found';
import { useCopy, useLocalePath } from '../i18n/context';

export function PlatformPage() {
  const { params } = useRoute();
  const to = useLocalePath();
  const p = useCopy()(PLATFORMS).find(x => x.slug === params.id);
  if (!p) return <NotFound />;

  return (
    <Article
      trail={[
        ['WaveShark', '/'],
        [<FormattedMessage defaultMessage="Download" />, '/download/'],
      ]}
      kicker={p.kicker}
      title={<FormattedMessage defaultMessage="WaveShark for {platform}" values={{ platform: p.name }} />}
      lede={p.summary}
      aside={
        <>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Watch out for" />
          </p>
          <ul class="ticks crosses">
            {p.gotchas.map(g => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <a class="btn btn-sm" href={to('/download/')}>
            <FormattedMessage defaultMessage="Get the build" />
          </a>
        </>
      }
      closer={
        <Closer
          title={<FormattedMessage defaultMessage="Radio in, nothing else." />}
          body={
            <FormattedMessage defaultMessage="No account, no service and nothing phoning home. The binary is the program." />
          }
          href="/download/"
          cta={<FormattedMessage defaultMessage="Download WaveShark" />}
        />
      }
    >
      {p.body.map((x, i) => (
        <Para key={i} html={x} />
      ))}
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="First run" />
      </h2>
      <ol class="steps">
        {p.steps.map(s => (
          <li key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            {s.code ? <Code html={s.code} /> : null}
          </li>
        ))}
      </ol>
    </Article>
  );
}

export function ComparisonPage() {
  const { params } = useRoute();
  const to = useLocalePath();
  const english = COMPARISONS.find(x => x.slug === params.id);
  const c = useCopy()(COMPARISONS).find(x => x.slug === params.id);
  if (!c || !english) return <NotFound />;
  const other = english.name.replace('WaveShark and ', '');

  return (
    <Article
      trail={[
        ['WaveShark', '/'],
        [<FormattedMessage defaultMessage="Download" />, '/download/'],
      ]}
      kicker={c.kicker}
      title={c.name}
      lede={c.summary}
      aside={
        <>
          <p class="foot-h">
            <FormattedMessage defaultMessage="Both are free software" />
          </p>
          <p>
            <FormattedMessage defaultMessage="Nothing here is a reason not to run both. They read each other’s captures and they answer different questions." />
          </p>
          <a class="btn btn-sm" href={to('/decodes/')}>
            <FormattedMessage defaultMessage="What WaveShark decodes" />
          </a>
        </>
      }
      closer={
        <Closer
          title={<FormattedMessage defaultMessage="Try it on a band you know." />}
          body={<FormattedMessage defaultMessage="Point it at 433.92 MHz for an hour and see what the list fills with." />}
          href="/download/"
          cta={<FormattedMessage defaultMessage="Download WaveShark" />}
        />
      }
    >
      {c.body.map((x, i) => (
        <Para key={i} html={x} />
      ))}
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="Where {other} is the better answer" values={{ other }} />
      </h2>
      <ul class="ticks">
        {c.theirs.map(x => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <h2 class="sub-h">
        <FormattedMessage defaultMessage="Where WaveShark is" />
      </h2>
      <ul class="ticks">
        {c.ours.map(x => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </Article>
  );
}
