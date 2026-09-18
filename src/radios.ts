/// A radio as a page: what it can reach, what it cannot, and the setup that
/// trips people up on each platform.
export interface Radio {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  body: string[];
  specs: [string, string][];
  /// What this radio unlocks that a cheaper one does not, and what it will not do.
  reach: string[];
  limits: string[];
  setup?: string;
}

export const RADIOS: Radio[] = [
  {
    slug: 'rtl-sdr',
    name: 'RTL-SDR',
    kicker: 'Any RTL2832U dongle, from about \u20ac30',
    summary:
      'The dongle that does the narrowband half of everything on this site: sensors, meters, aircraft, shipping, pagers, digital voice, radiosondes and weather satellites.',
    body: [
      'An RTL2832U dongle with an R820T2 or R860 tuner is the cheapest useful receiver ever made, and the majority of what WaveShark decodes was written against one. Roughly 2.4 MS/s of usable span is enough for every protocol here that is not Wi-Fi, Bluetooth, television or a drone video link.',
      'The bandwidth is the limit, not the decoding. A 2.4 MHz span across 433 MHz holds every sensor in a building at once; the same span cannot hold one Wi-Fi channel.',
      'Below about 24 MHz a stock dongle hears nothing without help, so shortwave needs an upconverter or a direct sampling modification.',
    ],
    specs: [
      ['Tuning range', '24 MHz to 1.7 GHz, depending on the tuner'],
      ['Usable span', 'about 2.4 MHz'],
      ['Sample format', '8 bit'],
      ['Transmit', 'no'],
    ],
    reach: [
      'ISM sensors, TPMS, utility meters and Z-Wave',
      'ADS-B, UAT, ACARS, VDL Mode 2 and AIS',
      'DMR, P25, NXDN, TETRA, M17 and analogue voice',
      'POCSAG and FLEX paging, APRS, SSTV and radiosondes',
      'NOAA APT and Meteor LRPT weather satellite passes',
    ],
    limits: [
      'Wi-Fi, Bluetooth LE, Zigbee and DJI DroneID: one channel is wider than the whole span',
      'DVB-T television: a multiplex is 8 MHz',
      'Shortwave without an upconverter or direct sampling',
      'Transmitting anything',
    ],
    setup:
      'On Linux install <code>librtlsdr0</code> or <code>rtl-sdr</code>, which brings the udev rules that let you open the device without root. On Windows, bind WinUSB to the RTL2832U interface with Zadig first or nothing can open it.',
  },
  {
    slug: 'hackrf',
    name: 'HackRF One',
    kicker: '1 MHz to 6 GHz, transmit and receive',
    summary:
      'Wide enough for Wi-Fi, Bluetooth, drone Remote ID, television and 5.8 GHz video, and the cheapest way to get a transmitter into the same flow graph.',
    body: [
      'The HackRF is half duplex and 8 bit, and neither of those matters much for this work. What matters is 20 MS/s of span, which is the difference between reading a Wi-Fi channel and not, and coverage up to 6 GHz, which is what puts FPV video on 5.8 GHz within reach.',
      'It transmits, so a channel here can be a microphone, a tone, a recorded capture, a Flipper <code>.sub</code> file, a POCSAG page, an APRS beacon, an SSTV picture or a whole DVB-T multiplex built from anything ffmpeg can open.',
      'The bias tee feeds a mast head amplifier from the coax, which is the difference between a working 1090 MHz setup and a disappointing one.',
    ],
    specs: [
      ['Tuning range', '1 MHz to 6 GHz'],
      ['Usable span', 'up to 20 MHz'],
      ['Sample format', '8 bit'],
      ['Transmit', 'yes, half duplex'],
    ],
    reach: [
      'Everything an RTL-SDR reaches, on one radio',
      'Wi-Fi, Bluetooth LE and 802.15.4 at 2.4 GHz',
      'Drone Remote ID and DJI DroneID',
      'DVB-T television and 5.8 GHz analogue video',
      'Transmitting: voice, captures, .sub files and six decoded protocols',
    ],
    limits: [
      'Half duplex: it transmits or receives, not both',
      '8 bit sampling, so a strong signal beside a weak one is harder work',
      'No full duplex repeater work',
    ],
    setup:
      'No driver dance on Linux beyond the usual udev rules. The bias tee and the gain settings are in the radio dialog, and both are remembered across a span change.',
  },
  {
    slug: 'limesdr',
    name: 'LimeSDR',
    kicker: 'USB and Mini, full duplex, 12 bit',
    summary:
      'Everything the HackRF reaches plus full duplex and 12 bit samples, on Linux and macOS. There is no Windows build.',
    body: [
      'The LimeSDR is the better radio of the two on paper: 12 bit rather than 8, full duplex rather than half, and two channels on the USB version. For receiving a crowded band with a strong transmitter nearby, those extra bits are the ones that matter.',
      'The Windows build of WaveShark has no LimeSDR driver, because LimeSuite is not packaged for Windows. That is a packaging limitation rather than a decision about the hardware.',
      'On a LimeSDR the transmit port has to be the right one, which is a setting rather than a guess: pointing the transmitter at an unselected port is a silent failure that used to cost people an afternoon.',
    ],
    specs: [
      ['Tuning range', '100 kHz to 3.8 GHz, Mini from 10 MHz'],
      ['Usable span', 'up to 30 MHz'],
      ['Sample format', '12 bit'],
      ['Transmit', 'yes, full duplex'],
    ],
    reach: [
      'Everything the HackRF reaches',
      'Full duplex: transmit and receive at once',
      '12 bit dynamic range in a crowded band',
    ],
    limits: [
      'No Windows build: LimeSuite is not packaged for it',
      'Above 3.8 GHz is out of range, so 5.8 GHz FPV needs a HackRF',
      'Needs LimeSuite installed on Linux and macOS',
    ],
    setup:
      'Install LimeSuite from your distribution or Homebrew. The macOS app carries its own copy; the bare binary reads Homebrew\u2019s.',
  },
  {
    slug: 'remote-tuners',
    name: 'Remote tuners',
    kicker: 'iqstream and rtl_tcp, over the network',
    summary:
      'A tuner on a machine at the mast, read from the desk, tuned from the desk, and several of them stitched into one wider span.',
    body: [
      'Coax loss and noise are worse than network latency, so the right place for a receiver is at the antenna. Point <code>--stream</code> at an iqstream or rtl_tcp server and it appears in the receiver list as a local radio, dial and all.',
      'WaveShark serves iqstream as well, so a machine already collecting a span can hand the same samples to another one without a second antenna. Add <code>,tune</code> and a subscriber can move the dial, which moves it on the serving screen too.',
      'Several matching tuners can be offered as one wider receiver: the drift between them is measured on the band they share and taken out, which is how you cover more span than any one radio can.',
    ],
    specs: [
      ['Protocols', 'iqstream and rtl_tcp'],
      ['Tuning', 'remote dial, when the server allows it'],
      ['Stitching', 'several tuners as one wider span'],
      ['Headless', 'the serving machine needs no display'],
    ],
    reach: [
      'An antenna in the loft and a receiver on the desk',
      'One collected span read by more than one machine',
      'A span wider than any single radio',
    ],
    limits: [
      'Network throughput sets the span you can carry',
      'rtl_tcp carries 8 bit samples, whatever the radio is',
    ],
    setup:
      '<code>waveshark --iqstream-listen 1234</code> on the machine at the antenna, <code>waveshark --stream mast.local:1234</code> at the desk.',
  },
];
