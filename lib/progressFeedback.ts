import { LESSON_UNLOCK_SCORE } from './lessonProgress.ts';

type InterfaceLanguage = 'ru' | 'en';
type LessonSurface = 'study' | 'play';

export function getLessonProgressSummary({
  score,
  targetScore,
  hasNextLesson,
  interfaceLanguage,
}: {
  score: number;
  targetScore: number;
  hasNextLesson: boolean;
  interfaceLanguage: InterfaceLanguage;
}): string | undefined {
  if (score >= targetScore) {
    return interfaceLanguage === 'en' ? 'Lesson complete' : 'Урок пройден';
  }

  if (score >= LESSON_UNLOCK_SCORE && hasNextLesson) {
    return interfaceLanguage === 'en' ? 'Next lesson open' : 'Следующий урок открыт';
  }

  return undefined;
}

export function getLessonProgressGuidance({
  score,
  targetScore,
  hasNextLesson,
  surface,
  interfaceLanguage,
}: {
  score: number;
  targetScore: number;
  hasNextLesson: boolean;
  surface: LessonSurface;
  interfaceLanguage: InterfaceLanguage;
}): string | undefined {
  if (score >= targetScore) return undefined;

  if (score >= LESSON_UNLOCK_SCORE) {
    if (!hasNextLesson) {
      return interfaceLanguage === 'en'
        ? 'Keep practicing to complete the lesson.'
        : 'Продолжай практику, чтобы завершить урок.';
    }

    if (surface === 'study') {
      return interfaceLanguage === 'en'
        ? 'Keep reviewing or move on.'
        : 'Закрепи материал или переходи дальше.';
    }

    return interfaceLanguage === 'en'
      ? 'Keep practicing or move on.'
      : 'Продолжай практику или переходи дальше.';
  }

  if (surface === 'study') {
    return interfaceLanguage === 'en'
      ? 'Finish the cards, then open practice.'
      : 'Закончи карточки, потом практика.';
  }

  return interfaceLanguage === 'en'
    ? `Reach ${LESSON_UNLOCK_SCORE} points to open the next lesson.`
    : `${LESSON_UNLOCK_SCORE} очков открывают следующий урок.`;
}
