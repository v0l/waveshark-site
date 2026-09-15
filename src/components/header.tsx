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

export function HomeHeader() {
  return (
    <Header
      links={[
        { href: '#hears', label: 'What it hears' },
        { href: '#views', label: 'Views' },
        { href: '#agents', label: 'Agents' },
        { href: '#hardware', label: 'Hardware' },
        { href: REPO, label: 'Source' },
        { href: '/download', label: 'Download', button: true },
      ]}
    />
  );
}

export function DownloadHeader() {
  return (
    <Header
      links={[
        { href: '/#hears', label: 'What it hears' },
        { href: '/#hardware', label: 'Hardware' },
        { href: '/#support', label: 'Support' },
        { href: REPO, label: 'Source' },
        { href: `${REPO}/releases`, label: 'All releases', button: true },
      ]}
    />
  );
}
