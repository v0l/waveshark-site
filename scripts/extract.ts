import { collectMessages } from './messages';

const messages = await collectMessages();
const sorted = Object.fromEntries(
  [...messages].sort(([a], [b]) => a.localeCompare(b)).map(([id, m]) => [id, { defaultMessage: m.english }]),
);
await Bun.write('src/locales/en.json', `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`${messages.size} messages`);
