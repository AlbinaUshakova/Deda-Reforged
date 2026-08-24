import { textToHint, type TransliterationMode } from '@/lib/transliteration';
import type { CourseId } from '@/lib/courses';
import type { InterfaceLanguage } from '@/lib/interfaceText';

export type CardWithTranscription = {
  ge_text: string;
  translit?: string;
  transcription_ru?: string;
  transcription_en?: string;
};

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
    return enTranscription || textToHint(card.ge_text, 'latin', courseId);
  }

  if (ruTranscription) {
    return ruTranscription;
  }

  return textToHint(card.ge_text, transliterationMode, courseId);
}

export function resolveCardHint(
  card: CardWithTranscription | null | undefined,
  transliterationMode: TransliterationMode,
  courseId: CourseId,
) {
  if (!card) return '';
  return textToHint(card.ge_text, transliterationMode, courseId);
}
