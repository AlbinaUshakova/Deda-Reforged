import { geLetterAudioMap } from './georgianLetterAudio.ts';

export type CourseId = 'ka' | 'sr' | 'tr' | 'es';

export type Course = {
  id: CourseId;
  title: string;
  shortTitle: string;
  sourceLanguageLabel: string;
  targetLanguageLabel: string;
  alphabetTitle: string;
  alphabet: string[];
  alphabetRows: string[][];
  letterNames: Record<string, string>;
  letterHints: {
    ru: Record<string, string>;
    latin: Record<string, string>;
  };
  letterAudioMap: Record<string, string>;
  speechLang: string;
  locale: string;
};

const GEORGIAN_ALPHABET = [
  'ა', 'ბ', 'გ', 'დ', 'ე', 'ვ', 'ზ', 'თ', 'ი', 'კ', 'ლ',
  'მ', 'ნ', 'ო', 'პ', 'ჟ', 'რ', 'ს', 'ტ', 'უ', 'ფ', 'ქ',
  'ღ', 'ყ', 'შ', 'ჩ', 'ც', 'ძ', 'წ', 'ჭ', 'ხ', 'ჯ', 'ჰ',
];

const GEORGIAN_LETTER_NAMES: Record<string, string> = {
  'ა': 'ანი',
  'ბ': 'ბანი',
  'გ': 'განი',
  'დ': 'დონი',
  'ე': 'ენი',
  'ვ': 'ვინი',
  'ზ': 'ზენი',
  'თ': 'თანი',
  'ი': 'ინი',
  'კ': 'კანი',
  'ლ': 'ლასი',
  'მ': 'მანი',
  'ნ': 'ნარი',
  'ო': 'ონი',
  'პ': 'პარი',
  'ჟ': 'ჟანი',
  'რ': 'რაე',
  'ს': 'სანი',
  'ტ': 'ტარი',
  'უ': 'უნი',
  'ფ': 'ფარი',
  'ქ': 'ქანი',
  'ღ': 'ღანი',
  'ყ': 'ყარი',
  'შ': 'შინი',
  'ჩ': 'ჩინი',
  'ც': 'ცანი',
  'ძ': 'ძილი',
  'წ': 'წილი',
  'ჭ': 'ჭარი',
  'ხ': 'ხანი',
  'ჯ': 'ჯანი',
  'ჰ': 'ჰაე',
};

const GEORGIAN_RU_HINTS: Record<string, string> = {
  'ა': 'а',
  'ბ': 'б',
  'გ': 'г',
  'დ': 'д',
  'ე': 'э',
  'ვ': 'в',
  'ზ': 'з',
  'თ': 'т',
  'ი': 'и',
  'კ': 'к',
  'ლ': 'л',
  'მ': 'м',
  'ნ': 'н',
  'ო': 'о',
  'პ': 'п',
  'ჟ': 'ж',
  'რ': 'р',
  'ს': 'с',
  'ტ': 'т',
  'უ': 'у',
  'ფ': 'ф',
  'ქ': 'к',
  'ღ': 'г',
  'ყ': 'къ',
  'შ': 'ш',
  'ჩ': 'ч',
  'ც': 'ц',
  'ძ': 'дз',
  'წ': 'ц',
  'ჭ': 'ч',
  'ხ': 'х',
  'ჯ': 'дж',
  'ჰ': 'х',
};

const GEORGIAN_LATIN_HINTS: Record<string, string> = {
  'ა': 'a',
  'ბ': 'b',
  'გ': 'g',
  'დ': 'd',
  'ე': 'e',
  'ვ': 'v',
  'ზ': 'z',
  'თ': 't',
  'ი': 'i',
  'კ': 'k',
  'ლ': 'l',
  'მ': 'm',
  'ნ': 'n',
  'ო': 'o',
  'პ': 'p',
  'ჟ': 'zh',
  'რ': 'r',
  'ს': 's',
  'ტ': 't',
  'უ': 'u',
  'ფ': 'p',
  'ქ': 'k',
  'ღ': 'gh',
  'ყ': 'q',
  'შ': 'sh',
  'ჩ': 'ch',
  'ც': 'ts',
  'ძ': 'dz',
  'წ': 'ts',
  'ჭ': 'ch',
  'ხ': 'kh',
  'ჯ': 'j',
  'ჰ': 'h',
};

const SERBIAN_ALPHABET = [
  'А', 'Б', 'В', 'Г', 'Д', 'Ђ', 'Е', 'Ж', 'З', 'И',
  'Ј', 'К', 'Л', 'Љ', 'М', 'Н', 'Њ', 'О', 'П', 'Р',
  'С', 'Т', 'Ћ', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Џ', 'Ш',
];

const SERBIAN_RU_HINTS: Record<string, string> = {
  'А': 'а',
  'Б': 'б',
  'В': 'в',
  'Г': 'г',
  'Д': 'д',
  'Ђ': 'джь',
  'Е': 'э',
  'Ж': 'ж',
  'З': 'з',
  'И': 'и',
  'Ј': 'й',
  'К': 'к',
  'Л': 'л',
  'Љ': 'ль',
  'М': 'м',
  'Н': 'н',
  'Њ': 'нь',
  'О': 'о',
  'П': 'п',
  'Р': 'р',
  'С': 'с',
  'Т': 'т',
  'Ћ': 'чь',
  'У': 'у',
  'Ф': 'ф',
  'Х': 'х',
  'Ц': 'ц',
  'Ч': 'ч',
  'Џ': 'дж',
  'Ш': 'ш',
};

const SERBIAN_LATIN_HINTS: Record<string, string> = {
  'А': 'a',
  'Б': 'b',
  'В': 'v',
  'Г': 'g',
  'Д': 'd',
  'Ђ': 'dj',
  'Е': 'e',
  'Ж': 'z',
  'З': 'z',
  'И': 'i',
  'Ј': 'j',
  'К': 'k',
  'Л': 'l',
  'Љ': 'lj',
  'М': 'm',
  'Н': 'n',
  'Њ': 'nj',
  'О': 'o',
  'П': 'p',
  'Р': 'r',
  'С': 's',
  'Т': 't',
  'Ћ': 'c',
  'У': 'u',
  'Ф': 'f',
  'Х': 'h',
  'Ц': 'c',
  'Ч': 'c',
  'Џ': 'dz',
  'Ш': 's',
};

const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z',
];

const TURKISH_RU_HINTS: Record<string, string> = {
  A: 'а',
  B: 'б',
  C: 'дж',
  'Ç': 'ч',
  D: 'д',
  E: 'э',
  F: 'ф',
  G: 'г',
  'Ğ': 'мягк.',
  H: 'х',
  I: 'ы',
  'İ': 'и',
  J: 'ж',
  K: 'к',
  L: 'л',
  M: 'м',
  N: 'н',
  O: 'о',
  'Ö': 'ё',
  P: 'п',
  R: 'р',
  S: 'с',
  'Ş': 'ш',
  T: 'т',
  U: 'у',
  'Ü': 'ю',
  V: 'в',
  Y: 'й',
  Z: 'з',
};

const TURKISH_LATIN_HINTS: Record<string, string> = {
  A: 'a',
  B: 'b',
  C: 'c',
  'Ç': 'ç',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  'Ğ': 'ğ',
  H: 'h',
  I: 'ı',
  'İ': 'i',
  J: 'j',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o',
  'Ö': 'ö',
  P: 'p',
  R: 'r',
  S: 's',
  'Ş': 'ş',
  T: 't',
  U: 'u',
  'Ü': 'ü',
  V: 'v',
  Y: 'y',
  Z: 'z',
};

const SPANISH_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

const SPANISH_RU_HINTS: Record<string, string> = {
  A: 'а',
  B: 'б',
  C: 'к/с',
  D: 'д',
  E: 'э',
  F: 'ф',
  G: 'г/х',
  H: 'нем.',
  I: 'и',
  J: 'х',
  K: 'к',
  L: 'л',
  M: 'м',
  N: 'н',
  'Ñ': 'нь',
  O: 'о',
  P: 'п',
  Q: 'к',
  R: 'р',
  S: 'с',
  T: 'т',
  U: 'у',
  V: 'б/в',
  W: 'в',
  X: 'кс',
  Y: 'й/и',
  Z: 'с',
};

const SPANISH_LATIN_HINTS: Record<string, string> = {
  A: 'a',
  B: 'b',
  C: 'c',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  H: 'h',
  I: 'i',
  J: 'j',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  'Ñ': 'ñ',
  O: 'o',
  P: 'p',
  Q: 'q',
  R: 'r',
  S: 's',
  T: 't',
  U: 'u',
  V: 'v',
  W: 'w',
  X: 'x',
  Y: 'y',
  Z: 'z',
};

function rows(alphabet: string[], size: number): string[][] {
  const result: string[][] = [];
  for (let index = 0; index < alphabet.length; index += size) {
    result.push(alphabet.slice(index, index + size));
  }
  return result;
}

export const COURSES: Record<CourseId, Course> = {
  ka: {
    id: 'ka',
    title: 'Грузинский',
    shortTitle: 'Грузинский',
    sourceLanguageLabel: '🇬🇪',
    targetLanguageLabel: '🇷🇺',
    alphabetTitle: 'ანბანი',
    alphabet: GEORGIAN_ALPHABET,
    alphabetRows: rows(GEORGIAN_ALPHABET, 6),
    letterNames: GEORGIAN_LETTER_NAMES,
    letterHints: {
      ru: GEORGIAN_RU_HINTS,
      latin: GEORGIAN_LATIN_HINTS,
    },
    letterAudioMap: geLetterAudioMap,
    speechLang: 'ka-GE',
    locale: 'ka',
  },
  sr: {
    id: 'sr',
    title: 'Сербский',
    shortTitle: 'Сербский',
    sourceLanguageLabel: '🇷🇸',
    targetLanguageLabel: '🇷🇺',
    alphabetTitle: 'Азбука',
    alphabet: SERBIAN_ALPHABET,
    alphabetRows: rows(SERBIAN_ALPHABET, 6),
    letterNames: Object.fromEntries(SERBIAN_ALPHABET.map(letter => [letter, letter])),
    letterHints: {
      ru: SERBIAN_RU_HINTS,
      latin: SERBIAN_LATIN_HINTS,
    },
    letterAudioMap: {},
    speechLang: 'sr-RS',
    locale: 'sr',
  },
  tr: {
    id: 'tr',
    title: 'Турецкий',
    shortTitle: 'Турецкий',
    sourceLanguageLabel: '🇹🇷',
    targetLanguageLabel: '🇷🇺',
    alphabetTitle: 'Alfabe',
    alphabet: TURKISH_ALPHABET,
    alphabetRows: rows(TURKISH_ALPHABET, 6),
    letterNames: Object.fromEntries(TURKISH_ALPHABET.map(letter => [letter, letter])),
    letterHints: {
      ru: TURKISH_RU_HINTS,
      latin: TURKISH_LATIN_HINTS,
    },
    letterAudioMap: {},
    speechLang: 'tr-TR',
    locale: 'tr',
  },
  es: {
    id: 'es',
    title: 'Испанский',
    shortTitle: 'Испанский',
    sourceLanguageLabel: '🇪🇸',
    targetLanguageLabel: '🇷🇺',
    alphabetTitle: 'Alfabeto',
    alphabet: SPANISH_ALPHABET,
    alphabetRows: rows(SPANISH_ALPHABET, 6),
    letterNames: Object.fromEntries(SPANISH_ALPHABET.map(letter => [letter, letter])),
    letterHints: {
      ru: SPANISH_RU_HINTS,
      latin: SPANISH_LATIN_HINTS,
    },
    letterAudioMap: {},
    speechLang: 'es-ES',
    locale: 'es',
  },
};

export const DEFAULT_COURSE_ID: CourseId = 'ka';
export const COURSE_IDS = Object.keys(COURSES) as CourseId[];

export function normalizeCourseId(value: unknown): CourseId {
  return value === 'sr' || value === 'tr' || value === 'es' ? value : DEFAULT_COURSE_ID;
}

export function getCourse(courseId: unknown): Course {
  return COURSES[normalizeCourseId(courseId)];
}

export function getLetterHint(
  letter: string,
  mode: 'ru' | 'latin',
  courseId: unknown = DEFAULT_COURSE_ID,
): string {
  const course = getCourse(courseId);
  return course.letterHints[mode][letter] ?? '';
}

export function isCourseLetter(character: string, courseId: unknown = DEFAULT_COURSE_ID): boolean {
  return getCourse(courseId).alphabet.includes(character);
}

export function progressKeyForEpisode(courseId: unknown, episodeId: string): string {
  const normalized = normalizeCourseId(courseId);
  return normalized === DEFAULT_COURSE_ID ? episodeId : `${normalized}:${episodeId}`;
}
