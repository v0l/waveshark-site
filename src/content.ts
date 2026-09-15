export interface Card {
  freq: string;
  title: string;
  body: string;
  tx?: boolean;
}

/// Ordered by how hard the signal is to get anywhere else: the things other
/// receivers hand to a separate tool come first, the well-served protocols
/// after them.
export const CARDS: Card[] = [
  {
    freq: '2.4 GHz',
    title: 'Wi-Fi and drones',
    body:
      '802.11a/g/b and single-stream n: network names, the addresses talking, the rate each frame arrived at and whether an address is randomised. A drone broadcasting Remote ID gives up its serial, position and operator, and a DJI airframe gives up its home point too. Needs a HackRF or a LimeSDR, since one channel is 20 MHz wide.',
  },
  {
    freq: 'UHF and band III',
    title: 'Television',
    body:
      'A DVB-T multiplex read from its carriers down to its transport stream: the transmission parameters, the services on it, and whichever one you pick playing in the window at full frame rate with its sound in step.',
  },
  {
    freq: '390-400 MHz',
    title: 'TETRA',
    body:
      'The network, its cells and who is called. The tea feature links the ciphers and a wgpu key search, so an enciphered channel can be worked on rather than only counted.',
  },
  {
    freq: '2.4 GHz',
    title: 'Bluetooth LE',
    body: 'Advertising, Bluetooth 5 Long Range included, and Open Drone ID carried in it.',
  },
  {
    freq: '900 / 1800 MHz',
    title: 'GSM',
    body:
      'A cell\u2019s identity off its synchronisation burst, the blocks it broadcasts, who a page is calling, and the channel a phone is sent to.',
  },
  {
    freq: '2.4 GHz / 868 / 915 MHz',
    title: 'RC links',
    body:
      'ExpressLRS with the sticks read live on the control view, plus FrSky ACCST, FlySky AFHDS-2A and XN297 remotes.',
  },
  {
    freq: 'Any band',
    title: 'Voice',
    body:
      'WFM with stereo and RDS, NFM, AM, USB, LSB and CW, several channels at once, with a local Whisper or Qwen3-ASR model writing the words down as they are spoken.',
  },
  {
    freq: '1.2 / 2.4 / 5.8 GHz',
    title: 'Analogue video',
    body:
      'A camera\u2019s picture straight off the span, PAL or NTSC, in colour, with its audio subcarrier heard alongside and the lines received counted because nothing in analogue video checks itself.',
  },
  {
    freq: '144.500 MHz',
    title: 'SSTV',
    body:
      'Martin 1 and 2, Scottie 1, 2 and DX, Robot 36 and 72, drawn line by line as they arrive and saved to disc when the picture ends.',
  },
  {
    freq: '131.5 / 136.7 - 137 MHz',
    title: 'Airline datalink',
    body:
      'ACARS on the airband channels and VDL Mode 2, the datalink most European traffic uses: the aircraft, the flight and the message it sent to the ground.',
  },
  {
    freq: '433 / 868 / 915 MHz',
    title: 'ISM devices',
    body:
      '41 decoders, most from rtl_433\u2019s family. Weather stations, thermometers, TPMS, door contacts, gate remotes, security sensors, shelf labels, mostly with a stable device ID you can follow.',
  },
  {
    freq: '136-174 / 400-470 MHz',
    title: 'DMR',
    body: 'Who called whom on which talkgroup, and speech through the ambe feature.',
  },
  {
    freq: 'Amateur VHF and UHF',
    title: 'M17',
    body: 'Who called whom, for how long, packet messages in full, and Codec 2 speech.',
  },
  {
    freq: '433 / 868 / 915 MHz',
    title: 'LoRa mesh',
    body: 'LoRaWAN join requests and addresses, Meshtastic text under the public keys, MeshCore adverts.',
  },
  {
    freq: '868.95 MHz',
    title: 'Utility meters',
    body: 'Wireless M-Bus mode T: manufacturer, meter number, version and type.',
  },
  {
    freq: '1090 MHz',
    title: 'Aircraft',
    body: 'ADS-B and Mode S onto a map with a track table: callsign, altitude, speed, track, position.',
  },
  {
    freq: 'Marine VHF',
    title: 'Shipping',
    body: 'AIS positions and vessel identity, on the same map as the aircraft.',
  },
  {
    freq: '144.800 / 144.390 / 144.640',
    title: 'APRS',
    body: 'Packet stations and vehicle trackers, Mic-E included, on the EU, US and JP calling frequencies.',
  },
  {
    freq: 'Wherever you point it',
    title: 'Pagers',
    body: 'POCSAG at 512, 1200 and 2400 bit/s, message text in clear.',
  },
  {
    freq: 'On a radio that can',
    title: 'Transmit',
    body:
      'A microphone or a tone into NFM, WFM or AM, or a whole DVB-T multiplex built from any file ffmpeg can open, drawn as the TX side of the same flow graph.',
    tx: true,
  },
];

export interface ViewItem {
  key: string;
  title: string;
  body: string;
}

/// The tab strip order: what the receiver can do on the top row, who
/// is out there on the bottom.
export const VIEWS: ViewItem[] = [
  {
    key: '1',
    title: 'Dashboard',
    body:
      'Where a receiver that has just started is: what the application can do, as cards that take you there, and once a radio is running what is tuned, whether the host is keeping up, how much has decoded and what is on the air right now.',
  },
  {
    key: '2',
    title: 'Spectrum',
    body:
      'The span and its waterfall. Click to place a channel and listen, drag to pan, scroll to scrub, hold shift to snap to the band plan.',
  },
  {
    key: '3',
    title: 'Signal chain',
    body:
      'The graph the receiver is running, drawn, with each stage saying what it has been doing. Manual mode edits it, and a transmitter is the same graph with the arrows the other way.',
  },
  {
    key: '4',
    title: 'Calls',
    body:
      'Who is talking, on anything that decodes speech. Picking a call is asking to hear it, and the read button opens what the speech model made of it.',
  },
  {
    key: '5',
    title: 'Transcript',
    body:
      'What a local model read off everything heard, newest at the bottom, a line marked as it grows and a low-confidence reading flagged. Whisper in every size or Qwen3-ASR, on the CPU or a named GPU.',
  },
  {
    key: '6',
    title: 'Messages',
    body:
      'Everything carrying text, whether it came from a pager capcode, a TETRA talkgroup or a mesh channel. The same words twice inside two minutes are one message with a count, because a pager sends every page twice.',
  },
  {
    key: '7',
    title: 'Video',
    body:
      'Whatever picture is on the span: an analogue camera, an SSTV transmission drawing line by line, or a service off a DVB-T multiplex. The caption counts the lines that arrived, and a chooser picks between transmissions.',
  },
  {
    key: '8',
    title: 'Map',
    body:
      'Aircraft, vessels, vehicles, mesh nodes and satellite ground tracks on OpenStreetMap tiles. A hollow mark came from a single frame and never joins a trail; range rings are drawn around the antenna, not the window. Past zoom nine, airports appear with their air traffic frequencies.',
  },
  {
    key: '9',
    title: 'Data links',
    body:
      'Who is talking to whom, on every protocol at once. Wireshark\u2019s conversation list for radio: pick a link and the packets it carried open underneath, with the payload where the protocol gives one in the clear.',
  },
  {
    key: '0',
    title: 'Devices',
    body:
      'One row per transmitter that identified itself rather than one per transmission: what it called itself, who made it, the strongest level it was ever heard at, when it was last heard. Selecting a row draws its sightings on the map, and a drive exports as WiGLE CSV.',
  },
  {
    key: '\u00b7',
    title: 'Control',
    body:
      'Where the sticks are on every model control link in earshot: a bar per channel in microseconds, the frame rate, the level, and whether the handset is asking to arm.',
  },
  {
    key: '\u00b7',
    title: 'Satellites',
    body:
      'The one view showing something nobody has heard yet: every pass over the station in the next day, with peak elevation, a sky plot, live az/el and Doppler, and how stale the elements are. Listening follows the downlink across the pass and closes when the satellite sets.',
  },
  {
    key: '\u00b7',
    title: 'Keys',
    body:
      'A row per enciphered channel and what is known about its key. The monitor is always there; decryption and key recovery need the tea feature.',
  },
  {
    key: '\u00b7',
    title: 'Agent',
    body:
      'A model with the run of the receiver, and what you asked it. Every run serves MCP on the loopback, so what the agent tunes, opens or rewires happens in this window.',
  },
];

export interface Rig {
  freq: string;
  title: string;
  body: string;
}

export const RIGS: Rig[] = [
  {
    freq: 'from about \u20ac30',
    title: 'Any RTL2832U dongle',
    body:
      'Does the narrowband half of this page. Install librtlsdr0 or rtl-sdr on Linux for the udev rules; on Windows, bind WinUSB with Zadig first.',
  },
  {
    freq: '1 MHz - 6 GHz',
    title: 'HackRF One',
    body:
      'Spans wide enough for Wi-Fi, Bluetooth LE, DroneID and television, a transmitter, and a bias tee for a mast head amplifier.',
  },
  {
    freq: 'USB and Mini',
    title: 'LimeSDR',
    body: 'Both of those, plus full duplex. No Windows build: LimeSuite is not packaged for it.',
  },
  {
    freq: '--stream <host>',
    title: 'A tuner on another machine',
    body: 'An iqstream server shows up as a local radio, so the antenna can live where the signals are.',
  },
];
