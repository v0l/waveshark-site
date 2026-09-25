export const MCP_BODY = [
  'Every run of WaveShark serves the receiver over the Model Context Protocol at <code>http://127.0.0.1:8931/mcp</code>. It is the receiver on the screen rather than a headless second one, so what the agent tunes, opens or switches on appears in the window, and it can take a picture of that window to check what it did.',
  'It reads the spectrum, the packets, the calls, the transcript and the tracker. It changes anything in the signal chain and draws the chain itself: add stages, wire them, delete them, undo, and go back to the automatic graph. It reaches the settings too, so it can add a scanner, store a memory, pick a voice, turn on a feed or manage the cached datasets.',
  'The default listens on loopback only, because a socket that drives a radio should not be handed to a network by leaving a host out. <code>--mcp-listen off</code> stops it entirely, and a <code>host:port</code> puts it somewhere else deliberately.',
  'On a radio that can transmit, a channel\u2019s transmit source can be the agent itself. Give it a name and it answers when called: it hears the over, replies in its own voice through a local speech model, and keeps the conversation going for half a minute without being named again.',
];

export const HA_BODY = [
  'Point <code>--ha-broker</code> at the MQTT broker Home Assistant already uses and every transmitter the decoders can name becomes a device there, through MQTT discovery. A weather station\u2019s temperature and humidity, a meter\u2019s reading, a tyre sensor\u2019s pressure, and the level each was heard at.',
  'The point is that none of it needs the vendor\u2019s hub. A sensor you already own, transmitting in clear on 433 or 868 MHz, becomes a Home Assistant entity because something listened to it, not because a bridge was bought and an account was made.',
  '<code>--ha-spaces ism,wmbus</code> keeps it to your own sensors and meters, which is almost always what you want. Leave it open on a band full of handsets and the house fills up with devices that rotate their address every quarter of an hour, so the default is the narrow one.',
  'There is a call bus and a message bus as well, with an on-air lamp, so an automation can react to a channel going busy or to a page arriving.',
];

export const FLAGS: { flag: string; what: string }[] = [
  { flag: '--tune <mhz>', what: 'Start tuned and listening. Repeat it for several channels at once.' },
  { flag: '--mode <mode>', what: 'wfm, nfm, am, usb, lsb or cw.' },
  { flag: '--span <khz>', what: 'Nearest span to this, narrowed in software when the radio cannot sample that slowly.' },
  { flag: '--device <name>', what: 'Pick a radio when several are plugged in.' },
  { flag: '--gain <db>', what: 'Total tuner gain, distributed across the radio\u2019s stages.' },
  { flag: '--stream <host>', what: 'Offer a network tuner as a radio: iqstream, or rtl_tcp://host:port. Repeatable.' },
  { flag: '--iqstream-listen <addr>', what: 'Serve this span so another machine can read the same samples. Add ,tune to let a subscriber move the dial.' },
  { flag: '--location <lat,lon>', what: 'The receiver position, which lets one ADS-B frame place an aircraft instead of needing a pair.' },
  { flag: '--record [dir]', what: 'Write every burst that decodes as an rtl_433 style capture.' },
  { flag: '--capture-iq', what: 'Write the raw span from the moment the radio starts.' },
  { flag: '--replay [path]', what: 'Decode a capture, a directory of them, or a packet log, and print what came out.' },
  { flag: '--packet-log <dir>', what: 'Where the binary packet log goes, one file a day.' },
  { flag: '--survey [file]', what: 'Record a database of the devices heard and where they were heard.' },
  { flag: '--headless', what: 'Run with no window, scanning and logging as the interface would.' },
  { flag: '--print-log', what: 'Print every packet as it arrives, window or not.' },
  { flag: '--mcp-listen <addr>', what: 'Where to serve MCP, or off. 127.0.0.1:8931 unless told otherwise.' },
  { flag: '--kiss-listen <addr>', what: 'Serve a KISS TNC, so packet software can use the radio and key AX.25 through it.' },
  { flag: '--ha-broker <broker>', what: 'Publish every device heard to Home Assistant over MQTT.' },
  { flag: '--ha-spaces <kinds>', what: 'Which identity spaces are worth publishing, e.g. ism,wmbus.' },
  { flag: '--fetch-data', what: 'Warm the dataset cache before going somewhere without a connection.' },
  { flag: '--probe [mhz]', what: 'Check the signal path with no display.' },
  { flag: '--squelch-probe [mhz]', what: 'Report what the squelch reads on a frequency, for setting one.' },
  { flag: '--settings <name>', what: 'Open with a settings dialog up: agent, radio, spectrum, waterfall, log, scanners, memory, data or app.' },
];

export const VIEW_FLAGS =
  '--chain, --flights, --calls, --messages, --transcript, --links, --control, --channels, --video, --scanners, --gain and --setup open the receiver on a view.';
