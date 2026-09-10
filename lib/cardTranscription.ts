import { textToHint, type TransliterationMode } from './transliteration.ts';
import { italianTextToHint } from './italianTranscription.ts';
import type { CourseId } from './courses.ts';
import type { InterfaceLanguage } from './interfaceText.ts';

export type CardWithTranscription = {
  ge_text: string;
  translit?: string;
  transcription_ru?: string;
  transcription_en?: string;
};

function generatedTranscription(
  text: string,
  mode: TransliterationMode,
  courseId: CourseId,
) {
  if (courseId === 'it') return italianTextToHint(text, mode);
  return textToHint(text, mode, courseId);
}

export function resolveCardTranscription(
  card: CardWithTranscription | null | undefined,
  interfaceLanguage: InterfaceLanguage,
  transliterationMode: TransliterationMode,
  courseId: CourseId,
) {
  if (!card) return '';

  // Italian transcription used to be pre-generated character by character in
  // normalizeEpisode (for example `k/chinkwue` for `cinque`). Always rebuild
  // Italian pronunciation contextually so C/CH, G/GH, QU, GN, SC and GLI are
  // interpreted as spelling combinations instead of ambiguous single letters.
  if (courseId === 'it') {
    return generatedTranscription(
      card.ge_text,
      interfaceLanguage === 'en' ? 'latin' : transliterationMode,
      courseId,
    );
  }

  const ruTranscription = card.transcription_ru?.trim() || card.translit?.trim() || '';
  const enTranscription = card.transcription_en?.trim() || '';

  if (interfaceLanguage === 'en') {
    return enTranscription || generatedTranscription(card.ge_text, 'latin', courseId);
  }

  if (ruTranscription) {
    return ruTranscription;
  }

  return generatedTranscription(card.ge_text, transliterationMode, courseId);
}

export function resolveCardHint(
  card: CardWithTranscription | null | undefined,
  transliterationMode: TransliterationMode,
  courseId: CourseId,
) {
  if (!card) return '';
  return generatedTranscription(card.ge_text, transliterationMode, courseId);
}
