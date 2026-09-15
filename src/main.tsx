import { hydrate, prerender as ssr } from 'preact-iso';
import { App } from './app';
import { headFor } from './meta';
import './site.css';

if (typeof window !== 'undefined') {
  hydrate(<App />, document.getElementById('app')!);
}

export async function prerender(data: { url: string }) {
  const { html, links } = await ssr(<App {...data} />);
  const path = new URL(data.url, 'https://waveshark.io').pathname.replace(/\/$/, '') || '/';
  return { html, links, head: headFor(path) };
}
