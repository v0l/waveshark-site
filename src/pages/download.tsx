import { useEffect, useState } from 'preact/hooks';
import { DownloadHeader } from '../components/header';
import { Code } from '../components/code';

const REPO = 'https://github.com/v0l/waveshark';
const LATEST = `${REPO}/releases/latest/download`;

interface Build {
  id: string;
  title: string;
  /// The asset name, which is also how the release API row is matched.
  asset: string;
  fallbackMeta: string;
  req: preact.ComponentChildren;
}

const BUILDS: Build[] = [
  {
    id: 'linux',
    title: 'Linux',
    asset: 'waveshark-linux-x86_64.tar.gz',
    fallbackMeta: 'x86_64 \u00b7 tar.gz',
    req: (
      <>
        Links librtlsdr rather than bundling it, so install <code>librtlsdr0</code> or{' '}
        <code>rtl-sdr</code> from your distribution. That package also brings the udev rules that let
        you open a dongle without root. LimeSDR support is compiled in.
      </>
    ),
  },
  {
    id: 'windows',
    title: 'Windows',
    asset: 'waveshark-windows-x86_64.zip',
    fallbackMeta: 'x86_64 \u00b7 zip',
    req: (
      <>
        Ships the DLLs it needs, but Windows will not let anything open an RTL2832U until WinUSB is
        bound to it with <a href="https://zadig.akeo.ie/">Zadig</a>. This build has no LimeSDR driver,
        because LimeSuite is not packaged for Windows.
      </>
    ),
  },
  {
    id: 'macos',
    title: 'macOS',
    asset: 'waveshark-macos-arm64.tar.gz',
    fallbackMeta: 'Apple silicon \u00b7 tar.gz',
    req: (
      <>
        Apple silicon only, and neither signed nor notarised, so clear the download flag once with{' '}
        <code>xattr -dr com.apple.quarantine waveshark</code>. It links Homebrew’s librtlsdr and
        LimeSuite, so <code>brew install librtlsdr limesuite</code> before the first run.
      </>
    ),
  },
];

interface Asset {
  name: string;
  size: number;
}

function useRelease() {
  const [tag, setTag] = useState('v0.2.0');
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

  const sizeOf = (name: string) => {
    const a = assets.find(x => x.name === name);
    return a ? ` \u00b7 ${(a.size / 1e6).toFixed(1)} MB` : '';
  };
  return { tag, published, sizeOf };
}

const SOURCE = [
  '<span class="c">$</span> sudo apt install librtlsdr-dev liblimesuite-dev \\',
  '    pkg-config libclang-dev libasound2-dev \\',
  '    libx11-dev libxrandr-dev libxi-dev libxcursor-dev \\',
  '    libxkbcommon-dev libwayland-dev libgl1-mesa-dev',
  '<span class="c">$</span> cargo run --release -p app',
].join('\n');

export function Download() {
  const { tag, published, sizeOf } = useRelease();

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
              One binary and a radio. There is no installer, no service and nothing to sign up for.
            </p>
          </div>
        </section>

        <section class="wrap">
          <ul class="builds">
            {BUILDS.map(b => (
              <li class="build" key={b.id}>
                <h2>{b.title}</h2>
                <p class="meta">
                  {b.fallbackMeta}
                  {sizeOf(b.asset)}
                </p>
                <p class="req">{b.req}</p>
                <a class="btn" href={`${LATEST}/${b.asset}`}>
                  Download for {b.title}
                </a>
              </li>
            ))}
          </ul>
          <p class="note">
            Linux and Windows also have a <code>-cuda</code> asset: the same receiver with the speech
            model on an NVIDIA card. It needs the CUDA 12 runtime and a driver of 570 or later and will
            not start without them, so take the plain build unless you want speech read on the GPU.{' '}
            <a href={`${REPO}/releases/latest`}>Every asset</a> is on the release page.
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
                <h3>Unpack and run</h3>
                <p>No install step. The binary is the program.</p>
                <Code
                  html={[
                    '<span class="c">$</span> tar xf waveshark-linux-x86_64.tar.gz',
                    '<span class="c">$</span> ./waveshark',
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
                <Code html={'<span class="c">$</span> ./waveshark --probe 433.92'} />
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
                <code>--no-default-features --features limesdr,stt,mcp</code>, and the CUDA assets add{' '}
                <code>cuda</code>.
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
