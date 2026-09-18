import { useRoute } from 'preact-iso';
import { Code } from '../components/code';
import { USE_CASES } from '../content';
import { NotFound } from './not-found';
import { UseCasesHeader } from './use-cases';

/// Anything with a paragraph that names a flag or a file carries markup in the
/// copy, so the body is written as HTML rather than escaped text.
function Para({ html }: { html: string }) {
  return <p dangerouslySetInnerHTML={{ __html: html }} />;
}

export function UseCase() {
  const { params } = useRoute();
  const item = USE_CASES.find(c => c.id === params.id);
  if (!item) return <NotFound />;

  const i = USE_CASES.indexOf(item);
  const next = USE_CASES[(i + 1) % USE_CASES.length];

  return (
    <>
      <UseCasesHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <nav class="crumbs" aria-label="Breadcrumb">
              <a href="/">WaveShark</a> <span>/</span> <a href="/use-cases">Use cases</a>
            </nav>
            <p class="eyebrow">{item.kicker}</p>
            <h1>{item.title}</h1>
            <p class="lede">{item.summary}</p>
          </div>
        </section>

        <section class="wrap case-body">
          <div class="prose">
            {item.body.map((p, n) => (
              <Para key={n} html={p} />
            ))}
            {item.cli ? <Code html={item.cli} /> : null}
          </div>
          <aside class="case-side">
            <p class="foot-h">What you need</p>
            <p>{item.gear}</p>
            <p class="foot-h">Where it lives</p>
            <p class="chips">
              {item.views.map(v => (
                <span key={v} class="chip">{v}</span>
              ))}
            </p>
            <a class="btn btn-sm" href="/download">Download</a>
          </aside>
        </section>

        <section class="closer">
          <div class="wrap">
            <h2>{next.title}</h2>
            <p>{next.summary}</p>
            <a class="btn btn-lg" href={`/use-cases/${next.id}`}>Read that one</a>
          </div>
        </section>
      </main>
    </>
  );
}
