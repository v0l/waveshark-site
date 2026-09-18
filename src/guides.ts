export interface Platform {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  body: string[];
  steps: { title: string; body: string; code?: string }[];
  gotchas: string[];
}

export const PLATFORMS: Platform[] = [
  {
    slug: 'linux',
    name: 'Linux',
    kicker: 'x86_64 \u00b7 deb, rpm and a bare binary',
    summary:
      'A package that brings the udev rules with it, or a single binary that needs nothing installed but a driver for the dongle.',
    body: [
      'Linux is where WaveShark is developed, and it is the platform with the fewest surprises: LimeSDR support is compiled in, the speech models use an NVIDIA card when the CUDA runtime is present and the CPU when it is not, and the packages pull in librtlsdr for you.',
      'The udev rules are the part people miss. Without them a dongle can only be opened as root, which is a permission error rather than a radio fault, and installing the distribution package is what puts them in place.',
    ],
    steps: [
      {
        title: 'Install librtlsdr, or let the package do it',
        body: 'The .deb and .rpm depend on it. With the bare binary, install it yourself for the udev rules.',
        code: '<span class="c">$</span> sudo apt install librtlsdr0',
      },
      {
        title: 'Install WaveShark',
        body: 'Either the package for your distribution, or the bare binary anywhere on your path.',
        code: '<span class="c">$</span> sudo apt install ./waveshark-*-linux-x86_64.deb',
      },
      {
        title: 'Plug in a radio and press play',
        body: 'It opens on the dashboard and the dial starts at 433.92 MHz. Click the spectrum to place a channel and listen.',
        code: '<span class="c">$</span> waveshark --tune 433.92',
      },
      {
        title: 'Check the path if nothing arrives',
        body: '--probe tests the signal path with no display, which is what to run over ssh on a headless machine.',
        code: '<span class="c">$</span> waveshark --probe 433.92',
      },
    ],
    gotchas: [
      'A permission error opening the dongle is the udev rules missing, not a broken device',
      'Wayland and X11 are both fine; the window is drawn with wgpu',
      'For a machine at the antenna, --headless runs the whole receiver with no display',
    ],
  },
  {
    slug: 'windows',
    name: 'Windows',
    kicker: 'x86_64 \u00b7 msi and a zip',
    summary:
      'An installer, or a zip holding the executable and the two DLLs it will not start without. WinUSB has to be bound to the dongle first.',
    body: [
      'Windows will not let any user-space program open an RTL2832U until WinUSB is bound to it, because the device arrives claiming to be a television tuner. Zadig does that in about thirty seconds and it only has to be done once per dongle.',
      'This build has no LimeSDR driver: LimeSuite is not packaged for Windows, so that radio never appears in the list. Everything else works the same as on Linux, including speech on an NVIDIA card when the CUDA runtime is present.',
    ],
    steps: [
      {
        title: 'Bind WinUSB with Zadig',
        body: 'Run Zadig, pick the RTL2832U interface, choose WinUSB and install. Pick the right interface if the dongle shows two.',
      },
      {
        title: 'Install, or unzip',
        body: 'The .msi installs and upgrades in place. The zip holds waveshark.exe with rtlsdr.dll and libusb-1.0.dll, which have to stay in the same folder.',
      },
      {
        title: 'Press play',
        body: 'It opens on the dashboard at 433.92 MHz, where the sensors are.',
      },
    ],
    gotchas: [
      'The exe will not start on its own: it needs rtlsdr.dll and libusb-1.0.dll beside it',
      'No LimeSDR on Windows, because LimeSuite is not packaged for it',
      'A dongle that shows two interfaces in Zadig wants the one that is the bulk interface',
    ],
  },
  {
    slug: 'macos',
    name: 'macOS',
    kicker: 'Apple silicon \u00b7 dmg and a bare binary',
    summary:
      'A signed but unnotarised app carrying its own libraries, or a bare binary that reads them from Homebrew. The only build that plays television.',
    body: [
      'The macOS build is the one whose ffmpeg is new enough to decode a service out of a DVB-T multiplex, so it is the only build that shows television pictures. Speech models run on Metal.',
      'The app is signed ad-hoc rather than notarised, so the first open needs a right click and Open, or the quarantine flag cleared by hand. That is Apple\u2019s gatekeeping, not a warning about the software.',
    ],
    steps: [
      {
        title: 'Open the disk image and drag the app across',
        body: 'The .app carries its own ffmpeg, librtlsdr and LimeSuite, so nothing else is needed.',
      },
      {
        title: 'Clear the quarantine flag on first open',
        body: 'Right click and Open, or run this once.',
        code: '<span class="c">$</span> xattr -dr com.apple.quarantine /Applications/WaveShark.app',
      },
      {
        title: 'For the bare binary, install the libraries',
        body: 'The binary published beside the image reads them from Homebrew rather than carrying them.',
        code: '<span class="c">$</span> brew install ffmpeg librtlsdr limesuite',
      },
    ],
    gotchas: [
      'Apple silicon only; there is no Intel build',
      '"Damaged" on first open is the quarantine flag, cleared with the command above',
      'Speech runs on Metal, so there is no CUDA question here',
    ],
  },
];

export interface Comparison {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  body: string[];
  /// Where the other tool is the right answer, said plainly.
  theirs: string[];
  ours: string[];
}

export const COMPARISONS: Comparison[] = [
  {
    slug: 'rtl-433',
    name: 'WaveShark and rtl_433',
    kicker: 'ISM device decoding',
    summary:
      'rtl_433 has five times the device coverage and is the reference this project is tested against. WaveShark adds a window, a survey and everything that is not ISM.',
    body: [
      'rtl_433 is the standard for reading ISM devices, and nothing here pretends otherwise: it carries roughly 250 device decoders, WaveShark carries forty-five, and those forty-five are verified field for field against rtl_433 25.02 on 81 recordings from its own corpus. If your only job is decoding sensors and you want the widest coverage, run rtl_433.',
      'What WaveShark adds is the rest of the receiver. The same span that is being read for sensors is also being read for aircraft, pagers, digital voice, mesh traffic and anything else in it, and a device that identifies itself becomes a row in a survey with its sightings on a map rather than a line of output.',
      'The two read each other\u2019s captures: <code>--record</code> writes rtl_433 style files, so a burst captured by one is a test fixture for the other.',
    ],
    theirs: [
      'Roughly 250 device decoders against forty-five',
      'A command line tool that fits in a pipeline and a cron job',
      'Runs on anything, including very small hardware',
      'Years of field testing across an enormous device catalogue',
    ],
    ours: [
      'Every other protocol in the same span at the same time',
      'A window: spectrum, waterfall, envelope, bit slicing and hex for unclaimed bursts',
      'A device survey with positions, and a WiGLE CSV export',
      'A packet log that stores samples, so a future decoder gets its chance at an old burst',
    ],
  },
  {
    slug: 'sdrangel',
    name: 'WaveShark and SDRangel',
    kicker: 'Multi-protocol SDR software',
    summary:
      'SDRangel has more modes, more radios and a transmitter for most of them. WaveShark decodes the whole span at once instead of asking you to place every demodulator by hand.',
    body: [
      'SDRangel is the most capable multi-protocol SDR application there is, with a longer mode list, broader hardware support and years of work behind it. If you want to drive a specific demodulator on a specific frequency with every parameter exposed, it is the better tool.',
      'The difference is who decides what runs. In SDRangel you place a demodulator on a channel; in WaveShark every scanner inside the span runs continuously, so a sensor that transmits once a minute is caught whether or not you were pointing at it. What you get back is a packet stream with views over it rather than a rack of instruments.',
      'The other difference is what happens afterwards. Everything heard, decoded or not, goes into a log that stores the samples, so the question "what was that burst at three in the morning" has an answer.',
    ],
    theirs: [
      'A longer list of modes, and transmit on most of them',
      'Support for far more radio hardware',
      'Fine control over every demodulator parameter',
      'Mature, with a large user base and documentation',
    ],
    ours: [
      'Everything in the span decoded at once, with no channel to place',
      'One packet stream, with a conversation view and a device survey over it',
      'A local speech model transcribing every voice channel',
      'An MCP server, so an agent can drive the receiver you are watching',
    ],
  },
  {
    slug: 'gqrx',
    name: 'WaveShark and Gqrx',
    kicker: 'Listening on a frequency',
    summary:
      'Gqrx is a fine radio for listening to one thing at a time. WaveShark is for finding out what is there in the first place.',
    body: [
      'Gqrx does one job well: tune a frequency, pick a demodulator, listen. It is light, stable and the first thing many people install with a dongle, and for listening to a repeater or a broadcast station it remains the shorter path.',
      'WaveShark answers a different question. Rather than demodulating the channel you chose, it decodes everything inside the sampled span and lists what it found, so the outcome is a list of devices, aircraft, vessels, pagers and mesh nodes rather than audio from one frequency.',
      'If you already know the frequency and want to hear it, Gqrx is enough. If the question is what is transmitting around here, it is the wrong shape of tool.',
    ],
    theirs: [
      'Simple, light and quick to learn',
      'Excellent for listening to one channel',
      'Long-standing support for a wide range of radios',
    ],
    ours: [
      'Continuous decoding across the whole span, not one channel',
      'Forty-odd protocols running at once, with a packet list and a map',
      'Recording, transcription and a searchable message history',
      'A signal chain you can edit, and an agent that can drive it',
    ],
  },
];
