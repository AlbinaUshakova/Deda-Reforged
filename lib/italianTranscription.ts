import type { TransliterationMode } from './transliteration.ts';

const ITALIAN_SIMPLE_RU: Record<string, string> = {
  a: 'а', b: 'б', d: 'д', e: 'э', f: 'ф', i: 'и', l: 'л', m: 'м', n: 'н',
  o: 'о', p: 'п', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', z: 'ц',
  j: 'дж', k: 'к', w: 'в', x: 'кс', y: 'й',
};

const ITALIAN_SIMPLE_LATIN: Record<string, string> = {
  a: 'a', b: 'b', d: 'd', e: 'e', f: 'f', i: 'i', l: 'l', m: 'm', n: 'n',
  o: 'o', p: 'p', r: 'r', s: 's', t: 't', u: 'u', v: 'v', z: 'ts',
  j: 'j', k: 'k', w: 'w', x: 'ks', y: 'y',
};

/**
 * Beginner-friendly Italian reading hint.
 *
 * This intentionally describes pronunciation, not letter names. It handles the
 * main spelling combinations learners meet early so words are not rendered as
 * ambiguous per-letter strings such as `k/chinkwue` for `cinque`.
 */
export function italianTextToHint(text: string, mode: TransliterationMode): string {
  const lower = text.toLocaleLowerCase('it');
  const ru = mode === 'ru';
  const simple = ru ? ITALIAN_SIMPLE_RU : ITALIAN_SIMPLE_LATIN;
  const softC = ru ? 'ч' : 'ch';
  const softG = ru ? 'дж' : 'j';
  const hardC = ru ? 'к' : 'k';
  const hardG = ru ? 'г' : 'g';
  const sh = ru ? 'ш' : 'sh';
  const ny = ru ? 'нь' : 'ny';
  const kw = ru ? 'кв' : 'kw';

  let result = '';

  for (let index = 0; index < lower.length; index += 1) {
    const ch = lower[index];
    const next = lower[index + 1] ?? '';
    const after = lower[index + 2] ?? '';
    const fourth = lower[index + 3] ?? '';
    const pair = `${ch}${next}`;
    const triple = `${pair}${after}`;
    const quad = `${triple}${fourth}`;

    // GLI + vowel: famiglia → фамилья / familya, figlio → фильо / filyo.
    if (quad === 'glia' || quad === 'glie' || quad === 'glio' || quad === 'gliu') {
      const vowel = fourth;
      const ruEnding: Record<string, string> = { a: 'лья', e: 'лье', o: 'льо', u: 'лью' };
      const latinEnding: Record<string, string> = { a: 'lya', e: 'lye', o: 'lyo', u: 'lyu' };
      result += ru ? ruEnding[vowel] : latinEnding[vowel];
      index += 3;
      continue;
    }

    if (triple === 'gli') {
      result += ru ? 'льи' : 'lyi';
      index += 2;
      continue;
    }

    // SCI + vowel uses I as a spelling marker: sciarpa → шарпа.
    if (triple === 'sci' && /[aeou]/.test(fourth)) {
      result += sh;
      index += 2;
      continue;
    }

    if (pair === 'gn') {
      result += ny;
      index += 1;
      continue;
    }

    if (pair === 'sc' && /[ei]/.test(after)) {
      result += sh;
      index += 1;
      continue;
    }

    if (pair === 'qu') {
      result += kw;
      index += 1;
      continue;
    }

    // CH/GH keep C/G hard before E and I.
    if (pair === 'ch') {
      result += hardC;
      index += 1;
      continue;
    }

    if (pair === 'gh') {
      result += hardG;
      index += 1;
      continue;
    }

    // Double C/G before E/I keep the soft sound doubled.
    if (pair === 'cc' && /[ei]/.test(after)) {
      result += `${softC}${softC}`;
      index += 1;
      continue;
    }

    if (pair === 'gg' && /[ei]/.test(after)) {
      result += `${softG}${softG}`;
      index += 1;
      continue;
    }

    if (ch === 'c') {
      if (next === 'i' && /[aeou]/.test(after)) {
        result += softC;
        index += 1;
      } else {
        result += /[ei]/.test(next) ? softC : hardC;
      }
      continue;
    }

    if (ch === 'g') {
      if (next === 'i' && /[aeou]/.test(after)) {
        result += softG;
        index += 1;
      } else {
        result += /[ei]/.test(next) ? softG : hardG;
      }
      continue;
    }

    // H has no sound on its own in Italian.
    if (ch === 'h') continue;

    result += simple[ch] ?? ch;
  }

  return result;
}
