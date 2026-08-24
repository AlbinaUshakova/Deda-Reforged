import { textToHint, type TransliterationMode } from '@/lib/transliteration';
import { italianTextToHint } from '@/lib/italianTranscription';
import type { CourseId } from '@/lib/courses';
import type { InterfaceLanguage } from '@/lib/interfaceText';

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
