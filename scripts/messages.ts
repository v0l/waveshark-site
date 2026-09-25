import { transformAsync } from '@babel/core';
import formatjs from 'babel-plugin-formatjs';
import { Glob } from 'bun';
import { messageId } from '../src/i18n/hash';
import { copyStrings } from '../src/i18n/copy';
import { CARDS, VIEWS, RIGS, USE_CASES } from '../src/content';
import { DECODES } from '../src/decodes';
import { BANDS } from '../src/bands';
import { RADIOS } from '../src/radios';
import { PLATFORMS, COMPARISONS } from '../src/guides';
import { PAGES, OG_IMAGE_ALT } from '../src/meta';
import { FLAGS, HA_BODY, MCP_BODY, VIEW_FLAGS } from '../src/features';

export interface Message {
  english: string;
  where: string;
}

type Named = { name?: string; title?: string };

const DATA: [string, unknown][] = [
  ...CARDS.map((c): [string, unknown] => [`a home page card about what the receiver hears, "${c.title}"`, c]),
  ...VIEWS.map((v): [string, unknown] => [`a view, which is a tab in the WaveShark app, "${v.title}"`, v]),
  ...RIGS.map((r): [string, unknown] => [`a home page card about radio hardware, "${r.title}"`, r]),
  ...([
    ['the use case page', USE_CASES],
    ['the page for the decoder', DECODES],
    ['the page for the radio band', BANDS],
    ['the page for the SDR radio', RADIOS],
    ['the download page for', PLATFORMS],
    ['the comparison page', COMPARISONS],
  ] as [string, Named[]][]).flatMap(([what, list]) =>
    list.map((x): [string, unknown] => [`${what} "${x.name ?? x.title}"`, x]),
  ),
  ['the page about letting an agent drive the radio over MCP', MCP_BODY],
  ['the Home Assistant page', HA_BODY],
  ['the command line flags table', [FLAGS, VIEW_FLAGS]],
  ['a page title or meta description', Object.values(PAGES).map(p => [p.title, p.description, p.social])],
  ['the alt text of the social preview image', OG_IMAGE_ALT],
];

export async function collectMessages(): Promise<Map<string, Message>> {
  const messages = new Map<string, Message>();
  const add = (id: string, english: string, where: string) => {
    const held = messages.get(id);
    if (held && held.english !== english) {
      throw new Error(`id ${id} is both ${JSON.stringify(held.english)} and ${JSON.stringify(english)}`);
    }
    if (!held) messages.set(id, { english, where });
  };

  for (const [where, value] of DATA) {
    for (const english of copyStrings(value)) add(messageId(english), english, where);
  }

  for (const file of [...new Glob('src/**/*.tsx').scanSync('.')].sort()) {
    await transformAsync(await Bun.file(file).text(), {
      filename: file,
      babelrc: false,
      configFile: false,
      code: false,
      parserOpts: { plugins: ['typescript', 'jsx'] },
      plugins: [
        [
          formatjs,
          {
            overrideIdFn: (_id?: string, defaultMessage?: string) => messageId(defaultMessage ?? ''),
            throws: true,
            onMsgExtracted: (_file: string, found: { id: string; defaultMessage?: string }[]) => {
              for (const m of found) add(m.id, m.defaultMessage ?? '', `the site's ${file.replace('src/', '')}`);
            },
          },
        ],
      ],
    });
  }
  return messages;
}
