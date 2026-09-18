import { USE_CASES, VIEWS } from './content';

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
