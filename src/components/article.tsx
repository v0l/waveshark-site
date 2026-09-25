import type { ComponentChildren } from 'preact';
import { useIntl } from 'react-intl';
import { SiteHeader } from './header';
import { useLocalePath } from '../i18n/context';

type Trail = [ComponentChildren, string][];

export function Crumbs({ trail }: { trail: Trail }) {
  const to = useLocalePath();
  const intl = useIntl();
  return (
    <nav class="crumbs" aria-label={intl.formatMessage({ defaultMessage: 'Breadcrumb' })}>
      {trail.map(([label, href], i) => (
        <>
          {i ? <span key={`s${href}`}>/</span> : null}
          <a key={href} href={to(href)}>{label}</a>
        </>
      ))}
    </nav>
  );
}

/// Anything with a flag, a file name or a frequency in it carries markup, so a
/// body paragraph is HTML rather than escaped text.
export function Para({ html }: { html: string }) {
  return <p dangerouslySetInnerHTML={{ __html: html }} />;
}

export function PageHead(props: {
  trail?: Trail;
  kicker: ComponentChildren;
  title: ComponentChildren;
  lede: ComponentChildren;
}) {
  return (
    <section class="page-head">
      <div class="wrap">
        {props.trail ? <Crumbs trail={props.trail} /> : null}
        <p class="eyebrow">{props.kicker}</p>
        <h1>{props.title}</h1>
        <p class="lede">{props.lede}</p>
      </div>
    </section>
  );
}

/// Body on the left, the facts panel on the right, the way every detail page
/// on this site is laid out.
export function Article(props: {
  trail: Trail;
  kicker: ComponentChildren;
  title: ComponentChildren;
  lede: ComponentChildren;
  aside: ComponentChildren;
  children: ComponentChildren;
  closer?: ComponentChildren;
}) {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHead trail={props.trail} kicker={props.kicker} title={props.title} lede={props.lede} />
        <section class="wrap case-body">
          <div class="prose">{props.children}</div>
          <aside class="case-side">{props.aside}</aside>
        </section>
        {props.closer}
      </main>
    </>
  );
}

export function Closer(props: {
  title: ComponentChildren;
  body: ComponentChildren;
  href: string;
  cta: ComponentChildren;
}) {
  const to = useLocalePath();
  return (
    <section class="closer">
      <div class="wrap">
        <h2>{props.title}</h2>
        <p>{props.body}</p>
        <a class="btn btn-lg" href={to(props.href)}>{props.cta}</a>
      </div>
    </section>
  );
}
