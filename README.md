# waveshark.io

Landing and download pages for [WaveShark](https://github.com/v0l/waveshark).

Preact on Vite, prerendered at build time, so every page ships as static HTML
with its own title, description, canonical and JSON-LD and then hydrates.

```sh
bun install
bun run dev            # http://localhost:5173
bun run build          # -> dist
bun run preview        # serves dist the way Pages does
bun run check          # tsc --noEmit
```

Copy that goes stale lives in `src/content.ts` (what it hears, the views, the
radios, the use cases) and `src/meta.ts` (per-page head and the version in the
JSON-LD). Pages are `src/pages/*.tsx`, the hero receiver simulation is
`src/hero/scope.ts`.

Most of the site is data plus one page component:

| file | pages |
|---|---|
| `src/content.ts` | home cards, `/views/`, `/use-cases/<id>` |
| `src/decodes.ts` | `/decodes/<slug>` |
| `src/bands.ts` | `/bands/<slug>`, which lists the decodes claiming that band |
| `src/radios.ts` | `/hardware/<slug>` |
| `src/guides.ts` | `/download/<platform>` and `/vs/<tool>` |

Adding an entry to any of those arrays gives it a route, a head, breadcrumbs, a
prerendered page and a sitemap line, because `ROUTES` in `src/meta.ts` is what
the build prerenders and what the sitemap plugin in `vite.config.ts` writes.
Paths carry a trailing slash everywhere, since that is what Cloudflare Pages
serves; the router strips it before matching.

The download page reads the latest tag and asset sizes from the GitHub API at
runtime; the links work without it because they point at
`releases/latest/download`.

`public/assets/` is copied from the app repo (`assets/logo/*.svg`,
`assets/screenshot.png`). Recopy after a UI change rather than editing here.

Deployed to Cloudflare Pages (project `waveshark`, apex `waveshark.io`):

```sh
bun run deploy
```
