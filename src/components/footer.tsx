const REPO = 'https://github.com/v0l/waveshark';

export function Footer() {
  return (
    <footer class="foot">
      <div class="wrap foot-grid">
        <div>
          <img class="foot-logo" src="/assets/waveshark-horizontal.svg" alt="WaveShark" width="266" height="50" />
          <p>An OSINT tool for RF. GPL-3.0-or-later.</p>
        </div>
        <nav aria-label="Documentation">
          <p class="foot-h">Docs</p>
          <a href={`${REPO}#readme`}>Read me</a>
          <a href={`${REPO}/blob/master/CHANGELOG.md`}>Changelog</a>
          <a href={`${REPO}/blob/master/docs/references.md`}>References</a>
          <a href={`${REPO}/blob/master/crates/nodes/src/protocol.rs`}>Protocol registry</a>
        </nav>
        <nav aria-label="Project">
          <p class="foot-h">Project</p>
          <a href={REPO}>Repository</a>
          <a href={`${REPO}/releases`}>Releases</a>
          <a href={`${REPO}/issues`}>Issues</a>
          <a href="https://github.com/sponsors/v0l">Sponsor</a>
          <a href="/use-cases">Use cases</a>
          <a href="/download">Download</a>
        </nav>
      </div>
    </footer>
  );
}
