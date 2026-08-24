import { DEFAULT_COURSE_ID, getCourse, getLetterHint } from './courses.ts';

export type TransliterationMode = 'ru' | 'latin';
// In this app, `ru` is the sound written in Cyrillic, and `latin` is the same sound written in Latin.
export function geLetterToHint(ch: string, mode: TransliterationMode): string {
  return getLetterHint(ch, mode, DEFAULT_COURSE_ID);
}

export function letterToHint(
  ch: string,
  mode: TransliterationMode,
  courseId: unknown,
): string {
  return getLetterHint(ch, mode, courseId) || geLetterToHint(ch, mode);
}

export function geTextToHint(text: string, mode: TransliterationMode): string {
  return Array.from(text).map(ch => geLetterToHint(ch, mode) || ch).join('');
}

const SERBIAN_CYRILLIC_TO_LATIN: Record<string, string> = {
  А: 'a', Б: 'b', В: 'v', Г: 'g', Д: 'd', Ђ: 'dj', Е: 'e', Ж: 'zh', З: 'z', И: 'i',
  Ј: 'j', К: 'k', Л: 'l', Љ: 'lj', М: 'm', Н: 'n', Њ: 'nj', О: 'o', П: 'p', Р: 'r',
  С: 's', Т: 't', Ћ: 'ch', У: 'u', Ф: 'f', Х: 'h', Ц: 'ts', Ч: 'ch', Џ: 'dz', Ш: 'sh',
};

const SERBIAN_CYRILLIC_TO_LATIN_DISPLAY: Record<string, string> = {
  А: 'A', а: 'a',
  Б: 'B', б: 'b',
  В: 'V', в: 'v',
  Г: 'G', г: 'g',
  Д: 'D', д: 'd',
  Ђ: 'Đ', ђ: 'đ',
  Е: 'E', е: 'e',
  Ж: 'Ž', ж: 'ž',
  З: 'Z', з: 'z',
  И: 'I', и: 'i',
  Ј: 'J', ј: 'j',
  К: 'K', к: 'k',
  Л: 'L', л: 'l',
  Љ: 'Lj', љ: 'lj',
  М: 'M', м: 'm',
  Н: 'N', н: 'n',
  Њ: 'Nj', њ: 'nj',
  О: 'O', о: 'o',
  П: 'P', п: 'p',
  Р: 'R', р: 'r',
  С: 'S', с: 's',
  Т: 'T', т: 't',
  Ћ: 'Ć', ћ: 'ć',
  У: 'U', у: 'u',
  Ф: 'F', ф: 'f',
  Х: 'H', х: 'h',
  Ц: 'C', ц: 'c',
  Ч: 'Č', ч: 'č',
  Џ: 'Dž', џ: 'dž',
  Ш: 'Š', ш: 'š',
};

const SERBIAN_CYRILLIC_TO_RU: Record<string, string> = {
  А: 'а', Б: 'б', В: 'в', Г: 'г', Д: 'д', Ђ: 'джь', Е: 'э', Ж: 'ж', З: 'з', И: 'и',
  Ј: 'й', К: 'к', Л: 'л', Љ: 'ль', М: 'м', Н: 'н', Њ: 'нь', О: 'о', П: 'п', Р: 'р',
  С: 'с', Т: 'т', Ћ: 'чь', У: 'у', Ф: 'ф', Х: 'х', Ц: 'ц', Ч: 'ч', Џ: 'дж', Ш: 'ш',
};

const TURKISH_TO_RU: Record<string, string> = {
  a: 'а', b: 'б', c: 'дж', ç: 'ч', d: 'д', e: 'э', f: 'ф', g: 'г', ğ: '',
  h: 'х', ı: 'ы', i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о',
  ö: 'ё', p: 'п', r: 'р', s: 'с', ş: 'ш', t: 'т', u: 'у', ü: 'ю', v: 'в',
  y: 'й', z: 'з',
};

const TURKISH_TO_EN: Record<string, string> = {
  a: 'a', b: 'b', c: 'j', ç: 'ch', d: 'd', e: 'e', f: 'f', g: 'g', ğ: '',
  h: 'h', ı: 'i', i: 'i', j: 'zh', k: 'k', l: 'l', m: 'm', n: 'n', o: 'o',
  ö: 'oe', p: 'p', r: 'r', s: 's', ş: 'sh', t: 't', u: 'u', ü: 'ue', v: 'v',
  y: 'y', z: 'z',
};

const SPANISH_TO_RU: Record<string, string> = {
  a: 'а', á: 'а', b: 'б', d: 'д', e: 'э', é: 'э', f: 'ф', i: 'и', í: 'и',
  j: 'х', k: 'к', l: 'л', m: 'м', n: 'н', ñ: 'нь', o: 'о', ó: 'о', p: 'п',
  r: 'р', s: 'с', t: 'т', u: 'у', ú: 'у', ü: 'у', v: 'в', w: 'в', x: 'кс',
  y: 'й', z: 'с',
};

const SPANISH_TO_EN: Record<string, string> = {
  a: 'a', á: 'a', b: 'b', d: 'd', e: 'e', é: 'e', f: 'f', i: 'i', í: 'i',
  j: 'h', k: 'k', l: 'l', m: 'm', n: 'n', ñ: 'ny', o: 'o', ó: 'o', p: 'p',
  r: 'r', s: 's', t: 't', u: 'u', ú: 'u', ü: 'u', v: 'v', w: 'w', x: 'x',
  y: 'y', z: 'z',
};

const GERMAN_TO_RU: Record<string, string> = {
  a: 'а', ä: 'э', b: 'б', c: 'к', d: 'д', e: 'э', f: 'ф', g: 'г', h: 'х',
  i: 'и', j: 'й', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', ö: 'ё', p: 'п',
  q: 'к', r: 'р', s: 'с', ß: 'сс', t: 'т', u: 'у', ü: 'ю', v: 'ф', w: 'в',
  x: 'кс', y: 'и', z: 'ц',
};

const GERMAN_TO_EN: Record<string, string> = {
  a: 'a', ä: 'ae', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g', h: 'h',
  i: 'i', j: 'y', k: 'k', l: 'l', m: 'm', n: 'n', o: 'o', ö: 'oe', p: 'p',
  q: 'q', r: 'r', s: 's', ß: 'ss', t: 't', u: 'u', ü: 'ue', v: 'v', w: 'w',
  x: 'x', y: 'y', z: 'z',
};

function mapCharacters(text: string, map: Record<string, string>, locale: string): string {
  return Array.from(text).map((ch) => {
    const lower = ch.toLocaleLowerCase(locale);
    return map[lower] ?? ch;
  }).join('');
}

function serbianTextToHint(text: string, mode: TransliterationMode): string {
  const map = mode === 'latin' ? SERBIAN_CYRILLIC_TO_LATIN : SERBIAN_CYRILLIC_TO_RU;
  return Array.from(text).map((ch) => {
    const upper = ch.toLocaleUpperCase('sr');
    return map[upper] ?? ch;
  }).join('');
}

function serbianDisplayText(text: string, mode: TransliterationMode): string {
  if (mode !== 'latin') return text;
  return Array.from(text).map((ch) => SERBIAN_CYRILLIC_TO_LATIN_DISPLAY[ch] ?? ch).join('');
}

function turkishTextToHint(text: string, mode: TransliterationMode): string {
  if (mode === 'latin') return mapCharacters(text, TURKISH_TO_EN, 'tr');

  const lower = text.toLocaleLowerCase('tr');
  let result = '';
  for (let index = 0; index < lower.length; index += 1) {
    const ch = lower[index];
    const prev = lower[index - 1] ?? '';
    const next = lower[index + 1] ?? '';

    if (ch === 'ğ') {
      if (/[aeıioöuü]/.test(prev) && !/[aeıioöuü]/.test(next)) {
        result += TURKISH_TO_RU[prev] ?? '';
      }
      continue;
    }

    result += TURKISH_TO_RU[ch] ?? ch;
  }

  return result;
}

function spanishTextToHint(text: string, mode: TransliterationMode): string {
  const lower = text.toLocaleLowerCase('es');
  if (mode === 'latin') return mapCharacters(lower, SPANISH_TO_EN, 'es');

  let result = '';
  for (let index = 0; index < lower.length; index += 1) {
    const ch = lower[index];
    const next = lower[index + 1] ?? '';
    const pair = `${ch}${next}`;

    if (pair === 'ch') {
      result += 'ч';
      index += 1;
      continue;
    }

    if (pair === 'll') {
      result += 'й';
      index += 1;
      continue;
    }

    if (ch === 'q' && next === 'u') {
      result += 'к';
      index += 1;
      continue;
    }

    if (ch === 'g' && next === 'u' && ['e', 'é', 'i', 'í'].includes(lower[index + 2] ?? '')) {
      result += 'г';
      index += 1;
      continue;
    }

    if (ch === 'c') {
      result += ['e', 'é', 'i', 'í'].includes(next) ? 'с' : 'к';
      continue;
    }

    if (ch === 'g') {
      result += ['e', 'é', 'i', 'í'].includes(next) ? 'х' : 'г';
      continue;
    }

    if (ch === 'h') {
      if (next === 'i' && /[aeiouáéíóúü]/.test(lower[index + 2] ?? '')) {
        result += 'й';
        index += 1;
      }
      continue;
    }

    result += SPANISH_TO_RU[ch] ?? ch;
  }

  return result;
}

function germanTextToHint(text: string, mode: TransliterationMode): string {
  const lower = text.toLocaleLowerCase('de');
  if (text.length === 1) {
    const upper = text === 'ß' ? 'ẞ' : text.toLocaleUpperCase('de');
    return getLetterHint(upper, mode, 'de') || text;
  }

  if (mode === 'latin') return mapCharacters(lower, GERMAN_TO_EN, 'de');

  let result = '';
  for (let index = 0; index < lower.length; index += 1) {
    const ch = lower[index];
    const next = lower[index + 1] ?? '';
    const pair = `${ch}${next}`;
    const triple = `${ch}${next}${lower[index + 2] ?? ''}`;
    const startsWord = index === 0 || !/[a-zäöüß]/.test(lower[index - 1] ?? '');

    if (triple === 'sch') {
      result += 'ш';
      index += 2;
      continue;
    }

    if (pair === 'qu') {
      result += 'кв';
      index += 1;
      continue;
    }

    if (pair === 'ch') {
      result += 'х';
      index += 1;
      continue;
    }

    if (pair === 'ei') {
      result += 'ай';
      index += 1;
      continue;
    }

    if (pair === 'ie') {
      result += 'и';
      index += 1;
      continue;
    }

    if (pair === 'eu' || pair === 'äu') {
      result += 'ой';
      index += 1;
      continue;
    }

    if (startsWord && pair === 'sp') {
      result += 'шп';
      index += 1;
      continue;
    }

    if (startsWord && pair === 'st') {
      result += 'шт';
      index += 1;
      continue;
    }

    if (ch === 'h' && /[aeiouäöü]/.test(lower[index - 1] ?? '')) continue;

    if (startsWord && ch === 's' && /[aeiouäöü]/.test(next)) {
      result += 'з';
      continue;
    }

    result += GERMAN_TO_RU[ch] ?? ch;
  }

  return result;
}

export function textToHint(
  text: string,
  mode: TransliterationMode,
  courseId: unknown = DEFAULT_COURSE_ID,
): string {
  const course = getCourse(courseId);
  if (course.id === DEFAULT_COURSE_ID) return geTextToHint(text, mode);
  if (course.id === 'sr') return serbianTextToHint(text, mode);
  if (course.id === 'tr') return turkishTextToHint(text, mode);
  if (course.id === 'es') return spanishTextToHint(text, mode);
  if (course.id === 'de') return germanTextToHint(text, mode);

  return Array.from(text).map((ch) => {
    const upper = ch === 'ß' ? 'ẞ' : ch.toLocaleUpperCase(course.locale);
    return getLetterHint(upper, mode, course.id) || ch;
  }).join('');
}

export function getDisplayText(
  text: string,
  mode: TransliterationMode,
  courseId: unknown = DEFAULT_COURSE_ID,
): string {
  const course = getCourse(courseId);
  if (course.id === 'sr') return serbianDisplayText(text, mode);
  return text;
}
