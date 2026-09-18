const REPO = 'https://github.com/v0l/waveshark';

interface Link {
  href: string;
  label: string;
  button?: boolean;
}

export function Header({ links }: { links: Link[] }) {
  return (
    <header class="topbar">
      <a class="brand" href="/" aria-label="WaveShark home">
        <img src="/assets/waveshark-horizontal.svg" alt="WaveShark" width="266" height="50" />
      </a>
      <nav class="nav" aria-label="Primary">
        {links.map(l => (
          <a key={l.href} class={l.button ? 'btn btn-sm' : undefined} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

/// One nav everywhere, so a page added to the site is reachable from every
/// other page rather than from the one that happened to link it.
export function SiteHeader() {
  return (
    <Header
      links={[
        { href: '/decodes/', label: 'Decoders' },
        { href: '/bands/', label: 'Bands' },
        { href: '/hardware/', label: 'Hardware' },
        { href: '/views/', label: 'Views' },
        { href: '/use-cases/', label: 'Use cases' },
        { href: '/download/', label: 'Download', button: true },
      ]}
    />
  );
}

export const HomeHeader = SiteHeader;
export const DownloadHeader = SiteHeader;

export { REPO };
