import { USE_CASES, VIEWS } from './content';
import { DECODES } from './decodes';
import { BANDS } from './bands';
import { RADIOS } from './radios';
import { PLATFORMS, COMPARISONS } from './guides';

export interface HeadElement {
  type: string;
  props: Record<string, string>;
  children?: string;
}

export interface PageMeta {
  title: string;
  description: string;
  social: string;
  canonical: string;
  jsonLd: unknown;
}

const SITE = 'https://waveshark.io';

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'WaveShark',
  url: `${SITE}/`,
  applicationCategory: 'SecurityApplication',
  applicationSubCategory: 'Software defined radio',
  operatingSystem: 'Linux, Windows, macOS',
  downloadUrl: `${SITE}/download/`,
  softwareVersion: '0.3.0',
  license: 'https://www.gnu.org/licenses/gpl-3.0.html',
  image: `${SITE}/assets/og.png`,
  screenshot: `${SITE}/assets/screenshot.png`,
  description:
    'An OSINT tool for RF. Leave a cheap SDR on a band and WaveShark decodes everything transmitting inside the span: ISM sensors, TPMS, aircraft on ADS-B and UAT, ACARS, VDL Mode 2 and Inmarsat, ships, radiosondes, weather satellites, APRS, pagers, DMR, TETRA, P25, NXDN, M17, LoRa mesh, Z-Wave, Zigbee, utility meters, Wi-Fi, Bluetooth LE, GSM, RC links, drone Remote ID, SSTV, DAB, DRM, DVB-T television and analogue video, with fifteen views over one packet stream and an MCP server an agent can drive.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  codeRepository: 'https://github.com/v0l/waveshark',
  author: { '@type': 'Person', name: 'Kieran', url: 'https://github.com/v0l' },
};

export const PAGES: Record<string, PageMeta> = {
  '/': {
    title: 'WaveShark - Wireshark for the radio spectrum',
    description:
      'Leave a cheap SDR on a band and WaveShark tells you what is transmitting around you: sensors, TPMS, aircraft and their datalinks, ships, radiosondes, pagers, DMR, TETRA, P25, NXDN, M17, LoRa mesh, Wi-Fi, Bluetooth LE, Zigbee, GSM, drones, weather satellites and television, decoded continuously across the whole span.',
    social: 'An OSINT tool for RF. Cover a band continuously and keep everything, decoded or not.',
    canonical: `${SITE}/`,
    jsonLd: softwareJsonLd,
  },
  '/download': {
    title: 'Download WaveShark',
    description:
      'Builds of WaveShark for Linux, Windows and Apple silicon, with CUDA variants for speech on a card, what each one needs from the system, and how to build from source with the tea and ambe features.',
    social: 'Linux, Windows and macOS builds, driver setup, and building from source.',
    canonical: `${SITE}/download/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Download WaveShark',
      url: `${SITE}/download/`,
      description:
        'Builds of WaveShark for Linux x86_64, Windows x86_64 and macOS arm64, what each one needs from the system, and how to build from source.',
      isPartOf: { '@type': 'WebSite', name: 'WaveShark', url: `${SITE}/` },
    },
  },
  '/views': {
    title: 'The fifteen views - WaveShark',
    description:
      'One packet stream read fifteen ways: spectrum and waterfall, the signal chain itself, calls, transcript, messages, video, map, data links, devices, channels, control links, satellite passes, keys and an agent view.',
    social: 'One packet stream, read fifteen ways. None of the views knows a protocol.',
    canonical: `${SITE}/views/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'The fifteen views',
      url: `${SITE}/views/`,
      isPartOf: { '@type': 'WebSite', name: 'WaveShark', url: `${SITE}/` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: VIEWS.map((v, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: v.title,
          description: v.body,
        })),
      },
    },
  },
  '/use-cases': {
    title: 'What you can do with WaveShark - use cases',
    description:
      'Jobs one SDR receiver does: survey the wireless devices around you, track aircraft and shipping, monitor and transcribe radio networks, reverse engineer a remote, follow drones, receive weather satellites and radiosondes, run an amateur station, and let an agent drive the radio.',
    social: 'Device surveys, aircraft, shipping, voice networks, drones, weather satellites and more.',
    canonical: `${SITE}/use-cases/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'WaveShark use cases',
      url: `${SITE}/use-cases/`,
      isPartOf: { '@type': 'WebSite', name: 'WaveShark', url: `${SITE}/` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: USE_CASES.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.title,
          url: `${SITE}/use-cases/${c.id}/`,
        })),
      },
    },
  },
};

for (const c of USE_CASES) {
  const url = `${SITE}/use-cases/${c.id}/`;
  PAGES[`/use-cases/${c.id}`] = {
    title: `${c.title} with an SDR - WaveShark`,
    description: c.summary,
    social: c.summary,
    canonical: url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: c.title,
      url,
      description: c.summary,
      image: `${SITE}/assets/og.png`,
      author: { '@type': 'Person', name: 'Kieran', url: 'https://github.com/v0l' },
      about: { '@type': 'SoftwareApplication', name: 'WaveShark', url: `${SITE}/` },
      isPartOf: { '@type': 'CollectionPage', name: 'WaveShark use cases', url: `${SITE}/use-cases/` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'WaveShark', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Use cases', item: `${SITE}/use-cases/` },
          { '@type': 'ListItem', position: 3, name: c.title, item: url },
        ],
      },
    },
  };
}

const webPage = (name: string, path: string, parent?: [string, string]) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  url: `${SITE}${path}`,
  isPartOf: parent
    ? { '@type': 'CollectionPage', name: parent[0], url: `${SITE}${parent[1]}` }
    : { '@type': 'WebSite', name: 'WaveShark', url: `${SITE}/` },
});

const collection = (name: string, path: string, items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  url: `${SITE}${path}`,
  isPartOf: { '@type': 'WebSite', name: 'WaveShark', url: `${SITE}/` },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: `${SITE}${it.url}`,
    })),
  },
});

PAGES['/decodes'] = {
  title: 'What WaveShark decodes - every protocol',
  description: `${DECODES.length} decoders running at once inside one span: ADS-B, ACARS, VDL Mode 2, AIS, POCSAG and FLEX paging, DMR, P25, NXDN, TETRA, M17, LoRa mesh, wireless M-Bus, Z-Wave, TPMS, ISM sensors, Wi-Fi, Bluetooth LE, Zigbee, drone Remote ID, SSTV, weather satellites, radiosondes, DVB-T, DAB and DRM.`,
  social: 'Every protocol WaveShark reads, and what each one gives you.',
  canonical: `${SITE}/decodes/`,
  jsonLd: collection(
    'WaveShark decoders',
    '/decodes/',
    DECODES.map(d => ({ name: d.name, url: `/decodes/${d.slug}/` })),
  ),
};

for (const d of DECODES) {
  PAGES[`/decodes/${d.slug}`] = {
    title: `${d.name} decoder for SDR - WaveShark`,
    description: `${d.summary}${d.aka ? ` Also known as ${d.aka}.` : ''}`,
    social: d.summary,
    canonical: `${SITE}/decodes/${d.slug}/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `${d.name} decoder`,
      url: `${SITE}/decodes/${d.slug}/`,
      description: d.summary,
      about: { '@type': 'Thing', name: d.name, alternateName: d.aka },
      isPartOf: { '@type': 'CollectionPage', name: 'WaveShark decoders', url: `${SITE}/decodes/` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'WaveShark', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Decoders', item: `${SITE}/decodes/` },
          { '@type': 'ListItem', position: 3, name: d.name, item: `${SITE}/decodes/${d.slug}/` },
        ],
      },
    },
  };
}

PAGES['/bands'] = {
  title: 'What is transmitting on each band - WaveShark',
  description:
    'Band by band: what is on 433, 868 and 915 MHz, the 2.4 and 5.8 GHz bands, airband, 1090 MHz, marine VHF, the amateur and business allocations, 137 MHz satellites, L band, shortwave and television.',
  social: 'Point a radio at a band and see what is already transmitting on it.',
  canonical: `${SITE}/bands/`,
  jsonLd: collection(
    'Bands',
    '/bands/',
    BANDS.map(b => ({ name: b.name, url: `/bands/${b.slug}/` })),
  ),
};

for (const b of BANDS) {
  PAGES[`/bands/${b.slug}`] = {
    title: `${b.name} (${b.range}): what is transmitting there`,
    description: b.summary,
    social: b.summary,
    canonical: `${SITE}/bands/${b.slug}/`,
    jsonLd: webPage(b.name, `/bands/${b.slug}/`, ['Bands', '/bands/']),
  };
}

PAGES['/hardware'] = {
  title: 'SDR hardware for WaveShark - RTL-SDR, HackRF, LimeSDR',
  description:
    'Which radio for which job: an RTL-SDR dongle for the narrowband protocols, a HackRF One or LimeSDR for Wi-Fi, Bluetooth, drone Remote ID and television, and a tuner on another machine over iqstream or rtl_tcp.',
  social: 'A €30 dongle does most of it. Here is what the wider radios buy you.',
  canonical: `${SITE}/hardware/`,
  jsonLd: collection(
    'Hardware',
    '/hardware/',
    RADIOS.map(r => ({ name: r.name, url: `/hardware/${r.slug}/` })),
  ),
};

for (const r of RADIOS) {
  PAGES[`/hardware/${r.slug}`] = {
    title: `${r.name} with WaveShark - what it reaches`,
    description: r.summary,
    social: r.summary,
    canonical: `${SITE}/hardware/${r.slug}/`,
    jsonLd: webPage(r.name, `/hardware/${r.slug}/`, ['Hardware', '/hardware/']),
  };
}

for (const p of PLATFORMS) {
  PAGES[`/download/${p.slug}`] = {
    title: `Download WaveShark for ${p.name}`,
    description: p.summary,
    social: p.summary,
    canonical: `${SITE}/download/${p.slug}/`,
    jsonLd: webPage(`WaveShark for ${p.name}`, `/download/${p.slug}/`, ['Download', '/download/']),
  };
}

for (const c of COMPARISONS) {
  PAGES[`/vs/${c.slug}`] = {
    title: `${c.name} - where each one wins`,
    description: c.summary,
    social: c.summary,
    canonical: `${SITE}/vs/${c.slug}/`,
    jsonLd: webPage(c.name, `/vs/${c.slug}/`),
  };
}

PAGES['/mcp'] = {
  title: 'An SDR receiver an agent can drive - WaveShark MCP server',
  description:
    'Every run serves the receiver over the Model Context Protocol on 127.0.0.1:8931, so a model can tune, open channels, read the spectrum and packets, edit the signal chain and screenshot the window it is driving.',
  social: 'MCP on the loopback: an agent drives the receiver you are watching.',
  canonical: `${SITE}/mcp/`,
  jsonLd: webPage('Let an agent drive the radio', '/mcp/'),
};

PAGES['/home-assistant'] = {
  title: 'RF sensors into Home Assistant over MQTT - WaveShark',
  description:
    'Publish every transmitter the decoders can name to Home Assistant over MQTT: weather stations, wireless M-Bus and ERT meters, TPMS pressure and the level each was heard at, with no vendor hub.',
  social: 'Your own 433 and 868 MHz sensors as Home Assistant devices, no hub required.',
  canonical: `${SITE}/home-assistant/`,
  jsonLd: webPage('RF sensors into Home Assistant', '/home-assistant/'),
};

PAGES['/cli'] = {
  title: 'WaveShark command line reference',
  description:
    'Every WaveShark flag: --tune, --span, --mode, --record, --replay, --headless, --survey, --mcp-listen, --kiss-listen, --iqstream-listen, --ha-broker, --probe and the switches that open the receiver on a view.',
  social: 'Every flag, and the two that matter most.',
  canonical: `${SITE}/cli/`,
  jsonLd: webPage('Command line reference', '/cli/'),
};

PAGES['/tuners'] = {
  title: 'Public SDR tuners on a map - WaveShark',
  description:
    'A live map of the iqstream servers people share through the WaveShark directory on nostr: where each receiver is, the tuners it has, what they are set to and the address to open it at.',
  social: 'Shared SDR receivers anybody can open as a remote radio, read live from nostr.',
  canonical: `${SITE}/tuners/`,
  jsonLd: webPage('Public tuners', '/tuners/'),
};

/// Every path the build prerenders, which is also every path in the sitemap.
export const ROUTES = Object.keys(PAGES);

export function headFor(path: string) {
  const page = PAGES[path] ?? PAGES['/'];
  const elements: HeadElement[] = [
    { type: 'meta', props: { name: 'description', content: page.description } },
    { type: 'link', props: { rel: 'canonical', href: page.canonical } },
    { type: 'meta', props: { property: 'og:url', content: page.canonical } },
    { type: 'meta', props: { property: 'og:title', content: page.title } },
    { type: 'meta', props: { property: 'og:description', content: page.social } },
    { type: 'meta', props: { name: 'twitter:title', content: page.title } },
    { type: 'meta', props: { name: 'twitter:description', content: page.social } },
    {
      type: 'script',
      props: { type: 'application/ld+json' },
      children: JSON.stringify(page.jsonLd),
    },
  ];
  return { lang: 'en', title: page.title, elements: new Set(elements) };
}
