import { useEffect, useState } from 'preact/hooks';
import { DownloadHeader } from '../components/header';
import { Code } from '../components/code';

const REPO = 'https://github.com/v0l/waveshark';
const RELEASE_PAGE = `${REPO}/releases/latest`;

interface Build {
  id: string;
  title: string;
  /// The token every asset for this platform carries, whatever else the file
  /// is named. Asset names carry the version, so nothing here is a full name.
  token: string;
  /// Extensions worth offering, best first. An empty string is the bare
  /// binary, which has no extension on Linux and macOS.
  kinds: string[];
  fallbackMeta: string;
  req: preact.ComponentChildren;
}

const BUILDS: Build[] = [
  {
    id: 'linux',
    title: 'Linux',
    token: 'linux-x86_64',
    kinds: ['.deb', '.rpm', '.tar.gz', ''],
    fallbackMeta: 'x86_64',
    req: (
      <>
        The <code>.deb</code> and <code>.rpm</code> pull in librtlsdr, which brings the udev rules
        that let you open a dongle without root. With the bare binary, install{' '}
        <code>librtlsdr0</code> or <code>rtl-sdr</code> yourself. LimeSDR support is compiled in.
      </>
    ),
  },
  {
    id: 'windows',
    title: 'Windows',
    token: 'windows-x86_64',
    kinds: ['.msi', '.zip'],
    fallbackMeta: 'x86_64',
    req: (
      <>
        Ships the DLLs it needs, but Windows will not let anything open an RTL2832U until WinUSB is
        bound to it with <a href="https://zadig.akeo.ie/">Zadig</a>. The zip holds the executable and
        its two DLLs, which have to stay beside it. No LimeSDR driver: LimeSuite is not packaged for
        Windows.
      </>
    ),
  },
  {
    id: 'macos',
    title: 'macOS',
    token: 'macos-arm64',
    kinds: ['.dmg', '.tar.gz', ''],
    fallbackMeta: 'Apple silicon',
    req: (
      <>
        Apple silicon only. Signed but not notarised, so the first open needs a right click and Open,
        or <code>xattr -dr com.apple.quarantine /Applications/WaveShark.app</code>. The app carries
        its own ffmpeg, librtlsdr and LimeSuite; the bare binary reads them from Homebrew, so{' '}
        <code>brew install ffmpeg librtlsdr limesuite</code> before running that one.
      </>
    ),
  },
];

interface Asset {
  name: string;
  size: number;
  browser_download_url: string;
}

/// Every asset for one platform, best first, with the bare binary last.
///
/// Matched on the platform token and the extension rather than the whole name,
/// because the name carries the version: a hardcoded link is a 404 one release
/// later.
function kindOf(build: Build, name: string) {
  return build.kinds.find(k => k !== '' && name.endsWith(k)) ?? '';
}

function assetsFor(build: Build, assets: Asset[]) {
  return assets
    .filter(a => a.name.includes(build.token) && !a.name.includes('-cuda'))
    .filter(a => build.kinds.includes(kindOf(build, a.name)))
    .sort((a, b) => build.kinds.indexOf(kindOf(build, a.name)) - build.kinds.indexOf(kindOf(build, b.name)));
}

/// What to call a file in a link. The version is in the name and full of full
/// stops, so the extension cannot be read off the last one.
function label(build: Build, name: string) {
  const kind = kindOf(build, name);
  return kind === '' ? 'bare binary' : kind.slice(1);
}

const size = (bytes: number) => `${(bytes / 1e6).toFixed(1)} MB`;

function useRelease() {
  const [tag, setTag] = useState('v0.3.0');
  const [published, setPublished] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    let live = true;
    fetch(`https://api.github.com/repos/v0l/waveshark/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(r => (r.ok ? r.json() : null))
      .then(rel => {
        if (!live || !rel) return;
        setTag(rel.tag_name);
        setPublished(
          new Date(rel.published_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        );
        setAssets(rel.assets ?? []);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return { tag, published, assets };
}

const SOURCE = [
  '<span class="c">$</span> sudo apt install librtlsdr-dev liblimesuite-dev \\',
  '    pkg-config libclang-dev libasound2-dev \\',
  '    libx11-dev libxrandr-dev libxi-dev libxcursor-dev \\',
  '    libxkbcommon-dev libwayland-dev libgl1-mesa-dev',
  '<span class="c">$</span> cargo run --release -p app',
].join('\n');

export function Download() {
  const { tag, published, assets } = useRelease();
  const cuda = assets.some(a => a.name.includes('-cuda'));

  return (
    <>
      <DownloadHeader />
      <main id="main">
        <section class="page-head">
          <div class="wrap">
            <p class="eyebrow">
              Latest release &middot; {tag}
              {published ? ` \u00b7 ${published}` : ''}
            </p>
            <h1>Download</h1>
            <p class="lede">
              A package or the bare binary, and a radio. No service, no account and nothing phoning
              home.
            </p>
          </div>
        </section>

        <section class="wrap">
          <ul class="builds">
            {BUILDS.map(b => {
              const [first, ...rest] = assetsFor(b, assets);
              return (
                <li class="build" key={b.id}>
                  <h2>{b.title}</h2>
                  <p class="meta">
                    {b.fallbackMeta}
                    {first ? ` \u00b7 ${label(b, first.name)} \u00b7 ${size(first.size)}` : ''}
                  </p>
                  <p class="req">{b.req}</p>
                  <a class="btn" href={first ? first.browser_download_url : RELEASE_PAGE}>
                    Download for {b.title}
                  </a>
                  <p class="alts">
                    <a href={`/download/${b.id}/`}>Setup and first run on {b.title}</a>
                  </p>
                  {rest.length ? (
                    <p class="alts">
                      {rest.map(a => (
                        <a key={a.name} href={a.browser_download_url}>
                          {label(b, a.name)} &middot; {size(a.size)}
                        </a>
                      ))}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <p class="note">
            The buttons follow the release rather than a filename, because every asset carries its
            version in the name.{' '}
            {cuda ? (
              <>
                This release also has a <code>-cuda</code> asset on Linux and Windows: the same
                receiver with the speech model on an NVIDIA card, needing the CUDA 12 runtime and a
                driver of 570 or later. Take the plain build unless you want speech read on the GPU.{' '}
              </>
            ) : (
              <>
                One build per platform, card or no card: the speech models use an NVIDIA GPU when the
                CUDA 12 runtime is on the machine and the CPU when it is not, and macOS uses Metal.{' '}
              </>
            )}
            <a href={RELEASE_PAGE}>The release page</a> has the lot.
          </p>
        </section>

        <section class="band" id="first-run">
          <div class="wrap two">
            <div>
              <p class="eyebrow">After the download</p>
              <h2 class="section-h">First run</h2>
              <p class="prose">
                Four minutes, most of it the driver. If the spectrum moves, the radio is open and every
                scanner in the span is already running.
              </p>
            </div>
            <ol class="steps">
              <li>
                <h3>Give the dongle a driver</h3>
                <p>
                  On Linux, install the distribution package so the udev rules land. On Windows, run
                  Zadig, pick the RTL2832U interface and install WinUSB.
                </p>
                <Code html={'<span class="c">$</span> sudo apt install librtlsdr0'} />
              </li>
              <li>
                <h3>Install it, or do not</h3>
                <p>
                  Open the package the button gave you, or take the bare binary and run it where it
                  lands. The binary is the whole program either way.
                </p>
                <Code
                  html={[
                    '<span class="c">$</span> sudo apt install ./waveshark-*-linux-x86_64.deb',
                    '<span class="c">$</span> waveshark',
                  ].join('\n')}
                />
              </li>
              <li>
                <h3>Press play</h3>
                <p>
                  It opens on the dashboard and the dial starts at 433.92 MHz, where the devices it
                  decodes are. Click the spectrum to place a channel and listen, drag to pan, scroll to
                  scrub, hold shift to snap to the band plan.
                </p>
              </li>
              <li>
                <h3>Check the path if nothing arrives</h3>
                <p>
                  <code>--probe</code> tests the signal path with no display, and{' '}
                  <code>--squelch-probe</code> reports what the squelch reads on a frequency.
                </p>
                <Code html={'<span class="c">$</span> waveshark --probe 433.92'} />
              </li>
            </ol>
          </div>
        </section>

        <section class="band" id="source">
          <div class="wrap two">
            <div>
              <p class="eyebrow">Two decoders the downloads do not carry</p>
              <h2 class="section-h">Build from source</h2>
              <p class="prose">
                The published builds leave out <code>tea</code> and <code>ambe</code>. Compiling them
                for yourself is not the same act as a project distributing them, which is why the
                source turns them on and the downloads do not.
              </p>
            </div>
            <div>
              <Code html={SOURCE} />
              <table class="flags">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>With it, and without</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>tea</code></td>
                    <td>
                      Links the TETRA ciphers and a wgpu key search. Without it the keys view still
                      lists enciphered channels and says nothing can read them.
                    </td>
                  </tr>
                  <tr>
                    <td><code>ambe</code></td>
                    <td>
                      Builds the AMBE and IMBE vocoder port, whose algorithms are patent encumbered.
                      Without it DMR still says who is talking and decodes no speech.
                    </td>
                  </tr>
                  <tr>
                    <td><code>limesdr</code></td>
                    <td>On by default. Needs LimeSuite, which is why the Windows build drops it.</td>
                  </tr>
                  <tr>
                    <td><code>stt</code></td>
                    <td>Speech to text over decoded voice, with <code>cuda</code> moving the model onto a card.</td>
                  </tr>
                  <tr>
                    <td><code>mcp</code></td>
                    <td>Serves the receiver to an agent on 127.0.0.1:8931. In every published build.</td>
                  </tr>
                </tbody>
              </table>
              <p class="note">
                The release workflow builds{' '}
                <code>--no-default-features --features limesdr,stt,cuda,mcp</code>, with{' '}
                <code>limesdr</code> dropped on Windows.
              </p>
            </div>
          </div>
        </section>

        <section class="closer">
          <div class="wrap">
            <h2>Something did not decode?</h2>
            <p>
              Record the burst with <code>--record</code> and open an issue with the capture. A capture
              that decodes becomes a test fixture.
            </p>
            <a class="btn btn-lg" href={`${REPO}/issues`}>
              Open an issue
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
