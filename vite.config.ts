import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';
import { ROUTES, alternates, canonicalPath } from './src/meta';
import { messageId } from './src/i18n/hash';
import { splitPath } from './src/i18n/locales';

const SITE = 'https://waveshark.io';

/// The sitemap is the route table, so a page cannot be added without listing it.
function sitemap(): Plugin {
  const lastmod = new Date().toISOString().slice(0, 10);
  const priority = (path: string) => (path === '/' ? '1.0' : path.includes('/', 1) ? '0.6' : '0.8');
  return {
    name: 'sitemap',
    apply: 'build',
    generateBundle() {
      const urls = ROUTES.map(full => {
        const [, path] = splitPath(full);
        const links = alternates(path)
          .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
          .join('\n');
        return `  <url>\n    <loc>${SITE}${canonicalPath(full)}</loc>\n${links}\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority(path)}</priority>\n  </url>`;
      }).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [
    preact({
      babel: {
        plugins: [
          [
            'formatjs',
            {
              overrideIdFn: (_id: string, defaultMessage: string) => messageId(defaultMessage),
              ast: false,
            },
          ],
        ],
      },
      prerender: {
        enabled: true,
        renderTarget: '#app',
        additionalPrerenderRoutes: ROUTES.filter(p => p !== '/'),
        previewMiddlewareEnabled: true,
      },
    }),
    sitemap(),
  ],
  build: { target: 'es2022' },
});
