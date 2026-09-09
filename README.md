# waveshark.io

Landing and download pages for [WaveShark](https://github.com/v0l/waveshark).

Static HTML, no build step. Serve the directory:

```sh
python3 -m http.server 8080
```

`js/release.js` reads the latest tag and asset sizes from the GitHub API at
runtime; the download links work without it because they point at
`releases/latest/download`. The numbers baked into `download.html` are the
fallback and go stale, so refresh them when the release layout changes.

`assets/` is copied from the app repo (`assets/logo/*.svg`,
`assets/screenshot.png`). Recopy after a UI change rather than editing here.

Deployed to Cloudflare Pages (project `waveshark`, apex `waveshark.io`):

```sh
bunx wrangler pages deploy . --project-name waveshark --branch master
```
