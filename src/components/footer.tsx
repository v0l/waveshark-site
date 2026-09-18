const REPO = 'https://github.com/v0l/waveshark';

export function Footer() {
  return (
    <footer class="foot">
      <div class="wrap foot-grid wide">
        <div>
          <img class="foot-logo" src="/assets/waveshark-horizontal.svg" alt="WaveShark" width="266" height="50" />
          <p>An OSINT tool for RF. GPL-3.0-or-later.</p>
        </div>
        <nav aria-label="What it reads">
          <p class="foot-h">What it reads</p>
          <a href="/decodes/">Decoders</a>
          <a href="/bands/">Bands</a>
          <a href="/views/">Views</a>
          <a href="/use-cases/">Use cases</a>
        </nav>
        <nav aria-label="Running it">
          <p class="foot-h">Running it</p>
          <a href="/download/">Download</a>
          <a href="/hardware/">Hardware</a>
          <a href="/cli/">Command line</a>
          <a href="/mcp/">Agents and MCP</a>
          <a href="/home-assistant/">Home Assistant</a>
        </nav>
        <nav aria-label="Compared with">
          <p class="foot-h">Compared with</p>
          <a href="/vs/rtl-433/">rtl_433</a>
          <a href="/vs/sdrangel/">SDRangel</a>
          <a href="/vs/gqrx/">Gqrx</a>
        </nav>
        <nav aria-label="Project">
          <p class="foot-h">Project</p>
          <a href={REPO}>Repository</a>
          <a href={`${REPO}/releases`}>Releases</a>
          <a href={`${REPO}/blob/master/CHANGELOG.md`}>Changelog</a>
          <a href={`${REPO}/issues`}>Issues</a>
          <a href="https://github.com/sponsors/v0l">Sponsor</a>
        </nav>
      </div>
    </footer>
  );
}
