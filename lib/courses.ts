import { geLetterAudioMap } from './georgianLetterAudio.ts';

export type CourseId = 'ka' | 'sr' | 'tr' | 'es' | 'de' | 'en' | 'fr' | 'it';

export const COURSE_ORDER: CourseId[] = ['ka', 'en', 'es', 'de', 'fr', 'it', 'sr', 'tr'];
export const PRIMARY_ACTIVE_COURSE_IDS: CourseId[] = ['ka'];
export const SECONDARY_ACTIVE_COURSE_IDS: CourseId[] = ['sr', 'tr'];
export const HIDDEN_ACTIVE_COURSE_IDS: CourseId[] = ['es', 'de', 'en', 'fr', 'it'];

export type Course = {
  id: CourseId;
  title: string;
  shortTitle: string;
  sourceLanguageLabel: string;
  targetLanguageLabel: string;
  scriptTitleRu: string;
  scriptTitleNative: string;
  alphabetTitle: string;
  alphabet: string[];
  alphabetRows: string[][];
  vowels: string[];
  alphabetSections: Array<{
    title: string;
    description?: string;
    letters: string[];
    rows: string[][];
  }>;
  alphabetLegendNote?: string;
  alphabetHighlightedLetters?: string[];
  letterNames: Record<string, string>;
  letterNameRu?: Record<string, string>;
  letterSoundLabels: Record<string, string>;
  letterSpeechLabels?: Record<string, string>;
  soundHints: {
    ru: Record<string, string>;
    latin: Record<string, string>;
  };
  // Legacy alias for backward compatibility. In this project, 'ru' means soundCyrillic and 'latin' means soundLatin.
  letterHints?: {
    ru: Record<string, string>;
    latin: Record<string, string>;
  };
  letterAudioMap: Record<string, string>;
  speechLang: string;
  locale: string;
};

export type LetterKind = 'vowel' | 'consonant';

const EXTRA_VOWELS_BY_COURSE: Partial<Record<CourseId, string[]>> = {
  de: ['Ä', 'Ö', 'Ü', 'ä', 'ö', 'ü'],
  fr: ['À', 'Â', 'É', 'È', 'Ê', 'Ë', 'Î', 'Ï', 'Ô', 'Œ', 'Ù', 'Û', 'à', 'â', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'œ', 'ù', 'û'],
  es: ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', 'á', 'é', 'í', 'ó', 'ú', 'ü'],
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

const GEORGIAN_LETTER_NAME_RU: Record<string, string> = {
  'ა': 'ани',
  'ბ': 'бани',
  'გ': 'гани',
  'დ': 'дони',
  'ე': 'эни',
  'ვ': 'вини',
  'ზ': 'зэни',
  'თ': 'тхани',
  'ი': 'ини',
  'კ': "к'ани",
  'ლ': 'ласи',
  'მ': 'мани',
  'ნ': 'нари',
  'ო': 'они',
  'პ': "п'ари",
  'ჟ': 'жани',
  'რ': 'раэ',
  'ს': 'сани',
  'ტ': "т'ари",
  'უ': 'уни',
  'ფ': 'пхари',
  'ქ': 'кхани',
  'ღ': "гъани",
  'ყ': "къари",
  'შ': 'шини',
  'ჩ': 'чхини',
  'ც': 'цхани',
  'ძ': 'дзили',
  'წ': "ц'или",
  'ჭ': "ч'ари",
  'ხ': 'хани',
  'ჯ': 'джани',
  'ჰ': 'х',
};

function makeSoundHints(
  ru: Record<string, string>,
  latin: Record<string, string>,
) {
  // In this app, `ru` means the sound spelled in Cyrillic and `latin` means the sound spelled in Latin.
  return { ru, latin };
}

const GEORGIAN_RU_HINTS: Record<string, string> = {
  'ა': 'а', 'ბ': 'б', 'გ': 'г', 'დ': 'д', 'ე': 'э', 'ვ': 'в', 'ზ': 'з', 'თ': 'т',
  'ი': 'и', 'კ': 'къ', 'ლ': 'л', 'მ': 'м', 'ნ': 'н', 'ო': 'о', 'პ': 'пъ', 'ჟ': 'ж',
  'რ': 'р', 'ს': 'с', 'ტ': 'тъ', 'უ': 'у', 'ფ': 'п', 'ქ': 'к', 'ღ': 'гъ', 'ყ': 'къ',
  'შ': 'ш', 'ჩ': 'ч', 'ც': 'ц', 'ძ': 'дз', 'წ': 'цъ', 'ჭ': 'чъ', 'ხ': 'х', 'ჯ': 'дж', 'ჰ': 'х',
};

const GEORGIAN_LATIN_HINTS: Record<string, string> = {
  'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 'თ': 't',
  'ი': 'i', 'კ': "k'", 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': "p'", 'ჟ': 'zh',
  'რ': 'r', 'ს': 's', 'ტ': "t'", 'უ': 'u', 'ფ': 'p', 'ქ': 'k', 'ღ': 'gh', 'ყ': "q'",
  'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': "ts'", 'ჭ': "ch'", 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h',
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
  'Ј': 'y',
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
  'Ћ': 'tj',
  'У': 'u',
  'Ф': 'f',
  'Х': 'h',
  'Ц': 'ts',
  'Ч': 'ch',
  'Џ': 'dzh',
  'Ш': 'sh',
};

const SERBIAN_LETTER_NAMES: Record<string, string> = {
  'А': 'а',
  'Б': 'бе',
  'В': 'ве',
  'Г': 'ге',
  'Д': 'де',
  'Ђ': 'ђе',
  'Е': 'е',
  'Ж': 'же',
  'З': 'зе',
  'И': 'и',
  'Ј': 'је',
  'К': 'ка',
  'Л': 'ел',
  'Љ': 'ељ',
  'М': 'ем',
  'Н': 'ен',
  'Њ': 'ењ',
  'О': 'о',
  'П': 'пе',
  'Р': 'ер',
  'С': 'ес',
  'Т': 'те',
  'Ћ': 'ће',
  'У': 'у',
  'Ф': 'еф',
  'Х': 'ха',
  'Ц': 'це',
  'Ч': 'че',
  'Џ': 'џе',
  'Ш': 'ша',
};

const SERBIAN_LETTER_AUDIO: Record<string, string> = {
  'А': '/audio/letters-sr/01-a.wav',
  'Б': '/audio/letters-sr/02-b.wav',
  'В': '/audio/letters-sr/03-v.wav',
  'Г': '/audio/letters-sr/04-g.wav',
  'Д': '/audio/letters-sr/05-d.wav',
  'Ђ': '/audio/letters-sr/06-dj-soft.wav',
  'Е': '/audio/letters-sr/07-e.wav',
  'Ж': '/audio/letters-sr/08-zh.wav',
  'З': '/audio/letters-sr/09-z.wav',
  'И': '/audio/letters-sr/10-i.wav',
  'Ј': '/audio/letters-sr/11-y.wav',
  'К': '/audio/letters-sr/12-k.wav',
  'Л': '/audio/letters-sr/13-l.wav',
  'Љ': '/audio/letters-sr/14-l-soft.wav',
  'М': '/audio/letters-sr/15-m.wav',
  'Н': '/audio/letters-sr/16-n.wav',
  'Њ': '/audio/letters-sr/17-n-soft.wav',
  'О': '/audio/letters-sr/18-o.wav',
  'П': '/audio/letters-sr/19-p.wav',
  'Р': '/audio/letters-sr/20-r.wav',
  'С': '/audio/letters-sr/21-s.wav',
  'Т': '/audio/letters-sr/22-t.wav',
  'Ћ': '/audio/letters-sr/23-ch-soft.wav',
  'У': '/audio/letters-sr/24-u.wav',
  'Ф': '/audio/letters-sr/25-f.wav',
  'Х': '/audio/letters-sr/26-h.wav',
  'Ц': '/audio/letters-sr/27-ts.wav',
  'Ч': '/audio/letters-sr/28-ch.wav',
  'Џ': '/audio/letters-sr/29-dzh.wav',
  'Ш': '/audio/letters-sr/30-sh.wav',
};

const SERBIAN_LETTER_NAME_RU: Record<string, string> = {
  ...SERBIAN_LETTER_NAMES,
};

const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z',
];

const TURKISH_CORE_LETTERS = TURKISH_ALPHABET;

const TURKISH_RU_HINTS: Record<string, string> = {
  A: 'а',
  B: 'б',
  C: 'дж',
  'Ç': 'ч',
  D: 'д',
  E: 'э',
  F: 'ф',
  G: 'г',
  'Ğ': 'й/—',
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
  C: 'j',
  'Ç': 'ch',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  'Ğ': 'y/—',
  H: 'h',
  I: 'uh',
  'İ': 'i',
  J: 'zh',
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

const TURKISH_LETTER_NAMES: Record<string, string> = {
  A: 'a',
  B: 'be',
  C: 'ce',
  'Ç': 'çe',
  D: 'de',
  E: 'e',
  F: 'fe',
  G: 'ge',
  'Ğ': 'yumuşak ge',
  H: 'he',
  I: 'ı',
  'İ': 'i',
  J: 'je',
  K: 'ke',
  L: 'le',
  M: 'me',
  N: 'ne',
  O: 'o',
  'Ö': 'ö',
  P: 'pe',
  R: 're',
  S: 'se',
  'Ş': 'şe',
  T: 'te',
  U: 'u',
  'Ü': 'ü',
  V: 've',
  Y: 'ye',
  Z: 'ze',
};

const TURKISH_LETTER_NAME_RU: Record<string, string> = {
  A: 'а',
  B: 'бэ',
  C: 'дже',
  'Ç': 'че',
  D: 'дэ',
  E: 'э',
  F: 'эф',
  G: 'ге',
  'Ğ': "йумушак ге",
  H: 'ха',
  I: 'ы',
  'İ': 'и',
  J: 'же',
  K: 'ка',
  L: 'эль',
  M: 'эм',
  N: 'эн',
  O: 'о',
  'Ö': 'ё',
  P: 'пе',
  R: 'эр',
  S: 'эс',
  'Ş': 'ше',
  T: 'тэ',
  U: 'у',
  'Ü': 'ю',
  V: 'вэ',
  Y: 'й',
  Z: 'зэ',
};

const TURKISH_SPEECH_LABELS: Record<string, string> = {
  ...TURKISH_RU_HINTS,
  'Ğ': 'г',
};

const SPANISH_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

const SPANISH_CORE_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
];

const SPANISH_RU_HINTS: Record<string, string> = {
  A: 'а',
  B: 'б',
  C: 'к/с',
  D: 'д',
  E: 'э',
  F: 'ф',
  G: 'г/х',
  H: '—',
  I: 'и',
  J: 'х',
  K: 'к',
  L: 'л',
  M: 'м',
  N: 'н',
  'Ñ': 'нь',
  'Á': 'а',
  'É': 'э',
  'Í': 'и',
  'Ó': 'о',
  'Ú': 'у',
  'Ü': 'у',
  O: 'о',
  P: 'п',
  Q: 'к',
  R: 'р',
  S: 'с',
  T: 'т',
  U: 'у',
  V: 'б',
  W: 'у/гу',
  X: 'кс/х',
  Y: 'й/и',
  Z: 'с',
};

const SPANISH_LATIN_HINTS: Record<string, string> = {
  A: 'a',
  B: 'b',
  C: 'k/s',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g/kh',
  H: '—',
  I: 'i',
  J: 'kh',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  'Ñ': 'ny',
  'Á': 'a',
  'É': 'e',
  'Í': 'i',
  'Ó': 'o',
  'Ú': 'u',
  'Ü': 'u',
  O: 'o',
  P: 'p',
  Q: 'k',
  R: 'r',
  S: 's',
  T: 't',
  U: 'u',
  V: 'b',
  W: 'w/gw',
  X: 'ks/kh',
  Y: 'y/i',
  Z: 's',
};

const SPANISH_LETTER_NAMES: Record<string, string> = {
  A: 'a',
  B: 'be',
  C: 'ce',
  D: 'de',
  E: 'e',
  F: 'efe',
  G: 'ge',
  H: 'hache',
  I: 'i',
  J: 'jota',
  K: 'ka',
  L: 'ele',
  M: 'eme',
  N: 'ene',
  'Ñ': 'eñe',
  'Á': 'a con acento',
  'É': 'e con acento',
  'Í': 'i con acento',
  'Ó': 'o con acento',
  'Ú': 'u con acento',
  'Ü': 'u con diéresis',
  O: 'o',
  P: 'pe',
  Q: 'cu',
  R: 'erre',
  S: 'ese',
  T: 'te',
  U: 'u',
  V: 'uve',
  W: 'uve doble',
  X: 'equis',
  Y: 'ye',
  Z: 'zeta',
};

const SPANISH_SPEECH_LABELS: Record<string, string> = {
  ...SPANISH_RU_HINTS,
  C: 'к',
  G: 'г',
  H: 'не читается',
  V: 'б',
  W: 'у',
  X: 'кс',
  Y: 'й',
};

const SPANISH_LETTER_NAME_RU: Record<string, string> = {
  A: 'а',
  B: 'бэ',
  C: 'сэ',
  D: 'дэ',
  E: 'э',
  F: 'эфэ',
  G: 'хэ',
  H: 'аче',
  I: 'и',
  J: 'хота',
  K: 'ка',
  L: 'эл',
  M: 'эмэ',
  N: 'энэ',
  'Ñ': 'енье',
  'Á': 'а (ударение)',
  'É': 'э (ударение)',
  'Í': 'и (ударение)',
  'Ó': 'о (ударение)',
  'Ú': 'у (ударение)',
  'Ü': 'у (диэрезис)',
  O: 'о',
  P: 'пе',
  Q: 'ку',
  R: 'эрре',
  S: 'эсе',
  T: 'тэ',
  U: 'у',
  V: 'уве',
  W: 'уве добле',
  X: 'экис',
  Y: 'йе',
  Z: 'зета',
};


const ENGLISH_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
];

const ENGLISH_RU_HINTS: Record<string, string> = {
  A: 'э/эй',
  B: 'б',
  C: 'к/с',
  D: 'д',
  E: 'э/и',
  F: 'ф',
  G: 'г/дж',
  H: 'х',
  I: 'и/ай',
  J: 'дж',
  K: 'к',
  L: 'л',
  M: 'м',
  N: 'н',
  O: 'о/оу',
  P: 'п',
  Q: 'кв',
  R: 'р',
  S: 'с/з',
  T: 'т',
  U: 'а/ю',
  V: 'в',
  W: 'у',
  X: 'кс/гз',
  Y: 'й/и',
  Z: 'з',
};

const ENGLISH_RU_LETTER_SOUND_LABELS: Record<string, string> = {
  A: 'эй',
  B: 'би',
  C: 'си',
  D: 'ди',
  E: 'и',
  F: 'эф',
  G: 'джи',
  H: 'эйч',
  I: 'ай',
  J: 'джей',
  K: 'кей',
  L: 'эл',
  M: 'эм',
  N: 'эн',
  O: 'оу',
  P: 'пи',
  Q: 'кью',
  R: 'ар',
  S: 'эс',
  T: 'ти',
  U: 'ю',
  V: 'ви',
  W: 'дабл ю',
  X: 'экс',
  Y: 'уай',
  Z: 'зи',
};

const ENGLISH_LETTER_NAME_RU: Record<string, string> = {
  ...ENGLISH_RU_LETTER_SOUND_LABELS,
};

const ENGLISH_LATIN_HINTS: Record<string, string> = {
  A: 'a/ay',
  B: 'b',
  C: 'k/s',
  D: 'd',
  E: 'e/ee',
  F: 'f',
  G: 'g/j',
  H: 'h',
  I: 'i/ay',
  J: 'j',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o/oh',
  P: 'p',
  Q: 'kw',
  R: 'r',
  S: 's/z',
  T: 't',
  U: 'uh/yoo',
  V: 'v',
  W: 'w',
  X: 'ks/gz',
  Y: 'y/ee',
  Z: 'z',
};

const ENGLISH_LETTER_NAMES: Record<string, string> = {
  A: 'a',
  B: 'bee',
  C: 'cee',
  D: 'dee',
  E: 'e',
  F: 'eff',
  G: 'gee',
  H: 'aitch',
  I: 'i',
  J: 'jay',
  K: 'kay',
  L: 'ell',
  M: 'em',
  N: 'en',
  O: 'o',
  P: 'pee',
  Q: 'cue',
  R: 'ar',
  S: 'ess',
  T: 'tee',
  U: 'u',
  V: 'vee',
  W: 'double u',
  X: 'ex',
  Y: 'wy',
  Z: 'zed',
};

const ENGLISH_SPEECH_LABELS: Record<string, string> = {
  ...ENGLISH_LETTER_NAMES,
};

const GERMAN_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
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
  H: 'х',
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
  V: 'ф',
  W: 'в',
  X: 'кс',
  Y: 'ю/и',
  Z: 'ц',
  'Ä': 'э',
  'Ö': 'ё',
  'Ü': 'ю',
  'ẞ': 'с',
};

const GERMAN_LATIN_HINTS: Record<string, string> = {
  A: 'a',
  B: 'b',
  C: 'ts/k',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  H: 'h',
  I: 'i',
  J: 'y',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o',
  P: 'p',
  Q: 'kv',
  R: 'r',
  S: 'z/s',
  T: 't',
  U: 'u',
  V: 'f',
  W: 'v',
  X: 'ks',
  Y: 'ue/i',
  Z: 'ts',
  'Ä': 'ae',
  'Ö': 'oe',
  'Ü': 'ue',
  'ẞ': 's',
};

const GERMAN_LETTER_NAMES: Record<string, string> = {
  A: 'a',
  B: 'be',
  C: 'ce',
  D: 'de',
  E: 'e',
  F: 'eff',
  G: 'ge',
  H: 'ha',
  I: 'i',
  J: 'jot',
  K: 'ka',
  L: 'ell',
  M: 'emm',
  N: 'enn',
  O: 'o',
  P: 'pe',
  Q: 'ku',
  R: 'err',
  S: 'ess',
  T: 'te',
  U: 'u',
  V: 'fau',
  W: 'we',
  X: 'ix',
  Y: 'ypsilon',
  Z: 'zett',
  'Ä': 'ä',
  'Ö': 'ö',
  'Ü': 'ü',
  'ẞ': 'Eszett',
};

const GERMAN_LETTER_NAME_RU: Record<string, string> = {
  A: 'а',
  B: 'бэ',
  C: 'цэ',
  D: 'дэ',
  E: 'э',
  F: 'эф',
  G: 'гэ',
  H: 'ха',
  I: 'и',
  J: 'йот',
  K: 'ка',
  L: 'эль',
  M: 'эм',
  N: 'эн',
  O: 'о',
  P: 'пэ',
  Q: 'ку',
  R: 'эр',
  S: 'эс',
  T: 'тэ',
  U: 'у',
  V: 'фау',
  W: 'вэ',
  X: 'икс',
  Y: 'ю́псилон',
  Z: 'цэт',
  'Ä': '≈ э',
  'Ö': '≈ ё',
  'Ü': '≈ ю',
  'ẞ': 'эсцэт',
};

const GERMAN_SPEECH_LABELS: Record<string, string> = {
  ...GERMAN_RU_HINTS,
  C: 'ц',
  H: 'х',
  S: 'з',
  V: 'ф',
  Y: 'ю',
  'ẞ': 'сс',
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
function noteSection(title: string, description: string) {
  return {
    title,
    description,
    letters: [],
    rows: [],
  };
}

const FRENCH_CORE_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
];

const FRENCH_SPECIAL_LETTERS = ['À', 'Â', 'Ç', 'É', 'È', 'Ê', 'Ë', 'Î', 'Ï', 'Ô', 'Œ', 'Ù', 'Û'];

const FRENCH_ALPHABET = [...FRENCH_CORE_LETTERS];

const FRENCH_RU_HINTS: Record<string, string> = {
  A: 'а', B: 'б', C: 'к/с', D: 'д', E: 'э/ё/—', F: 'ф', G: 'г/ж', H: '—',
  I: 'и', J: 'ж', K: 'к', L: 'л', M: 'м', N: 'н', O: 'о', P: 'п', Q: 'к',
  R: 'р', S: 'с/з', T: 'т/с', U: 'ю', V: 'в', W: 'в/у', X: 'кс/гз', Y: 'и/й', Z: 'з',
  'À': 'а', 'Â': 'а', 'Ç': 'с', 'É': 'э', 'È': 'э', 'Ê': 'э', 'Ë': 'э',
  'Î': 'и', 'Ï': 'и', 'Ô': 'о', 'Œ': 'ё/э', 'Ù': 'ю', 'Û': 'ю',
};

const FRENCH_LATIN_HINTS: Record<string, string> = {
  A: 'a', B: 'b', C: 'k/s', D: 'd', E: 'e/uh/—', F: 'f', G: 'g/zh', H: '—',
  I: 'i', J: 'zh', K: 'k', L: 'l', M: 'm', N: 'n', O: 'o', P: 'p', Q: 'k',
  R: 'r', S: 's/z', T: 't/s', U: 'u', V: 'v', W: 'v/w', X: 'ks/gz', Y: 'i/y', Z: 'z',
  'À': 'a', 'Â': 'a', 'Ç': 's', 'É': 'e', 'È': 'e', 'Ê': 'e', 'Ë': 'e',
  'Î': 'i', 'Ï': 'i', 'Ô': 'o', 'Œ': 'oe', 'Ù': 'u', 'Û': 'u',
};

const FRENCH_LETTER_NAMES: Record<string, string> = {
  A: 'a', B: 'bé', C: 'cé', D: 'dé', E: 'euh', F: 'ef', G: 'jé', H: 'ash',
  I: 'i', J: 'ji', K: 'ka', L: 'el', M: 'em', N: 'en', O: 'o', P: 'pé', Q: 'ku',
  R: 'er', S: 'es', T: 'té', U: 'ü', V: 'vé', W: 'double vé', X: 'iks', Y: 'i grec', Z: 'zed',
  'À': 'a', 'Â': 'a', 'Ç': 'sé cédille', 'É': 'e', 'È': 'e', 'Ê': 'e', 'Ë': 'e',
  'Î': 'i', 'Ï': 'i', 'Ô': 'o', 'Œ': 'oe', 'Ù': 'ü', 'Û': 'ü',
};

const FRENCH_LETTER_NAME_RU: Record<string, string> = {
  A: 'а', B: 'бэ', C: 'сэ', D: 'дэ', E: 'ё', F: 'эф', G: 'жэ', H: 'аш',
  I: 'и', J: 'жи', K: 'ка', L: 'эль', M: 'эм', N: 'эн', O: 'о', P: 'пэ', Q: 'кю',
  R: 'эр', S: 'эс', T: 'тэ', U: 'ю', V: 'вэ', W: 'дубль-вэ', X: 'икс', Y: 'игрек', Z: 'зэд',
  'À': 'а', 'Â': 'а', 'Ç': 'сэ седий', 'É': 'э', 'È': 'э', 'Ê': 'э', 'Ë': 'э',
  'Î': 'и', 'Ï': 'и', 'Ô': 'о', 'Œ': 'ё', 'Ù': 'ю', 'Û': 'ю',
};

const FRENCH_SPEECH_LABELS: Record<string, string> = {
  ...FRENCH_RU_HINTS,
  C: 'с', E: 'ё', G: 'ж', H: '', R: 'р', S: 'с', Y: 'и',
};

const ITALIAN_CORE_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'Z',
];

const ITALIAN_EXTRA_LETTERS = ['J', 'K', 'W', 'X', 'Y'];

const ITALIAN_ALPHABET = [...ITALIAN_CORE_LETTERS];

const ITALIAN_RU_HINTS: Record<string, string> = {
  A: 'а',
  B: 'б',
  C: 'к/ч',
  D: 'д',
  E: 'э',
  F: 'ф',
  G: 'г/дж',
  H: '—',
  I: 'и',
  L: 'л',
  M: 'м',
  N: 'н',
  O: 'о',
  P: 'п',
  Q: 'кв',
  R: 'р',
  S: 'с/з',
  T: 'т',
  U: 'у',
  V: 'в',
  Z: 'ц/дз',
  J: 'й',
  K: 'к',
  W: 'в',
  X: 'кс',
  Y: 'и',
};

const ITALIAN_LATIN_HINTS: Record<string, string> = {
  A: 'a',
  B: 'b',
  C: 'k/ch',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g/j',
  H: '—',
  I: 'i',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o',
  P: 'p',
  Q: 'kw',
  R: 'r',
  S: 's/z',
  T: 't',
  U: 'u',
  V: 'v',
  Z: 'ts/dz',
  J: 'y',
  K: 'k',
  W: 'w',
  X: 'ks',
  Y: 'i',
};

const ITALIAN_LETTER_NAMES: Record<string, string> = {
  A: 'a',
  B: 'bi',
  C: 'ci',
  D: 'di',
  E: 'e',
  F: 'effe',
  G: 'gi',
  H: 'acca',
  I: 'i',
  L: 'elle',
  M: 'emme',
  N: 'enne',
  O: 'o',
  P: 'pi',
  Q: 'cu',
  R: 'erre',
  S: 'esse',
  T: 'ti',
  U: 'u',
  V: 'vi',
  Z: 'zeta',
  J: 'i lunga',
  K: 'kappa',
  W: 'doppia vu',
  X: 'ics',
  Y: 'ipsilon',
};

const ITALIAN_LETTER_NAME_RU: Record<string, string> = {
  A: 'а',
  B: 'би',
  C: 'чи',
  D: 'ди',
  E: 'э',
  F: 'эффе',
  G: 'джи',
  H: 'акка',
  I: 'и',
  L: 'элле',
  M: 'эмме',
  N: 'энне',
  O: 'о',
  P: 'пи',
  Q: 'ку',
  R: 'эрре',
  S: 'эссе',
  T: 'ти',
  U: 'у',
  V: 'ви',
  Z: 'дзета',
  J: 'и лунга',
  K: 'каппа',
  W: 'доппья ву',
  X: 'икс',
  Y: 'ипсилон',
};

const ITALIAN_SPEECH_LABELS: Record<string, string> = {
  ...ITALIAN_RU_HINTS,
  C: 'к',
  G: 'г',
  H: '',
  Q: 'кв',
  Z: 'ц',
};

export const COURSES: Record<CourseId, Course> = {
  ka: {
    id: 'ka',
    title: 'Грузинский',
    shortTitle: 'Грузинский',
    sourceLanguageLabel: '🇬🇪',
    targetLanguageLabel: '🇷🇺',
    scriptTitleRu: 'Грузинский алфавит',
    scriptTitleNative: 'ქართული ანბანი',
    alphabetTitle: 'Грузинский алфавит — ქართული ანბანი',
    alphabet: GEORGIAN_ALPHABET,
    alphabetRows: rows(GEORGIAN_ALPHABET, 6),
    vowels: ['ა', 'ე', 'ი', 'ო', 'უ'],
    alphabetSections: [
      section('Основные буквы', GEORGIAN_ALPHABET),
    ],
    letterNames: GEORGIAN_LETTER_NAMES,
    letterNameRu: GEORGIAN_RU_HINTS,
    letterSoundLabels: GEORGIAN_RU_HINTS,
    soundHints: makeSoundHints(GEORGIAN_RU_HINTS, GEORGIAN_LATIN_HINTS),
    letterHints: makeSoundHints(GEORGIAN_RU_HINTS, GEORGIAN_LATIN_HINTS),
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
    scriptTitleRu: 'Сербская азбука',
    scriptTitleNative: 'Српска ћирилица',
    alphabetTitle: 'Сербская азбука — Српска ћирилица',
    alphabet: SERBIAN_ALPHABET,
    alphabetRows: rows(SERBIAN_ALPHABET, 6),
    vowels: ['А', 'Е', 'И', 'О', 'У'],
    alphabetHighlightedLetters: ['Ђ', 'Љ', 'Њ', 'Ћ', 'Џ'],
    alphabetSections: [
      section('Основные буквы', SERBIAN_ALPHABET),
    ],
    letterNames: SERBIAN_LETTER_NAMES,
    letterNameRu: SERBIAN_RU_HINTS,
    letterSoundLabels: SERBIAN_RU_HINTS,
    soundHints: makeSoundHints(SERBIAN_RU_HINTS, SERBIAN_LATIN_HINTS),
    letterHints: makeSoundHints(SERBIAN_RU_HINTS, SERBIAN_LATIN_HINTS),
    letterAudioMap: SERBIAN_LETTER_AUDIO,
    speechLang: 'sr-RS',
    locale: 'sr',
  },
  tr: {
    id: 'tr',
    title: 'Турецкий',
    shortTitle: 'Турецкий',
    sourceLanguageLabel: '🇹🇷',
    targetLanguageLabel: '🇷🇺',
    scriptTitleRu: 'Турецкий алфавит',
    scriptTitleNative: 'Türk alfabesi',
    alphabetTitle: 'Турецкий алфавит — Türk alfabesi',
    alphabet: TURKISH_ALPHABET,
    alphabetRows: rows(TURKISH_ALPHABET, 6),
    vowels: ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü'],
    alphabetSections: [
      section('Основные буквы', TURKISH_CORE_LETTERS),
    ],
    letterNames: TURKISH_LETTER_NAMES,
    letterNameRu: TURKISH_RU_HINTS,
    letterSoundLabels: TURKISH_RU_HINTS,
    letterSpeechLabels: TURKISH_SPEECH_LABELS,
    soundHints: makeSoundHints(TURKISH_RU_HINTS, TURKISH_LATIN_HINTS),
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
    scriptTitleRu: 'Испанский алфавит',
    scriptTitleNative: 'El alfabeto español',
    alphabetTitle: 'Испанский алфавит — El alfabeto español',
    alphabet: SPANISH_ALPHABET,
    alphabetRows: rows(SPANISH_ALPHABET, 6),
    vowels: ['A', 'E', 'I', 'O', 'U'],
    alphabetSections: [
      section('Основные буквы', SPANISH_CORE_LETTERS),
    ],
    letterNames: SPANISH_LETTER_NAMES,
    letterNameRu: SPANISH_SPEECH_LABELS,
    letterSoundLabels: SPANISH_RU_HINTS,
    letterSpeechLabels: SPANISH_SPEECH_LABELS,
    soundHints: makeSoundHints(SPANISH_RU_HINTS, SPANISH_LATIN_HINTS),
    letterHints: makeSoundHints(SPANISH_RU_HINTS, SPANISH_LATIN_HINTS),
    letterAudioMap: {},
    speechLang: 'es-ES',
    locale: 'es',
  },
  en: {
    id: 'en',
    title: 'Английский',
    shortTitle: 'Английский',
    sourceLanguageLabel: '🇬🇧',
    targetLanguageLabel: '🇷🇺',
    scriptTitleRu: 'Английский алфавит',
    scriptTitleNative: 'The English alphabet',
    alphabetTitle: 'Английский алфавит — The English alphabet',
    alphabet: ENGLISH_ALPHABET,
    alphabetRows: rows(ENGLISH_ALPHABET, 6),
    vowels: ['A', 'E', 'I', 'O', 'U'],
    alphabetSections: [
      section('Основные буквы', ENGLISH_ALPHABET),
    ],
    letterNames: ENGLISH_LETTER_NAMES,
    letterNameRu: ENGLISH_RU_LETTER_SOUND_LABELS,
    letterSoundLabels: ENGLISH_RU_LETTER_SOUND_LABELS,
    letterSpeechLabels: ENGLISH_RU_LETTER_SOUND_LABELS,
    soundHints: makeSoundHints(ENGLISH_RU_HINTS, ENGLISH_LATIN_HINTS),
    letterHints: makeSoundHints(ENGLISH_RU_HINTS, ENGLISH_LATIN_HINTS),
    letterAudioMap: {},
    speechLang: 'en-US',
    locale: 'en',
  },
  de: {
    id: 'de',
    title: 'Немецкий',
    shortTitle: 'Немецкий',
    sourceLanguageLabel: '🇩🇪',
    targetLanguageLabel: '🇷🇺',
    scriptTitleRu: 'Немецкий алфавит',
    scriptTitleNative: 'Das deutsche Alphabet',
    alphabetTitle: 'Немецкий алфавит — Das deutsche Alphabet',
    alphabet: GERMAN_ALPHABET,
    alphabetRows: rows(GERMAN_ALPHABET, 6),
    vowels: ['A', 'E', 'I', 'O', 'U'],
    alphabetSections: [
      section('Основные буквы', GERMAN_CORE_LETTERS),
      section(
        'Особые буквы немецкого',
        GERMAN_SPECIAL_LETTERS,
        'Ä, Ö и Ü звучат иначе, чем A, O и U. ß называется Eszett и читается как ss.',
      ),
    ],
    letterNames: GERMAN_LETTER_NAMES,
    letterNameRu: GERMAN_SPEECH_LABELS,
    letterSoundLabels: GERMAN_RU_HINTS,
    letterSpeechLabels: GERMAN_SPEECH_LABELS,
    soundHints: makeSoundHints(GERMAN_RU_HINTS, GERMAN_LATIN_HINTS),
    letterHints: makeSoundHints(GERMAN_RU_HINTS, GERMAN_LATIN_HINTS),
    letterAudioMap: {},
    speechLang: 'de-DE',
    locale: 'de',
  },
  fr: {
    id: 'fr',
    title: 'Французский',
    shortTitle: 'Французский',
    sourceLanguageLabel: '🇫🇷',
    targetLanguageLabel: '🇷🇺',
    scriptTitleRu: 'Французский алфавит',
    scriptTitleNative: 'L’alphabet français',
    alphabetTitle: 'Французский алфавит — L’alphabet français',
    alphabet: FRENCH_ALPHABET,
    alphabetRows: rows(FRENCH_ALPHABET, 6),
    vowels: ['A', 'E', 'I', 'O', 'U', 'Y'],
    alphabetSections: [
      section('Основные буквы', FRENCH_CORE_LETTERS),
      section(
        'Буквы с диакритикой',
        FRENCH_SPECIAL_LETTERS,
        'Значки меняют звук: é — «э», è и ê — открытое «э», ç — «с», î/ô/û — те же гласные.',
      ),
    ],
    letterNames: FRENCH_LETTER_NAMES,
    letterNameRu: FRENCH_LETTER_NAME_RU,
    letterSoundLabels: FRENCH_RU_HINTS,
    letterSpeechLabels: FRENCH_SPEECH_LABELS,
    soundHints: makeSoundHints(FRENCH_RU_HINTS, FRENCH_LATIN_HINTS),
    letterHints: makeSoundHints(FRENCH_RU_HINTS, FRENCH_LATIN_HINTS),
    letterAudioMap: {},
    speechLang: 'fr-FR',
    locale: 'fr',
  },
  it: {
    id: 'it',
    title: 'Итальянский',
    shortTitle: 'Итальянский',
    sourceLanguageLabel: '🇮🇹',
    targetLanguageLabel: '🇷🇺',
    scriptTitleRu: 'Итальянский алфавит',
    scriptTitleNative: 'L’alfabeto italiano',
    alphabetTitle: 'Итальянский алфавит — L’alfabeto italiano',
    alphabet: ITALIAN_ALPHABET,
    alphabetRows: rows(ITALIAN_ALPHABET, 6),
    vowels: ['A', 'E', 'I', 'O', 'U'],
    alphabetSections: [
      section('Основные буквы', ITALIAN_CORE_LETTERS),
      section(
        'Дополнительные буквы',
        ITALIAN_EXTRA_LETTERS,
        'J, K, W, X и Y встречаются в заимствованных словах и именах.',
      ),
    ],
    letterNames: ITALIAN_LETTER_NAMES,
    letterNameRu: ITALIAN_LETTER_NAME_RU,
    letterSoundLabels: ITALIAN_RU_HINTS,
    letterSpeechLabels: ITALIAN_SPEECH_LABELS,
    soundHints: makeSoundHints(ITALIAN_RU_HINTS, ITALIAN_LATIN_HINTS),
    letterHints: makeSoundHints(ITALIAN_RU_HINTS, ITALIAN_LATIN_HINTS),
    letterAudioMap: {},
    speechLang: 'it-IT',
    locale: 'it',
  },
};

export const DEFAULT_COURSE_ID: CourseId = 'ka';
export const COURSE_IDS = COURSE_ORDER;

export function normalizeCourseId(value: unknown): CourseId {
  return value === 'sr' || value === 'tr' || value === 'es' || value === 'de' || value === 'en' || value === 'fr' || value === 'it'
    ? value
    : DEFAULT_COURSE_ID;
}

export function getCourse(courseId: unknown): Course {
  return COURSES[normalizeCourseId(courseId)];
}

// Стиль для фонового водяного знака письменности текущего курса
// (буквы алфавита + подходящий шрифт), задаётся как CSS-переменные.
export function scriptWatermarkStyle(courseId: unknown): Record<string, string> {
  const id = normalizeCourseId(courseId);
  const course = COURSES[id];
  return {
    '--script-watermark': `'${course.alphabet.join('')}'`,
    '--script-watermark-font': id === 'ka' ? 'var(--font-georgian)' : 'var(--font-display)',
  };
}

export function getLetterHint(
  letter: string,
  mode: 'ru' | 'latin',
  courseId: unknown = DEFAULT_COURSE_ID,
): string {
  const course = getCourse(courseId);
  return course.soundHints[mode][letter] ?? course.letterHints?.[mode]?.[letter] ?? '';
}

export function getLetterSoundLabel(
  letter: string,
  courseId: unknown = DEFAULT_COURSE_ID,
): string {
  const course = getCourse(courseId);
  return course.letterSoundLabels[letter] ?? course.letterNames[letter] ?? letter;
}

export function getLetterSpeechText(
  letter: string,
  courseId: unknown = DEFAULT_COURSE_ID,
): string {
  const course = getCourse(courseId);
  if (course.id === 'ka' && course.letterAudioMap[letter]) {
    return course.letterNames[letter] ?? letter;
  }
  if (course.letterSpeechLabels?.[letter]) return course.letterSpeechLabels[letter];
  return getLetterSoundLabel(letter, course.id)
    .replace(/\/.*$/g, '')
    .replace(/[.]/g, '')
    .trim();
}

export function getLetterSpeechLang(courseId: unknown = DEFAULT_COURSE_ID): string {
  const course = getCourse(courseId);
  return course.id === 'ka' ? course.speechLang : 'ru-RU';
}

export function getLetterKind(
  letter: string,
  courseId: unknown = DEFAULT_COURSE_ID,
): LetterKind {
  const course = getCourse(courseId);
  return course.vowels.includes(letter) || (EXTRA_VOWELS_BY_COURSE[course.id]?.includes(letter) ?? false)
    ? 'vowel'
    : 'consonant';
}

// Единое универсальное описание буквы для сетки алфавита.
// Интерфейс читает ТОЛЬКО из этой структуры — без привязки к конкретному языку.
// Строчная выводится из локали автоматически; для письменностей без регистра
// (например, грузинской) она совпадает с заглавной и не показывается.
export type AlphabetLetter = {
  uppercase: string;
  lowercase?: string;
  pronunciationCyrillic: string;
  pronunciationLatin: string;
  isVowel: boolean;
  audio?: string;
};

export function getAlphabetLetter(
  letter: string,
  courseId: unknown = DEFAULT_COURSE_ID,
): AlphabetLetter {
  const course = getCourse(courseId);
  const lower = letter.toLocaleLowerCase(course.locale);
  return {
    uppercase: letter,
    lowercase: lower !== letter ? lower : undefined,
    pronunciationCyrillic: course.soundHints.ru[letter] ?? course.letterHints?.ru?.[letter] ?? '',
    pronunciationLatin: course.soundHints.latin[letter] ?? course.letterHints?.latin?.[letter] ?? '',
    isVowel: course.vowels.includes(letter),
    audio: course.letterAudioMap[letter] || undefined,
  };
}

export function isCourseLetter(character: string, courseId: unknown = DEFAULT_COURSE_ID): boolean {
  return getCourse(courseId).alphabet.includes(character);
}

export function progressKeyForEpisode(courseId: unknown, episodeId: string): string {
  const normalized = normalizeCourseId(courseId);
  return normalized === DEFAULT_COURSE_ID ? episodeId : `${normalized}:${episodeId}`;
}
