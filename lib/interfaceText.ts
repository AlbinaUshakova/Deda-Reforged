import type { CourseId } from '@/lib/courses';
import type { Settings } from '@/lib/settings';

export type InterfaceLanguage = Settings['interfaceLanguage'];

const COURSE_NAMES: Record<CourseId, { ru: string; en: string }> = {
  ka: { ru: 'Грузинский', en: 'Georgian' },
  ru: { ru: 'Русский', en: 'Russian' },
  sr: { ru: 'Сербский', en: 'Serbian' },
  tr: { ru: 'Турецкий', en: 'Turkish' },
  es: { ru: 'Испанский', en: 'Spanish' },
  de: { ru: 'Немецкий', en: 'German' },
  en: { ru: 'Английский', en: 'English' },
  fr: { ru: 'Французский', en: 'French' },
  it: { ru: 'Итальянский', en: 'Italian' },
};

export function getCourseName(courseId: CourseId, interfaceLanguage: InterfaceLanguage) {
  return COURSE_NAMES[courseId][interfaceLanguage];
}

export function getAlphabetInstruction(interfaceLanguage: InterfaceLanguage) {
  return interfaceLanguage === 'en'
    ? 'Tap a letter to hear its name.'
    : 'Нажми на букву и послушай её название.';
}

export function getAlphabetLegend(interfaceLanguage: InterfaceLanguage) {
  return interfaceLanguage === 'en' ? 'Vowels are highlighted' : 'Гласные выделены цветом';
}

export function getAlphabetCloseLabel(interfaceLanguage: InterfaceLanguage) {
  return interfaceLanguage === 'en' ? 'Close alphabet panel' : 'Закрыть панель алфавита';
}

export function getAlphabetAudioLabel(
  interfaceLanguage: InterfaceLanguage,
  letter: string,
  courseId: CourseId,
) {
  if (interfaceLanguage === 'en') {
    return `Play the name of the letter ${letter}`;
  }

  return `Прослушать название буквы ${letter}`;
}

export function getAlphabetTitleLabel(interfaceLanguage: InterfaceLanguage, title: string) {
  return interfaceLanguage === 'en' ? `Alphabet: ${title}` : `Алфавит: ${title}`;
}

export function getAlphabetDisplayTitle(
  courseId: CourseId,
  transliterationMode: 'ru' | 'latin',
) {
  if (courseId === 'ka') {
    return 'ქართული ანბანი';
  }
  if (courseId === 'ru') {
    return 'Русский алфавит';
  }
  if (courseId === 'sr') {
    return transliterationMode === 'latin' ? 'Srpska latinica' : 'Српска ћирилица';
  }
  if (courseId === 'tr') {
    return 'Türk alfabesi';
  }
  if (courseId === 'es') {
    return 'El alfabeto español';
  }
  if (courseId === 'de') {
    return 'Das deutsche Alphabet';
  }
  if (courseId === 'fr') {
    return 'L’alphabet français';
  }
  if (courseId === 'it') {
    return 'L’alfabeto italiano';
  }
  if (courseId === 'en') {
    return 'The English Alphabet';
  }
  return null;
}

export function getHeaderAlphabetButtonTitle(
  courseId: CourseId,
  transliterationMode: 'ru' | 'latin',
) {
  if (courseId === 'ka') {
    return 'ქართული';
  }
  if (courseId === 'ru') {
    return 'Русский';
  }
  if (courseId === 'sr') {
    return transliterationMode === 'latin' ? 'Latinica' : 'Ћирилица';
  }
  if (courseId === 'tr') {
    return 'Türkçe';
  }
  if (courseId === 'es') {
    return 'Español';
  }
  if (courseId === 'de') {
    return 'Deutsch';
  }
  if (courseId === 'fr') {
    return 'Français';
  }
  if (courseId === 'it') {
    return 'Italiano';
  }
  if (courseId === 'en') {
    return 'English';
  }
  return getAlphabetDisplayTitle(courseId, transliterationMode);
}

export function getSectionTitle(
  rawTitle: string,
  interfaceLanguage: InterfaceLanguage,
  courseId: CourseId,
) {
  if (rawTitle === 'Основные буквы') {
    return interfaceLanguage === 'en' ? 'Alphabet' : 'Основные буквы';
  }

  if (courseId === 'de' && rawTitle === 'Особые буквы немецкого') {
    return interfaceLanguage === 'en' ? 'Special characters' : 'Особые знаки';
  }

  if (courseId === 'fr' && rawTitle === 'Буквы с диакритикой') {
    return interfaceLanguage === 'en' ? 'Letters with diacritics and Œ' : 'Буквы со знаками и Œ';
  }

  if (courseId === 'it' && rawTitle === 'Дополнительные буквы') {
    return interfaceLanguage === 'en' ? 'Additional letters' : 'Дополнительные буквы';
  }

  return rawTitle;
}

export function getSectionDescription(
  courseId: CourseId,
  rawTitle: string,
  interfaceLanguage: InterfaceLanguage,
  fallback?: string,
) {
  if (courseId === 'de' && rawTitle === 'Особые буквы немецкого') {
    return interfaceLanguage === 'en'
      ? 'Ä, Ö and Ü represent special vowel sounds. The letter ß represents an “s” sound and is related to the spelling ss. All four characters are introduced in Lesson 6.'
      : 'Ä, Ö и Ü обозначают особые гласные звуки. Знак ß передаёт звук «с» и связан с написанием ss. Все четыре знака изучаются в уроке 6.';
  }

  if (courseId === 'fr' && rawTitle === 'Буквы с диакритикой') {
    return interfaceLanguage === 'en'
      ? 'Diacritics can change pronunciation or distinguish words. Ç sounds like “s”, while Œ combines O and E. Tap a card to hear an example.'
      : 'Знаки меняют произношение или различают слова. Ç читается как «с», а Œ соединяет O и E.';
  }

  if (courseId === 'it' && rawTitle === 'Дополнительные буквы') {
    return interfaceLanguage === 'en'
      ? 'J, K, W, X and Y are used mostly in borrowed words and names.'
      : 'J, K, W, X и Y встречаются в основном в заимствованных словах и именах.';
  }

  return fallback;
}
