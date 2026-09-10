import type { CourseId } from './courses';

type InterfaceLanguage = 'ru' | 'en';

export type CustomCardExample = {
  entered: string;
  original: string;
  meaning: string;
};

const EXAMPLES: Record<CourseId, Record<InterfaceLanguage, CustomCardExample>> = {
  ka: {
    ru: { entered: 'гамарджоба', original: 'გამარჯობა', meaning: 'Здравствуйте' },
    en: { entered: 'gamarjoba', original: 'გამარჯობა', meaning: 'Hello' },
  },
  ru: {
    ru: { entered: 'здравствуйте', original: 'Здравствуйте', meaning: 'Hello' },
    en: { entered: 'zdravstvuyte', original: 'Здравствуйте', meaning: 'Hello' },
  },
  sr: {
    ru: { entered: 'добар дан', original: 'Добар дан', meaning: 'Здравствуйте' },
    en: { entered: 'dobar dan', original: 'Добар дан', meaning: 'Hello' },
  },
  tr: {
    ru: { entered: 'мерхаба', original: 'Merhaba', meaning: 'Здравствуйте' },
    en: { entered: 'merhaba', original: 'Merhaba', meaning: 'Hello' },
  },
  es: {
    ru: { entered: 'ола', original: 'Hola', meaning: 'Здравствуйте' },
    en: { entered: 'hola', original: 'Hola', meaning: 'Hello' },
  },
  de: {
    ru: { entered: 'гутен таг', original: 'Guten Tag', meaning: 'Здравствуйте' },
    en: { entered: 'guten tag', original: 'Guten Tag', meaning: 'Hello' },
  },
  en: {
    ru: { entered: 'хэлоу', original: 'Hello', meaning: 'Здравствуйте' },
    en: { entered: 'hello', original: 'Hello', meaning: 'Hello' },
  },
  fr: {
    ru: { entered: 'бонжур', original: 'Bonjour', meaning: 'Здравствуйте' },
    en: { entered: 'bonjour', original: 'Bonjour', meaning: 'Hello' },
  },
  it: {
    ru: { entered: 'буонджорно', original: 'Buongiorno', meaning: 'Здравствуйте' },
    en: { entered: 'buongiorno', original: 'Buongiorno', meaning: 'Hello' },
  },
};

export function getCustomCardExample(
  courseId: CourseId,
  language: InterfaceLanguage,
): CustomCardExample {
  return EXAMPLES[courseId][language];
}
