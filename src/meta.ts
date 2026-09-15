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
  downloadUrl: `${SITE}/download`,
  softwareVersion: '0.2.0',
  license: 'https://www.gnu.org/licenses/gpl-3.0.html',
  image: `${SITE}/assets/og.png`,
  screenshot: `${SITE}/assets/screenshot.png`,
  description:
    'An OSINT tool for RF. Leave a cheap SDR on a band and WaveShark decodes everything transmitting inside the span: ISM sensors, TPMS, aircraft, ACARS and VDL Mode 2, ships, APRS, pagers, DMR, TETRA, M17, LoRa mesh, utility meters, Wi-Fi, Bluetooth LE, GSM, RC links, drone Remote ID, SSTV, DVB-T television and analogue video, with fourteen views over one packet stream and an MCP server an agent can drive.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  codeRepository: 'https://github.com/v0l/waveshark',
  author: { '@type': 'Person', name: 'Kieran', url: 'https://github.com/v0l' },
};

export const PAGES: Record<string, PageMeta> = {
  '/': {
    title: 'WaveShark - Wireshark for the radio spectrum',
    description:
      'Leave a cheap SDR on a band and WaveShark tells you what is transmitting around you: sensors, TPMS, aircraft and their datalinks, ships, pagers, DMR, TETRA, M17, LoRa mesh, Wi-Fi, Bluetooth LE, GSM, drones and television, decoded continuously across the whole span.',
    social: 'An OSINT tool for RF. Cover a band continuously and keep everything, decoded or not.',
    canonical: `${SITE}/`,
    jsonLd: softwareJsonLd,
  },
  '/download': {
    title: 'Download WaveShark',
    description:
      'Builds of WaveShark for Linux, Windows and Apple silicon, with CUDA variants for speech on a card, what each one needs from the system, and how to build from source with the tea and ambe features.',
    social: 'Linux, Windows and macOS builds, driver setup, and building from source.',
    canonical: `${SITE}/download`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Download WaveShark',
      url: `${SITE}/download`,
      description:
        'Builds of WaveShark for Linux x86_64, Windows x86_64 and macOS arm64, what each one needs from the system, and how to build from source.',
      isPartOf: { '@type': 'WebSite', name: 'WaveShark', url: `${SITE}/` },
    },
  },
};

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
