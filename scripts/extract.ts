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

type Source = Record<string, { defaultMessage: string; description?: string }>;

const files = [...new Glob('src/**/*.tsx').scanSync('.')].sort();
const jsx: Source = {};
for (const file of files) {
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
          onMsgExtracted: (_file: string, found: { id: string; defaultMessage?: string; description?: string }[]) => {
            for (const m of found) jsx[m.id] = { defaultMessage: m.defaultMessage ?? '', description: m.description };
          },
        },
      ],
    ],
  });
}

const data = [
  CARDS,
  VIEWS,
  RIGS,
  USE_CASES,
  DECODES,
  BANDS,
  RADIOS,
  PLATFORMS,
  COMPARISONS,
  MCP_BODY,
  HA_BODY,
  FLAGS,
  VIEW_FLAGS,
  Object.values(PAGES).map(p => [p.title, p.description, p.social]),
  OG_IMAGE_ALT,
];

const messages: Source = {};
for (const english of copyStrings(data)) messages[messageId(english)] = { defaultMessage: english };
for (const [id, m] of Object.entries(jsx)) {
  const held = messages[id];
  if (held && held.defaultMessage !== m.defaultMessage) {
    throw new Error(`id ${id} is both ${JSON.stringify(held.defaultMessage)} and ${JSON.stringify(m.defaultMessage)}`);
  }
  messages[id] = m.description ? m : { defaultMessage: m.defaultMessage };
}

const sorted = Object.fromEntries(Object.entries(messages).sort(([a], [b]) => a.localeCompare(b)));
await Bun.write('src/locales/en.json', `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`${Object.keys(sorted).length} messages, ${Object.keys(jsx).length} from JSX`);
