import { parse, TYPE, type MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { collectMessages } from './messages';
import { DEFAULT_LOCALE, LOCALE_CODES } from '../src/i18n/locales';

const URL = process.env.INTL_URL ?? 'http://localhost:8001/v1';
const SHORT = 60;
const BATCH = 30;

const LANGUAGE: Record<string, string> = {
  de: 'German',
  fr: 'French',
  es: 'Spanish (Spain)',
  it: 'Italian',
  pt: 'European Portuguese',
  nl: 'Dutch',
  pl: 'Polish',
  ru: 'Russian',
  ja: 'Japanese',
  zh: 'Simplified Chinese',
};

const PROMPT = (lang: string) => `You translate text for waveshark.io, the website of WaveShark, an open source software defined radio (SDR) receiver that decodes many radio protocols at once, into ${lang}.
Terminology: "Views" are the app's tabs or screens, never page views. "Bands" are radio frequency bands, never music bands. "Keys" are encryption keys. "Flag" is a command line option. "Span" is the sampled bandwidth. "Stitching" joins several tuners into one wider spectrum. "Shipping" is ships and maritime traffic. "Channels" are radio channels. "Tuner" is a radio tuner (Polish: tuner). "Station" is a radio or receiving station, never a train station. "Headless" means running without a window. "Airband" is the aviation VHF band. "Tunable" means its frequency can be changed. "Dial" is the tuned frequency. "Paging" is radio pager messaging. "Relay" is a nostr relay server. "Issues" are GitHub issues.
Keep unchanged: protocol, standard and product names and acronyms (ACARS, AIS, APRS, DMR, DRM, DAB, SSTV, TPMS, GSM, NOAA APT, RTTY, POCSAG, FLEX, Z-Wave, LoRa, Wi-Fi, Windows, Linux, macOS, HackRF, LimeSDR, RTL-SDR, Home Assistant, WaveShark and similar), anything inside <code>...</code>, command line flags starting with --, numbers and units.
Texts are ICU MessageFormat: keep every {placeholder}, every plural construct with its # and keywords, and every <tag>...</tag>, translating only the words, including those inside plural branches, and adding the plural categories ${lang} needs.
Match the register of a technical product website and keep labels short. Never use em dashes or en dashes; use a comma, colon or plain hyphen.
The input is a JSON object of id to the English text and a note saying where it appears. Reply with only a JSON object mapping the same ids to the ${lang} text.`;

type LocaleFile = Record<string, { defaultMessage: string }>;

function shape(els: MessageFormatElement[], out = new Set<string>()): Set<string> {
  for (const e of els) {
    if (e.type === TYPE.argument || e.type === TYPE.number || e.type === TYPE.date) out.add(`arg:${e.value}`);
    if (e.type === TYPE.plural || e.type === TYPE.select) {
      out.add(`plural:${e.value}`);
      for (const o of Object.values(e.options)) shape(o.value, out);
    }
    if (e.type === TYPE.tag) {
      out.add(`tag:${e.value}`);
      shape(e.children, out);
    }
  }
  return out;
}

function signature(text: string): string | null {
  try {
    return [...shape(parse(text))].sort().join(',');
  } catch {
    return null;
  }
}

const matches = (english: string, translated: string) =>
  signature(english) === null
    ? (english.match(/<\/?code>/g) ?? []).length === (translated.match(/<\/?code>/g) ?? []).length
    : signature(translated) === signature(english);

function undash(english: string, text: string, locale: string): string {
  const between = english.includes(' - ') ? ' - ' : null;
  let t = text.replace(/(\d)\s*[–—―]\s*(\d)/g, '$1-$2');
  if (locale === 'ja' || locale === 'zh') {
    t = t.replace(/\s*[–—―]{1,2}\s*/g, between ?? (locale === 'zh' ? '，' : '、'));
  } else {
    t = t
      .replace(/\s+[–—―]\s+/g, between ?? ', ')
      .replace(/(\p{L})[–—―](\p{L})/gu, '$1-$2')
      .replace(/\s*[–—―]\s*/g, ', ');
  }
  return t;
}

async function model(): Promise<string> {
  if (process.env.INTL_MODEL) return process.env.INTL_MODEL;
  const r = await fetch(`${URL}/models`);
  return (await r.json()).data[0].id;
}

async function ask(name: string, lang: string, batch: [string, { english: string; where: string }][]) {
  const input = Object.fromEntries(batch.map(([id, m]) => [id, { text: m.english, where: m.where }]));
  const r = await fetch(`${URL}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: name,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      chat_template_kwargs: { enable_thinking: false },
      messages: [
        { role: 'system', content: PROMPT(lang) },
        { role: 'user', content: JSON.stringify(input, null, 1) },
      ],
    }),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  const reply = (await r.json()).choices[0].message.content as string;
  return JSON.parse(reply.slice(reply.indexOf('{'), reply.lastIndexOf('}') + 1)) as Record<string, unknown>;
}

const messages = await collectMessages();
const name = await model();
const only = process.argv.slice(2);
const locales = LOCALE_CODES.filter(l => l !== DEFAULT_LOCALE && (!only.length || only.includes(l)));

await Promise.all(
  locales.map(async locale => {
    const path = `src/locales/${locale}.json`;
    const file = Bun.file(path);
    const held: LocaleFile = (await file.exists()) ? await file.json() : {};
    const wanted = [...messages].filter(
      ([id, m]) => !held[id] && (m.english.length <= SHORT || m.english.includes('{')),
    );
    wanted.sort(([, a], [, b]) => a.where.localeCompare(b.where));

    let added = 0;
    for (let i = 0; i < wanted.length; i += BATCH) {
      const batch = wanted.slice(i, i + BATCH);
      let reply: Record<string, unknown> = {};
      for (let attempt = 0; attempt < 3 && !Object.keys(reply).length; attempt++) {
        reply = await ask(name, LANGUAGE[locale], batch).catch(e => {
          console.warn(`${locale}: ${e}`);
          return {};
        });
      }
      for (const [id, m] of batch) {
        const t = reply[id];
        if (typeof t === 'string' && t.trim() && matches(m.english, t)) {
          held[id] = { defaultMessage: t.trim() };
          added++;
        }
      }
    }

    const broken: string[] = [];
    const out: LocaleFile = {};
    for (const [id, m] of [...messages].sort(([a], [b]) => a.localeCompare(b))) {
      const t = held[id]?.defaultMessage;
      if (t === undefined) continue;
      const clean = undash(m.english, t, locale);
      if (matches(m.english, clean)) out[id] = { defaultMessage: clean };
      else broken.push(id);
    }
    await Bun.write(path, `${JSON.stringify(out, null, 2)}\n`);
    const missing = messages.size - Object.keys(out).length;
    console.log(`${locale}: ${added} added, ${broken.length} dropped as broken, ${missing} left for ollama_intl`);
  }),
);
