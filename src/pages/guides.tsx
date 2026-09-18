import { useRoute } from 'preact-iso';
import { Article, Closer, Para } from '../components/article';
import { Code } from '../components/code';
import { PLATFORMS, COMPARISONS } from '../guides';
import { NotFound } from './not-found';

export function PlatformPage() {
  const { params } = useRoute();
  const p = PLATFORMS.find(x => x.slug === params.id);
  if (!p) return <NotFound />;

  return (
    <Article
      trail={[['WaveShark', '/'], ['Download', '/download/']]}
      kicker={p.kicker}
      title={`WaveShark for ${p.name}`}
      lede={p.summary}
      aside={
        <>
          <p class="foot-h">Watch out for</p>
          <ul class="ticks crosses">
            {p.gotchas.map(g => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <a class="btn btn-sm" href="/download/">Get the build</a>
        </>
      }
      closer={
        <Closer
          title="Radio in, nothing else."
          body="No account, no service and nothing phoning home. The binary is the program."
          href="/download/"
          cta="Download WaveShark"
        />
      }
    >
      {p.body.map((x, i) => (
        <Para key={i} html={x} />
      ))}
      <h2 class="sub-h">First run</h2>
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
  const c = COMPARISONS.find(x => x.slug === params.id);
  if (!c) return <NotFound />;
  const other = c.name.replace('WaveShark and ', '');

  return (
    <Article
      trail={[['WaveShark', '/'], ['Download', '/download/']]}
      kicker={c.kicker}
      title={c.name}
      lede={c.summary}
      aside={
        <>
          <p class="foot-h">Both are free software</p>
          <p>
            Nothing here is a reason not to run both. They read each other&rsquo;s captures and they
            answer different questions.
          </p>
          <a class="btn btn-sm" href="/decodes/">What WaveShark decodes</a>
        </>
      }
      closer={
        <Closer
          title="Try it on a band you know."
          body="Point it at 433.92 MHz for an hour and see what the list fills with."
          href="/download/"
          cta="Download WaveShark"
        />
      }
    >
      {c.body.map((x, i) => (
        <Para key={i} html={x} />
      ))}
      <h2 class="sub-h">Where {other} is the better answer</h2>
      <ul class="ticks">
        {c.theirs.map(x => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <h2 class="sub-h">Where WaveShark is</h2>
      <ul class="ticks">
        {c.ours.map(x => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </Article>
  );
}
