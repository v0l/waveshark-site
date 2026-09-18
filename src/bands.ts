/// A band as a page: what lives there, what it takes to hear it, and where to
/// point the dial first. The decoders on each page come from `DECODES`, so a
/// band gains an entry when a decoder claims it rather than by hand.
export interface Band {
  slug: string;
  name: string;
  range: string;
  summary: string;
  body: string[];
  /// Where to start listening, as the receiver would be told.
  start: string;
  hardware: string;
}

export const BANDS: Band[] = [
  {
    slug: '433-mhz',
    name: '433 MHz',
    range: '433.05-434.79 MHz',
    summary:
      'The busiest band in most homes: weather sensors, door contacts, gate remotes, tyre pressure sensors and anything else sold with a licence-exempt transmitter in it.',
    body: [
      'This is where a receiver should be pointed first, and it is where WaveShark opens. The devices here transmit on a schedule of their own, every few seconds to every few minutes, so covering the whole band continuously catches things a scan would miss by design.',
      'Almost everything here carries a stable device id, which is what turns an afternoon of listening into a list of devices rather than a list of transmissions. A burst that nothing decodes is still kept, with its timings and bits sliced out, which is where reverse engineering starts.',
      'In North America the equivalent traffic is largely on 315 MHz and 915 MHz, and tyre pressure sensors sit on 315 there.',
    ],
    start: '<span class="c">$</span> waveshark --tune 433.92 --span 2400 --survey',
    hardware: 'Any RTL-SDR dongle',
  },
  {
    slug: '868-mhz',
    name: '868 MHz',
    range: '863-870 MHz',
    summary:
      'The European short range band: utility meters, Z-Wave locks and sensors, LoRa mesh networks and the longer-range end of home automation.',
    body: [
      '868 MHz carries the traffic that matters more than a doorbell: wireless M-Bus meters reporting heat, water and gas, Z-Wave door locks, and LoRa networks including Meshtastic and LoRaWAN sensors.',
      'It is also the band where Home Assistant integration earns its place. Point <code>--ha-broker</code> at the broker Home Assistant already uses, keep it to <code>ism,wmbus</code>, and your own meters and sensors appear as devices with no vendor gateway in the path.',
    ],
    start: '<span class="c">$</span> waveshark --tune 868.3 --span 2400 --survey',
    hardware: 'Any RTL-SDR dongle',
  },
  {
    slug: '915-mhz',
    name: '915 MHz',
    range: '902-928 MHz',
    summary:
      'The North American short range band: Itron ERT utility meters, LoRa, Z-Wave at 908 MHz and a great deal of industrial telemetry.',
    body: [
      'The 902-928 MHz band is wider than its European counterpart and busier with it. Utility meters are the standout: Itron ERT endpoints on gas, water and electricity report a running total every few seconds so a passing van can read a street.',
      'LoRa mesh traffic lives here too, along with frequency-hopping industrial links that a narrowband scanner cannot follow.',
    ],
    start: '<span class="c">$</span> waveshark --tune 915 --span 2400 --survey',
    hardware: 'Any RTL-SDR dongle',
  },
  {
    slug: '2-4-ghz',
    name: '2.4 GHz',
    range: '2400-2483.5 MHz',
    summary:
      'Wi-Fi, Bluetooth LE, Zigbee and Thread, drone Remote ID and the control links flying model aircraft, all in the same 83 MHz.',
    body: [
      'Everything here is wide. One Wi-Fi channel is 20 MHz and DJI DroneID wants 15.36 MS/s, which is why this band is the dividing line between a dongle and a HackRF or LimeSDR.',
      'It is also the band where the channels view earns its keep: 802.15.4 channels sit underneath Wi-Fi ones, so a Zigbee mesh that keeps dropping is usually parked under an access point, and the view says so in one glance.',
    ],
    start: '<span class="c">$</span> waveshark --tune 2437 --span 20000 --channels',
    hardware: 'HackRF One or LimeSDR',
  },
  {
    slug: '5-8-ghz',
    name: '5.8 GHz',
    range: '5645-5945 MHz',
    summary:
      'Analogue FPV video from model aircraft, on the lettered channel plans every pilot uses.',
    body: [
      'Racing and freestyle quadcopters still fly analogue video, because it degrades gracefully where digital cuts out. There is nothing encrypted and nothing that checks itself, so a receiver either draws the picture or does not.',
      'WaveShark names the carrier from its line rate and gives it the channel it corresponds to, R1 or F4 or A5, rather than reporting a frequency you then have to look up.',
    ],
    start: '<span class="c">$</span> waveshark --tune 5800 --span 20000 --video',
    hardware: 'HackRF One or LimeSDR',
  },
  {
    slug: '137-mhz',
    name: '137 MHz satellite',
    range: '137-138 MHz',
    summary:
      'Weather satellites passing overhead: NOAA APT pictures and Meteor-M LRPT, planned from the pass list and followed through Doppler.',
    body: [
      'A polar orbiting weather satellite is overhead for about a quarter of an hour at a time, several times a day, and transmits a picture of the weather under it the whole way down. It is the cheapest satellite reception there is.',
      'The satellites view lists every pass over your station for the next day with peak elevation and a sky plot. Listening follows the downlink across the pass, correcting for Doppler, and closes the channel when the satellite sets.',
    ],
    start: '<span class="c">$</span> waveshark --tune 137.1 --mode wfm --video',
    hardware: 'RTL-SDR with a turnstile, QFH or V-dipole antenna',
  },
  {
    slug: 'airband',
    name: 'Airband',
    range: '118-137 MHz',
    summary:
      'Air traffic control voice on the lower half, and the ACARS and VDL Mode 2 datalinks on the upper half.',
    body: [
      'The voice half is AM, which is why airband sounds the way it does, and it is transcribed here like any other voice channel. Past zoom nine the map draws airports with their air traffic frequencies, so the tower you can hear is one click from the aircraft you can see.',
      'The data half is the more interesting half: ACARS and VDL Mode 2 carry the messages crews and airlines exchange, and WaveShark reads them across the allocation rather than on a channel you have to pick.',
    ],
    start: '<span class="c">$</span> waveshark --tune 131.55 --span 2400 --messages',
    hardware: 'Any RTL-SDR, with an airband antenna',
  },
  {
    slug: '1090-mhz',
    name: '1090 and 978 MHz',
    range: '978 / 1090 MHz',
    summary:
      'Aircraft transponders: ADS-B and Mode S at 1090 MHz worldwide, and UAT at 978 MHz for light aircraft in the United States.',
    body: [
      'These two frequencies are the whole of aircraft tracking. 1090 MHz carries Mode S replies and ADS-B position reports from every airliner; 978 MHz carries UAT, used by American general aviation and by the ground stations uplinking weather and traffic to them.',
      'Give the receiver its own position and a single position frame places an aircraft, rather than needing a matching pair. A mark drawn from one frame is hollow and never joins a trail.',
    ],
    start: '<span class="c">$</span> waveshark --tune 1090 --location 53.34,-6.26 --flights',
    hardware: 'Any RTL-SDR, with an antenna cut for the band',
  },
  {
    slug: 'marine-vhf',
    name: 'Marine VHF',
    range: '156-163 MHz',
    summary:
      'AIS vessel positions on two channels, working channels and calling voice, and the NOAA Weather Radio alerts at the top of the band.',
    body: [
      'AIS at 161.975 and 162.025 MHz puts vessels on the map with identity, course and destination, and WaveShark reads both channels from one span rather than making you choose.',
      'Just above them sit the seven NOAA Weather Radio channels, where a SAME header carries the whole of an alert, its counties and its expiry, in machine-readable form before the announcer says a word.',
    ],
    start: '<span class="c">$</span> waveshark --tune 162 --span 2400',
    hardware: 'Any RTL-SDR, with a marine band antenna',
  },
  {
    slug: 'amateur-vhf-uhf',
    name: 'Amateur VHF and UHF',
    range: '144-148 / 430-450 MHz',
    summary:
      'APRS packet, SSTV pictures, M17 digital voice and the repeaters that identify themselves in Morse.',
    body: [
      'The amateur bands carry several modes at once, and that is exactly what this receiver is for: APRS on the calling frequency, SSTV on 144.500, M17 on the digital voice segment and FM repeaters in between, all decoded from one span rather than one at a time.',
      'A KISS TNC on <code>--kiss-listen</code> hands the packet traffic to the software you already run, and keys AX.25 back through a radio that transmits.',
    ],
    start: '<span class="c">$</span> waveshark --tune 144.8 --mode nfm --kiss-listen 8001',
    hardware: 'Any RTL-SDR; transmitting needs a HackRF or LimeSDR',
  },
  {
    slug: 'business-vhf-uhf',
    name: 'Business VHF and UHF',
    range: '136-174 / 400-470 MHz',
    summary:
      'Site radio, taxis, security, public safety and paging: DMR, P25, NXDN, analogue FM with MDC-1200 and tones, and POCSAG and FLEX paging.',
    body: [
      'This is where working radio lives, and where the identities matter more than the audio. DMR, P25 and NXDN all name the caller and the group in clear even where the speech is encrypted, so the shape of a fleet is readable from the metadata alone.',
      'Analogue channels give up their own identities too: the MDC-1200 burst when a Motorola key goes down, the DTMF unit number, and the CTCSS tone or DCS code that says which group a radio belongs to. Paging shares the same bands, and a fire pager toned out by a two-tone pair is the alert that precedes the voice dispatch.',
    ],
    start: '<span class="c">$</span> waveshark --tune 453.5 --span 2400 --calls',
    hardware: 'Any RTL-SDR',
  },
  {
    slug: 'uhf-400',
    name: '390-406 MHz',
    range: '390-406 MHz',
    summary:
      'TETRA networks, weather balloons on their way to 30 km, and the distress beacons at 406 MHz.',
    body: [
      'Three unrelated things share this stretch of spectrum, and a wide span catches all of them at once. TETRA carries European public safety and transport, with its cells and call setup readable and its ciphers listed in the keys view.',
      'Just above, radiosondes transmit from every launch site twice a day, drifting in frequency as they climb, with the channel following them up. At 406 MHz, COSPAS-SARSAT beacons transmit an identity and often a position, mostly as tests.',
    ],
    start: '<span class="c">$</span> waveshark --tune 403 --span 2400 --location 53.34,-6.26',
    hardware: 'Any RTL-SDR',
  },
  {
    slug: 'uhf-tv',
    name: 'UHF television',
    range: '470-790 MHz',
    summary:
      'DVB-T multiplexes: the transmission parameters, the services each carries, and a programme decoded to picture and sound.',
    body: [
      'A terrestrial television multiplex is 8 MHz of OFDM carrying a transport stream with several services in it. Reading one from the carriers up is the deepest decode on this site, and it reports the parameters a broadcast engineer would ask for.',
      'Pictures play on the macOS build, whose ffmpeg is new enough; the other builds read the multiplex and list what is on it.',
    ],
    start: '<span class="c">$</span> waveshark --tune 474 --span 8000 --video',
    hardware: 'HackRF One or LimeSDR',
  },
  {
    slug: 'band-iii',
    name: 'Band III',
    range: '174-240 MHz',
    summary: 'DAB ensembles, named by block rather than by frequency, with the stations inside them.',
    body: [
      'DAB bundles several stations into one transmission, and reading the ensemble tells you what is in the bundle, what kind of programme each station is and how many kilobits it has been given, which is the number that decides how it sounds.',
      'The blocks are named on the spectrum from the band plan, so 11C reads as 11C.',
    ],
    start: '<span class="c">$</span> waveshark --tune 222.064 --span 2000',
    hardware: 'Any RTL-SDR',
  },
  {
    slug: 'hf',
    name: 'Shortwave',
    range: '3-30 MHz',
    summary:
      'Morse, RTTY, weather fax charts and DRM broadcasting, in the bands that reach across continents.',
    body: [
      'HF is the band where a receiver in one country hears a transmitter in another, and the modes on it are the oldest ones here: Morse still identifies beacons and repeaters, RTTY carries bulletins and contests, and weather fax sends pressure charts to shipping as slow pictures.',
      'DRM is the digital broadcasting standard used where nothing else carries. WaveShark reads the services in a multiplex, their languages and their labels, though not yet the audio.',
      'An RTL-SDR needs an upconverter or a direct sampling modification to reach here at all.',
    ],
    start: '<span class="c">$</span> waveshark --tune 14.085 --mode usb --messages',
    hardware: 'RTL-SDR with an upconverter or direct sampling',
  },
  {
    slug: 'l-band',
    name: 'L band',
    range: '1525-1559 MHz',
    summary:
      'Inmarsat: satellite ACARS from aircraft over oceans, and the EGC and SafetyNET broadcasts sent to shipping.',
    body: [
      'A geostationary satellite is a signal from a fixed direction that never sets, which makes L band the easiest satellite reception after the 137 MHz weather birds, once you have a patch antenna and a low noise amplifier.',
      'What comes down is aircraft datalink from places with no VHF ground station, and the maritime safety broadcasts every commercial vessel is required to receive.',
    ],
    start: '<span class="c">$</span> waveshark --tune 1545 --span 2400 --messages',
    hardware: 'RTL-SDR, an L band patch antenna and an LNA',
  },
  {
    slug: 'gsm',
    name: 'GSM 900 and 1800',
    range: '925-960 / 1805-1880 MHz',
    summary:
      'Base stations identifying themselves continuously: country and network codes, cell ids, neighbour lists and paging.',
    body: [
      'A GSM cell transmits its beacon channel without pause, and everything that identifies it is in clear. That makes a survey of the mobile infrastructure around you a receive-only exercise.',
      'Traffic channels are encrypted and stay that way. What is readable is who the network is, which cell you are under, what it advertises as its neighbours and which subscriber identities are being paged.',
    ],
    start: '<span class="c">$</span> waveshark --tune 941 --span 2000 --links',
    hardware: 'RTL-SDR at 900 MHz; 1800 MHz wants a HackRF or LimeSDR',
  },
];
