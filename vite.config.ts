import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';
import { ROUTES } from './src/meta';

const SITE = 'https://waveshark.io';

/// Pages serves `/download/index.html`, so the slashless path redirects: the
/// sitemap and the canonicals have to name the URL that answers 200.
const href = (path: string) => (path === '/' ? '/' : `${path}/`);

/// The sitemap is the route table, so a page cannot be added without listing it.
function sitemap(): Plugin {
  const lastmod = new Date().toISOString().slice(0, 10);
  const priority = (path: string) => (path === '/' ? '1.0' : path.includes('/', 1) ? '0.6' : '0.8');
  return {
    name: 'sitemap',
    apply: 'build',
    generateBundle() {
      const urls = ROUTES.map(
        p =>
          `  <url>\n    <loc>${SITE}${href(p)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority(p)}</priority>\n  </url>`,
      ).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [
    preact({
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
