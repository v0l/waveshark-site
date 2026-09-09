// Fill in the real tag and asset sizes from the GitHub API. The page already
// carries working /releases/latest/download links, so a failure changes nothing.
(async () => {
  const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  try {
    const r = await fetch('https://api.github.com/repos/v0l/waveshark/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!r.ok) return;
    const rel = await r.json();
    const when = new Date(rel.published_at).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
    set('rel-line', `Latest release \u00b7 ${rel.tag_name} \u00b7 ${when}`);
    for (const a of rel.assets || []) {
      const mb = (a.size / 1e6).toFixed(1) + ' MB';
      if (a.name.includes('linux')) set('meta-linux', `x86_64 \u00b7 tar.gz \u00b7 ${mb}`);
      if (a.name.includes('windows')) set('meta-windows', `x86_64 \u00b7 zip \u00b7 ${mb}`);
    }
  } catch (_) { /* keep the static text */ }
})();
