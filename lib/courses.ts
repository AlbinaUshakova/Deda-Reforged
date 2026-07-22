import { geLetterAudioMap } from './georgianLetterAudio.ts';

export type CourseId = 'ka' | 'sr' | 'tr' | 'es' | 'de';

export const COURSE_ORDER: CourseId[] = ['ka', 'es', 'de', 'sr', 'tr'];

export type Course = {
  id: CourseId;
  title: string;
  shortTitle: string;
  sourceLanguageLabel: string;
  targetLanguageLabel: string;
  alphabetTitle: string;
  alphabet: string[];
  alphabetRows: string[][];
  alphabetSections: Array<{
    title: string;
    description?: string;
    letters: string[];
    rows: string[][];
  }>;
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

const SERBIAN_CORE_LETTERS = [
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'З', 'И', 'К', 'Л',
  'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х',
];

const SERBIAN_SPECIAL_SOUNDS = [
  'Ђ', 'Ж', 'Ј', 'Љ', 'Њ', 'Ћ', 'Ц', 'Ч', 'Џ', 'Ш',
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
  'Ж': 'zh',
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
  'Ћ': 'ch',
  'У': 'u',
  'Ф': 'f',
  'Х': 'h',
  'Ц': 'ts',
  'Ч': 'ch',
  'Џ': 'dz',
  'Ш': 'sh',
};

const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z',
];

const TURKISH_CORE_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U',
  'V', 'Y', 'Z',
];

const TURKISH_SPECIAL_LETTERS = ['Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü'];

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
  'Ç': 'ch',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  'Ğ': 'gh',
  H: 'h',
  I: 'i',
  'İ': 'i',
  J: 'j',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o',
  'Ö': 'oe',
  P: 'p',
  R: 'r',
  S: 's',
  'Ş': 'sh',
  T: 't',
  U: 'u',
  'Ü': 'ue',
  V: 'v',
  Y: 'y',
  Z: 'z',
};

const SPANISH_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

const SPANISH_CORE_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
];

const SPANISH_SPECIAL_LETTERS = ['Ñ'];

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
  'Ñ': 'ny',
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

const GERMAN_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z', 'Ä', 'Ö', 'Ü', 'ẞ',
];

const GERMAN_CORE_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
];

const GERMAN_SPECIAL_LETTERS = ['Ä', 'Ö', 'Ü', 'ẞ'];

const GERMAN_RU_HINTS: Record<string, string> = {
  A: 'а',
  B: 'б',
  C: 'ц/к',
  D: 'д',
  E: 'э',
  F: 'ф',
  G: 'г',
  H: 'х/долг.',
  I: 'и',
  J: 'й',
  K: 'к',
  L: 'л',
  M: 'м',
  N: 'н',
  O: 'о',
  P: 'п',
  Q: 'кв',
  R: 'р',
  S: 'з/с',
  T: 'т',
  U: 'у',
  V: 'ф/в',
  W: 'в',
  X: 'кс',
  Y: 'ю/и',
  Z: 'ц',
  'Ä': 'э',
  'Ö': 'ё',
  'Ü': 'ю',
  'ẞ': 'сс',
};

const GERMAN_LATIN_HINTS: Record<string, string> = {
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
  'Ä': 'ae',
  'Ö': 'oe',
  'Ü': 'ue',
  'ẞ': 'ss',
};

function rows(alphabet: string[], size: number): string[][] {
  const result: string[][] = [];
  for (let index = 0; index < alphabet.length; index += size) {
    result.push(alphabet.slice(index, index + size));
  }
  return result;
}

function section(title: string, letters: string[], description?: string) {
  return {
    title,
    description,
    letters,
    rows: rows(letters, 6),
  };
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
    alphabetSections: [
      section('Буквы', GEORGIAN_ALPHABET),
    ],
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
    alphabetSections: [
      section('Базовые буквы', SERBIAN_CORE_LETTERS),
      section('Сербские звуки', SERBIAN_SPECIAL_SOUNDS, 'Отдельные буквы для звуков, которых легко не заметить.'),
    ],
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
    alphabetSections: [
      section('Базовые буквы', TURKISH_CORE_LETTERS),
      section('Особые буквы', TURKISH_SPECIAL_LETTERS, 'Точки и хвостики меняют звук.'),
    ],
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
    alphabetSections: [
      section('Буквы', SPANISH_CORE_LETTERS),
      section('Особая буква', SPANISH_SPECIAL_LETTERS, 'Ñ читается как отдельный звук.'),
    ],
    letterNames: Object.fromEntries(SPANISH_ALPHABET.map(letter => [letter, letter])),
    letterHints: {
      ru: SPANISH_RU_HINTS,
      latin: SPANISH_LATIN_HINTS,
    },
    letterAudioMap: {},
    speechLang: 'es-ES',
    locale: 'es',
  },
  de: {
    id: 'de',
    title: 'Немецкий',
    shortTitle: 'Немецкий',
    sourceLanguageLabel: '🇩🇪',
    targetLanguageLabel: '🇷🇺',
    alphabetTitle: 'Alphabet',
    alphabet: GERMAN_ALPHABET,
    alphabetRows: rows(GERMAN_ALPHABET, 6),
    alphabetSections: [
      section('A-Z', GERMAN_CORE_LETTERS),
      section('Умлауты и ß', GERMAN_SPECIAL_LETTERS, 'Это не продолжение ряда A-Z, а отдельные знаки чтения.'),
    ],
    letterNames: Object.fromEntries(GERMAN_ALPHABET.map(letter => [letter, letter])),
    letterHints: {
      ru: GERMAN_RU_HINTS,
      latin: GERMAN_LATIN_HINTS,
    },
    letterAudioMap: {},
    speechLang: 'de-DE',
    locale: 'de',
  },
};

export const DEFAULT_COURSE_ID: CourseId = 'ka';
export const COURSE_IDS = COURSE_ORDER;

export function normalizeCourseId(value: unknown): CourseId {
  return value === 'sr' || value === 'tr' || value === 'es' || value === 'de'
    ? value
    : DEFAULT_COURSE_ID;
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
