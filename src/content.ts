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
    freq: 'Band III and shortwave',
    title: 'DAB and DRM',
    body:
      'A DAB ensemble and the stations in it, with their programme types and bit rates, and a DRM multiplex on shortwave or medium wave with its services, languages and labels. Both are read for what they carry; neither makes sound yet.',
  },
  {
    freq: '390-400 MHz',
    title: 'TETRA',
    body:
      'The network, its cells and who is called. The tea feature links the ciphers and a wgpu key search, so an enciphered channel can be worked on rather than only counted.',
  },
  {
    freq: '136-174 / 400-470 MHz',
    title: 'P25 and NXDN',
    body:
      'P25 phase 1 gives the talkgroup, the radio id and the key a call is under. NXDN on the 12.5 and 6.25 kHz channels gives the system number, who called whom and whether the speech is enciphered. Neither has sound yet.',
  },
  {
    freq: '2.4 GHz',
    title: 'Bluetooth LE',
    body: 'Advertising, Bluetooth 5 Long Range included, and Open Drone ID carried in it.',
  },
  {
    freq: '2.4 GHz',
    title: 'Zigbee, Thread and Matter',
    body:
      'IEEE 802.15.4 under all three: the addresses talking and the networks they belong to, on the channel each sits on.',
  },
  {
    freq: '868 / 908 MHz',
    title: 'Z-Wave',
    body: 'Door locks, sensors and plugs at 9.6, 40 and 100 kbit/s, on the European and US channels.',
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
      'ExpressLRS with the sticks read live on the control view, plus FrSky ACCST, FlySky AFHDS-2A and XN297 remotes, address and payload included.',
  },
  {
    freq: 'Any band',
    title: 'Voice',
    body:
      'WFM with stereo and RDS, NFM, AM, USB, LSB and CW, several channels at once, with a local Whisper or Qwen3-ASR model writing the words down as they are spoken. Every over can be kept as Opus and played back from the call list.',
  },
  {
    freq: '1.2 / 2.4 / 5.8 GHz',
    title: 'Analogue video',
    body:
      'A camera\u2019s picture straight off the span, PAL or NTSC, in colour, with its audio subcarrier heard alongside. An FPV carrier is named from its line rate and given its channel: R1, F4, A5.',
  },
  {
    freq: '144.500 MHz',
    title: 'SSTV',
    body:
      'Martin 1 and 2, Scottie 1, 2 and DX, Robot 36 and 72, drawn line by line as they arrive and saved to disc when the picture ends.',
  },
  {
    freq: '137 MHz and HF',
    title: 'Weather satellites',
    body:
      'NOAA APT passes and Meteor-M LRPT, drawn on the video pane as they come down, plus HF weather fax charts. The satellites view has the passes over the station for the next day, and listening follows the downlink through Doppler until the satellite sets.',
  },
  {
    freq: '400-406 MHz',
    title: 'Radiosondes',
    body:
      'Vaisala RS41, Graw DFM, Meteomodem M10 and M20, iMet, Meisei, MRZ and LMS6 balloons on the map with serial, height, climb rate and the air they were sent up to measure. The channel follows the transmitter as it drifts, and launch sites from SondeHub say when the next one goes up.',
  },
  {
    freq: '131.5 / 136.7 - 137 MHz',
    title: 'Airline datalink',
    body:
      'ACARS on the airband channels and VDL Mode 2, the datalink most European traffic uses: the aircraft, the flight and the message it sent to the ground. Inmarsat Aero brings the satellite side of the same traffic off an L-band patch.',
  },
  {
    freq: '1090 / 978 MHz',
    title: 'Aircraft',
    body:
      'ADS-B and Mode S onto a map with a track table: callsign, altitude, speed, track, position. UAT at 978 MHz adds light aircraft and the ground stations\u2019 weather and traffic uplink.',
  },
  {
    freq: 'Marine VHF and L band',
    title: 'Shipping',
    body:
      'AIS positions and vessel identity, on the same map as the aircraft, with Inmarsat STD-C carrying the EGC and SafetyNET broadcasts sent to them.',
  },
  {
    freq: '406 MHz',
    title: 'Distress beacons',
    body:
      'COSPAS-SARSAT EPIRB, PLB and ELT identities, with the position they encode drawn on the map.',
  },
  {
    freq: '433 / 868 / 915 MHz',
    title: 'ISM devices',
    body:
      '45 decoders, most from rtl_433\u2019s family. Weather stations, thermometers, TPMS including Ford and Renault, door contacts, gate remotes, security sensors, shelf labels, mostly with a stable device ID you can follow.',
  },
  {
    freq: '868.95 / 915 MHz',
    title: 'Utility meters',
    body:
      'Wireless M-Bus mode T with manufacturer, meter number, version and type, and Itron ERT SCM, SCM+ and IDM readings on the US band.',
  },
  {
    freq: '433 / 868 / 915 MHz',
    title: 'LoRa mesh',
    body: 'LoRaWAN join requests and addresses, Meshtastic text under the public keys, MeshCore adverts.',
  },
  {
    freq: 'Amateur VHF and UHF',
    title: 'M17 and DMR',
    body:
      'Who called whom, for how long, and on which talkgroup. M17 packet messages arrive in full with Codec 2 speech; DMR speech needs the ambe feature.',
  },
  {
    freq: '144.800 / 144.390 / 144.640',
    title: 'APRS and packet',
    body:
      'Packet stations and vehicle trackers, Mic-E included, on the EU, US and JP calling frequencies. A KISS TNC on --kiss-listen hands the same traffic to any packet program, and keys AX.25 back through the radio.',
  },
  {
    freq: 'Wherever you point it',
    title: 'Pagers and tones',
    body:
      'POCSAG at 512, 1200 and 2400 bit/s and FLEX at 1600 and 3200 baud, message text in clear, plus the two-tone pair that opens a fire or ambulance pager and the MDC-1200 unit id a Motorola radio sends when its key goes down.',
  },
  {
    freq: 'HF and VHF',
    title: 'Morse and teleprinter',
    body:
      'A CW channel read as text at the speed it was sent, and RTTY in Baudot from 45.45 to 200 baud, either way up. EAS and SAME alert headers are read on the seven NOAA Weather Radio channels.',
  },
  {
    freq: 'On a radio that can',
    title: 'Transmit',
    body:
      'A microphone, a tone or a recorded capture into NFM, WFM or AM, keyed by hand or by voice, and six protocols this receiver already reads sent back out: POCSAG pages, APRS beacons, RTTY overs, BLE advertisements, SSTV pictures and RDS names. Flipper .sub files key at the frequency they name, and a whole DVB-T multiplex can be built from any file ffmpeg can open.',
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
      'The span and its waterfall. Click to place a channel and listen, drag to pan, scroll to scrub, hold shift to snap to the band plan. The span can be kept as readings and exported as a heatmap page that zooms and pans, with time, frequency and decibels under a crosshair.',
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
      'Who is talking, on anything that decodes speech. Picking a call is asking to hear it, every over can be recorded as Opus, and a timeline under the list draws the recordings against the clock so a stretch can be dragged out as one file.',
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
      'Everything carrying text, whether it came from a pager capcode, a TETRA talkgroup, a mesh channel, an RTTY over or a Morse key. The same words twice inside two minutes are one message with a count, because a pager sends every page twice.',
  },
  {
    key: '7',
    title: 'Video',
    body:
      'Whatever picture is on the span: an analogue camera, an SSTV transmission drawing line by line, a weather satellite pass building up in strips, or a service off a DVB-T multiplex. The caption counts the lines that arrived, and a chooser picks between transmissions.',
  },
  {
    key: '8',
    title: 'Map',
    body:
      'Anything that said where it was: aircraft, vessels, vehicles, mesh nodes, radiosondes, distress beacons and satellite ground tracks on OpenStreetMap tiles. A hollow mark came from a single frame and never joins a trail; range rings are drawn around the antenna, not the window. Past zoom nine, airports appear with their air traffic frequencies.',
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
    title: 'Channels',
    body:
      'What is sitting on each Wi-Fi, Bluetooth and 802.15.4 channel, how loud it is and how crowded the channel is, which is the view that says where to put your own network.',
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
      'A model with the run of the receiver, and what you asked it. Every run serves MCP on the loopback, so what the agent tunes, opens, rewires or changes in the settings happens in this window.',
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
    body:
      'An iqstream or rtl_tcp server shows up as a local radio, so the antenna can live where the signals are. This receiver serves iqstream too, and several matching tuners stitch into one wider span.',
  },
];

export interface UseCase {
  id: string;
  kicker: string;
  title: string;
  /// The one-line answer to "what would I use this for", also the meta blurb.
  summary: string;
  body: string[];
  /// Views the job actually lives in, drawn as the tab names.
  views: string[];
  cli?: string;
  gear: string;
}

/// Ordered roughly by how many people want the job, not by how clever it is.
export const USE_CASES: UseCase[] = [
  {
    id: 'device-survey',
    kicker: '433 / 868 / 915 MHz \u00b7 RTL-SDR',
    title: 'Find every wireless device around you',
    summary:
      'Leave a dongle on an ISM band and collect the sensors, remotes, door contacts, meters and tyre sensors transmitting near you, each with the ID it keeps.',
    body: [
      'Most wireless devices in a building announce themselves every few seconds to every few minutes, and almost all of them carry an ID that does not change. Covering the band continuously catches the ones that would have transmitted while you were tuned somewhere else, which is the whole reason a scan misses them.',
      'The devices view is one row per transmitter rather than one per transmission: what it called itself, who made it, the strongest level it was ever heard at and when it was last heard. Select a row and its sightings are drawn on the map, so a walk or a drive turns into coverage rather than a list, and the survey exports as WiGLE CSV for anything that already draws that.',
      'Anything nothing claims still gets its coding inferred and its bits sliced out, so an unknown remote is a starting point rather than a blank.',
    ],
    views: ['Devices', 'Data links', 'Map'],
    cli: '<span class="c">$</span> waveshark --tune 433.92 --survey --location 53.34,-6.26',
    gear: 'Any RTL-SDR dongle',
  },
  {
    id: 'aircraft',
    kicker: '1090 / 978 / 131 MHz',
    title: 'Track aircraft and read what they send',
    summary:
      'ADS-B and Mode S on the map, UAT for light aircraft, and the ACARS, VDL Mode 2 and satellite messages crews exchange with the ground.',
    body: [
      'Position reporting is only half of what an aircraft transmits. ADS-B and Mode S at 1090 MHz put the airframe on the map with callsign, altitude, speed and track; UAT at 978 MHz adds the light aircraft that never appear on 1090 along with the ground stations\u2019 weather and traffic uplink.',
      'The datalinks carry the text: ACARS on the airband channels and VDL Mode 2, the link most European traffic uses, with Inmarsat Aero covering the satellite side off an L-band patch antenna. Those messages are the flight, the aircraft and what it told the airline.',
      'Past zoom nine the map draws airports with their air traffic frequencies, so the tower you can hear is one click from the aircraft you can see.',
    ],
    views: ['Map', 'Messages', 'Data links'],
    cli: '<span class="c">$</span> waveshark --tune 1090 --location 53.34,-6.26 --flights',
    gear: 'RTL-SDR, and an antenna cut for the band',
  },
  {
    id: 'voice-monitoring',
    kicker: 'VHF and UHF \u00b7 recorded and transcribed',
    title: 'Monitor a radio network and read it back later',
    summary:
      'DMR, TETRA, P25, NXDN, M17 and plain FM channels with who called whom, every over recorded as Opus and a local speech model writing down what was said.',
    body: [
      'Every voice protocol lands in one call list: the caller, the group, the length and the channel, whether the transmission was DMR, TETRA, P25, NXDN, M17 or an analogue repeater. On an analogue channel the DTMF unit number and the CTCSS tone or DCS code say which radio keyed up and which group it belongs to.',
      'Turn on Record and each over is kept as Opus. A timeline under the call list draws the recordings against the clock with the quiet marked, so an afternoon can be dragged out as one file, and the recordings table filters by talkgroup, caller, system or frequency.',
      'The transcript view is a Whisper or Qwen3-ASR model on this machine reading everything on the audio bus, on the CPU or on a card, with low-confidence lines flagged rather than quietly wrong. Nothing leaves the machine.',
    ],
    views: ['Calls', 'Transcript', 'Keys'],
    cli: '<span class="c">$</span> waveshark --tune 446.09375 --mode nfm --calls',
    gear: 'RTL-SDR; speech on DMR needs a source build with ambe',
  },
  {
    id: 'reverse-engineering',
    kicker: 'Unclaimed bursts \u00b7 captures \u00b7 replay',
    title: 'Reverse engineer a remote, sensor or alarm',
    summary:
      'Capture the burst, see its envelope, timings and bits, replay it into new decoders as often as you like, and key it back out from a Flipper .sub file.',
    body: [
      'A burst nothing decodes is still kept. Click its row for the envelope, the instantaneous frequency and a hex dump, with the coding inferred and the bits sliced out, which is enough to recognise the same device again and start working out what the fields mean.',
      'The packet log stores the mark and gap timings, the frame bytes and the burst\u2019s own samples rather than the parsed fields, so a decoder written next month gets its chance at a burst heard today. <code>--record</code> writes rtl_433 style captures that both programs read, and the raw capture can be armed on energy so a file is written per burst with the signal from before it triggered.',
      'The scripts panel holds every Flipper <code>.sub</code> file on the machine and keys one at the frequency it names, and a heard burst can be written back out as a key file, which closes the loop between reading a remote and reproducing it.',
    ],
    views: ['Spectrum', 'Signal chain', 'Data links'],
    cli: [
      '<span class="c">$</span> waveshark --tune 433.92 --record captures',
      '<span class="c">$</span> waveshark --replay captures',
    ].join('\n'),
    gear: 'RTL-SDR to read it, HackRF or LimeSDR to send it',
  },
  {
    id: 'drones',
    kicker: '2.4 GHz \u00b7 HackRF or LimeSDR',
    title: 'See drones, their operators and their handsets',
    summary:
      'Remote ID and DJI DroneID with serial, position, height and home point, plus the control link itself with the sticks drawn live.',
    body: [
      'A drone broadcasting Remote ID gives up its serial, its position and where the operator is standing, whether that broadcast rides on Wi-Fi or on Bluetooth LE. A DJI airframe reading its own DroneID adds the home point, which is where it took off from.',
      'The control view is the other half: every model control link in earshot with a bar per channel in microseconds, the frame rate, the signal level and whether the handset is asking to arm. ExpressLRS is placed by the receiver itself; FrSky ACCST, FlySky AFHDS-2A and XN297 are read as well.',
      'One 2.4 GHz channel is 20 MHz wide, so this is the job that wants a HackRF or a LimeSDR rather than a dongle.',
    ],
    views: ['Map', 'Control', 'Devices'],
    cli: '<span class="c">$</span> waveshark --tune 2437 --span 20000 --control',
    gear: 'HackRF One or LimeSDR',
  },
  {
    id: 'weather',
    kicker: '137 MHz \u00b7 400-406 MHz \u00b7 HF',
    title: 'Pull pictures and data out of the sky',
    summary:
      'NOAA APT and Meteor-M LRPT passes drawn as they arrive, HF weather fax charts, and radiosondes tracked from launch to burst.',
    body: [
      'The satellites view lists every pass over your station for the next day with peak elevation, a sky plot, live azimuth, elevation and Doppler, and how stale the orbital elements are. Listening follows the downlink through the whole pass and closes when the satellite sets, so a picture builds up without anyone touching the dial.',
      'NOAA APT and the three MSU-MR channels of a Meteor-M LRPT pass are drawn on the video pane in strips as they come down, and HF weather fax charts are drawn the same way.',
      'Radiosondes are the other half of the weather picture: Vaisala RS41, Graw DFM, Meteomodem M10 and M20, iMet, Meisei, MRZ and LMS6 balloons on the map with serial, height, climb rate and the temperature and humidity they were sent up to measure. The channel follows the transmitter as it drifts, and SondeHub launch sites say when the next one goes up.',
    ],
    views: ['Satellites', 'Video', 'Map'],
    cli: '<span class="c">$</span> waveshark --tune 137.1 --mode wfm --video',
    gear: 'RTL-SDR and a turnstile or V-dipole',
  },
  {
    id: 'ham',
    kicker: 'Amateur bands',
    title: 'Run it as an amateur station',
    summary:
      'APRS, SSTV, RTTY, Morse and M17 read at once, a KISS TNC for the packet software you already use, and memory banks imported from Chirp.',
    body: [
      'One receiver covers the modes an amateur band carries at the same time rather than one at a time: APRS with Mic-E on the EU, US and JP calling frequencies, SSTV in Martin, Scottie and Robot modes saved as each picture ends, RTTY from 45.45 to 200 baud, CW read as text at the speed it was sent, and M17 with its packet messages in full.',
      'A KISS TNC on <code>--kiss-listen</code> hands the traffic to any packet program and keys AX.25 back through the radio, so the software you already run treats the SDR as a modem.',
      'Memory banks import from Chirp, CSV, Freqman and SDR# lists and export as Chirp CSV, and on a radio that can transmit, POCSAG pages, APRS beacons, RTTY overs, BLE advertisements, SSTV pictures and RDS names go back out.',
    ],
    views: ['Messages', 'Video', 'Calls'],
    cli: '<span class="c">$</span> waveshark --tune 144.8 --mode nfm --kiss-listen 8001',
    gear: 'RTL-SDR to receive, HackRF or LimeSDR to transmit',
  },
  {
    id: 'site-survey',
    kicker: '2.4 GHz \u00b7 5 GHz \u00b7 any band',
    title: 'Survey a site and hunt interference',
    summary:
      'A heatmap of the band over hours, what sits on each Wi-Fi, Bluetooth and 802.15.4 channel, and a band walk that stops on whatever it hears.',
    body: [
      'The channels view says what is on each Wi-Fi, Bluetooth and 802.15.4 channel, how loud it is and how crowded it is, which is the answer to where to put your own network rather than a picture of the problem.',
      'Heatmap export keeps the span as readings and writes a page that zooms and pans, with time of day, frequency and decibels under a crosshair. A row is the loudest each bin reached rather than a snapshot, so a transmitter that fired once at three in the morning is still there in the morning, and moving the dial widens the picture instead of clearing it.',
      'The band walk in the scanner settings steps the dial past the span, holds on what it hears or logs it and moves on, with a find you do not care about marked as ignored. Interference that only happens when nobody is watching is the reason any of this runs unattended.',
    ],
    views: ['Channels', 'Spectrum', 'Devices'],
    cli: '<span class="c">$</span> waveshark --tune 2437 --span 20000 --channels',
    gear: 'HackRF or LimeSDR for the 2.4 GHz work, a dongle below it',
  },
  {
    id: 'maritime',
    kicker: 'Marine VHF \u00b7 L band \u00b7 406 MHz',
    title: 'Watch shipping and safety traffic',
    summary:
      'AIS positions and vessel identity on the map, Inmarsat STD-C safety broadcasts, and COSPAS-SARSAT distress beacons with the position they encode.',
    body: [
      'AIS puts vessels on the same map as the aircraft, with identity, position and track, and marine VHF voice runs on channels of its own in the call list beside them.',
      'Inmarsat STD-C off an L-band patch carries the EGC and SafetyNET broadcasts sent to those vessels, which is the traffic that says what is happening rather than where a ship is.',
      'COSPAS-SARSAT beacons at 406 MHz are read for the EPIRB, PLB or ELT identity and the position they encode, drawn on the same map.',
    ],
    views: ['Map', 'Messages', 'Calls'],
    cli: '<span class="c">$</span> waveshark --tune 162 --span 200',
    gear: 'RTL-SDR; L band wants a patch antenna and an LNA',
  },
  {
    id: 'home-assistant',
    kicker: 'MQTT \u00b7 --ha-broker',
    title: 'Feed your own sensors into Home Assistant',
    summary:
      'Every transmitter the decoders can name becomes a Home Assistant device over MQTT, with no hub, no bridge and no cloud account for the sensor you already own.',
    body: [
      'Point <code>--ha-broker</code> at the MQTT broker Home Assistant already uses and a weather station\u2019s temperature and humidity, a meter\u2019s reading, a tyre sensor\u2019s pressure and the level each was heard at appear as devices, no vendor hub involved.',
      '<code>--ha-spaces ism,wmbus</code> keeps it to your own sensors and meters. Leave it open on a band full of handsets and the house fills up with devices that rotate their address every quarter of an hour, which is a warning rather than a feature.',
      'There is a call bus and a message bus too, with an on-air lamp, so an automation can react to a channel going busy.',
    ],
    views: ['Devices', 'Dashboard'],
    cli: '<span class="c">$</span> waveshark --tune 868.3 --ha-broker homeassistant.local --ha-spaces ism,wmbus --headless',
    gear: 'Any RTL-SDR dongle, and a machine that stays on',
  },
  {
    id: 'agents',
    kicker: 'MCP on 127.0.0.1:8931',
    title: 'Let an agent drive the radio',
    summary:
      'Every run serves the receiver over the Model Context Protocol, so a model can tune, open channels, read what arrived and rewire the signal chain in the window you are watching.',
    body: [
      'It is the receiver on the screen rather than a second one: what the agent tunes, opens or switches on appears in the window, and it can take a picture of that window to check what it did. It reads the spectrum, the packets, the calls, the transcript and the tracker, changes anything in the signal chain, and draws the chain itself by adding stages, wiring them and taking them out.',
      'It reaches the settings as well, so it can add a scanner, store a memory, pick a voice, turn on a feed or manage the datasets. The default listens on loopback only, and <code>--mcp-listen off</code> stops it.',
      'On a radio that can transmit, a channel\u2019s transmit source can be the agent itself: give it a name and it answers when called, replies in its own voice and keeps the conversation going for half a minute without being named again.',
    ],
    views: ['Agent', 'Signal chain'],
    cli: '<span class="c">$</span> waveshark --headless --mcp-listen 8931 --print-log',
    gear: 'Any supported radio',
  },
  {
    id: 'remote',
    kicker: '--stream \u00b7 iqstream \u00b7 rtl_tcp',
    title: 'Put the antenna where the signals are',
    summary:
      'Run the tuner on a machine at the mast, read it from the desk over iqstream or rtl_tcp, and stitch several tuners into one wider span.',
    body: [
      'A remote tuner shows up in the receiver list as a local radio, over iqstream or rtl_tcp, and it can be tuned from here rather than only listened to. This receiver serves iqstream as well, so the span a mast-head machine is already collecting can be read by another one without a second antenna.',
      'Several matching tuners can be offered as one wider receiver: the drift between them is measured on the band they share and taken out, which is how a span wider than any one radio gets covered.',
      '<code>--headless</code> runs the whole thing with no window, scanning and logging exactly as the interface would, which is what belongs on the machine in the loft.',
    ],
    views: ['Spectrum', 'Dashboard'],
    cli: '<span class="c">$</span> waveshark --stream rtl_tcp://mast.local:1234 --tune 868.3',
    gear: 'Any supported radio, and a small machine beside it',
  },
  {
    id: 'broadcast',
    kicker: 'UHF \u00b7 band III \u00b7 shortwave',
    title: 'Take broadcast apart',
    summary:
      'A DVB-T multiplex down to its transport stream and playing, DAB ensembles and their stations, DRM services on shortwave, and FM with stereo and RDS.',
    body: [
      'A DVB-T multiplex is read from its carriers down to its transport stream: the transmission parameters, the services on it, and whichever one you pick playing in the window at full frame rate with its sound in step.',
      'A DAB ensemble gives its name, its stations, their programme types and bit rates, and a DRM multiplex on shortwave or medium wave gives its services, their languages and their labels. Neither makes sound yet, which is worth knowing before you go looking for it.',
      'On FM, the receiver reads stereo and RDS, and <code>--mpx</code> reports what is actually in the multiplex at a station, so a failing RDS decode can be blamed on the transmitter or on the receiver rather than guessed at.',
    ],
    views: ['Video', 'Calls', 'Spectrum'],
    cli: '<span class="c">$</span> waveshark --tune 474 --span 8000 --video',
    gear: 'HackRF or LimeSDR for television; a dongle for DAB and FM',
  },
];
