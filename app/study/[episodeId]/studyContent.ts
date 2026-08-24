'use client';

import type { CardInfoNote, Episode } from '../../../lib/content.ts';
import { orderLessonCardsByLetterProgression } from '../../../lib/lessonCardOrder.ts';

const RAW_CONTENT_KEY = 'deda_content_json';

export type StudyCard = {
  type: 'word' | 'letter';
  ge_text: string;
  ru_meaning: string;
  accepted_ru?: string[];
  accepted_ge?: string[];
  info_notes?: CardInfoNote[];
  audio_url?: string;
  topic?: string;
  translit?: string;
  transcription_ru?: string;
  transcription_en?: string;
  ipa?: string;
  playable?: boolean;
};

export type StudyEpisode = {
  id: string;
  title: string;
  cards: StudyCard[];
  letters?: string[];
};

export type FlashcardDeckCard = {
  ge_text: string;
  ru_meaning?: string;
  translit?: string;
  transcription_ru?: string;
  transcription_en?: string;
  ipa?: string;
  info_notes?: CardInfoNote[];
  type: 'word' | 'letter';
  topic?: string;
};

type FlashcardDeckCompatibleCard = Extract<StudyCard, { type: 'word' }> | {
  type: 'letter';
  ge_text: string;
  ru_meaning: string;
  info_notes?: CardInfoNote[];
  audio_url?: string;
};

type CachedContentPayload = {
  episodes?: unknown[];
};

type RawStudyCard = {
  type?: unknown;
  ge_text?: unknown;
  ru_meaning?: unknown;
  accepted_ru?: unknown;
  accepted_ge?: unknown;
  info_notes?: unknown;
  audio_url?: unknown;
  topic?: unknown;
  reading?: unknown;
  translit?: unknown;
  transcription_ru?: unknown;
  transcription_en?: unknown;
  ipa?: unknown;
  playable?: unknown;
};

type RawStudyEpisode = {
  id: string;
  title: string;
  cards?: unknown[];
  letters?: string[];
};

function isFlashcardDeckCompatibleCard(
  card: StudyCard,
): card is FlashcardDeckCompatibleCard {
  return card.type === 'word' || card.type === 'letter';
}

function normalizeGeorgianText(text: string): string {
  return /[\u10D0-\u10FF]/.test(text) ? text.replace(/и/g, 'ი').replace(/И/g, 'ი') : text;
}

function normalizeInfoNotes(value: unknown): CardInfoNote[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const notes = value.flatMap(note => {
    if (!note || typeof note !== 'object') return [];
    const raw = note as Record<string, unknown>;
    if (
      (raw.kind !== 'grammar' && raw.kind !== 'speech' && raw.kind !== 'mistake') ||
      typeof raw.text !== 'string'
    ) {
      return [];
    }
    const kind: CardInfoNote['kind'] = raw.kind;
    return [{ kind, text: raw.text }];
  });

  return notes.length ? notes : undefined;
}

function normalizeAcceptedAnswers(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const answers = value
    .map(answer => (typeof answer === 'string' ? answer.trim() : ''))
    .filter(Boolean);

  return answers.length ? answers : undefined;
}

function normalizeStudyCards(cards: unknown[]): StudyCard[] {
  return cards
    .map((card): StudyCard | null => {
      if (!card || typeof card !== 'object') return null;
      const legacyCard = card as RawStudyCard;
      const geText = normalizeGeorgianText(String(legacyCard.ge_text ?? '').trim());
      if (!geText) return null;

      const ruMeaning = String(legacyCard.ru_meaning ?? '').trim();
      const acceptedRu = normalizeAcceptedAnswers(legacyCard.accepted_ru);
      const acceptedGe = normalizeAcceptedAnswers(legacyCard.accepted_ge);
      const infoNotes = normalizeInfoNotes(legacyCard.info_notes);
      const audioUrl =
        typeof legacyCard.audio_url === 'string' ? legacyCard.audio_url : undefined;
      const playable =
        typeof legacyCard.playable === 'boolean' ? legacyCard.playable : undefined;

      if (legacyCard.type === 'letter') {
        return {
          type: 'letter',
          ge_text: geText,
          ru_meaning: ruMeaning,
          ...(acceptedRu ? { accepted_ru: acceptedRu } : {}),
          ...(acceptedGe ? { accepted_ge: acceptedGe } : {}),
          info_notes: infoNotes,
          audio_url: audioUrl,
          ...(playable === false ? { playable: false } : {}),
        };
      }

      return {
        type: 'word',
        ge_text: geText,
        ru_meaning: ruMeaning,
        ...(acceptedRu ? { accepted_ru: acceptedRu } : {}),
        ...(acceptedGe ? { accepted_ge: acceptedGe } : {}),
        info_notes: infoNotes,
        audio_url: audioUrl,
        topic: typeof legacyCard.topic === 'string' ? legacyCard.topic : undefined,
        translit: String(legacyCard.translit ?? legacyCard.reading ?? '').trim() || undefined,
        transcription_ru:
          String(legacyCard.transcription_ru ?? legacyCard.translit ?? legacyCard.reading ?? '').trim() || undefined,
        transcription_en:
          typeof legacyCard.transcription_en === 'string'
            ? legacyCard.transcription_en.trim() || undefined
            : undefined,
        ipa:
          typeof legacyCard.ipa === 'string'
            ? legacyCard.ipa.trim() || undefined
            : undefined,
        ...(playable === false ? { playable: false } : {}),
      };
    })
    .filter((card): card is StudyCard => card !== null);
}

function normalizeStudyEpisode(episode: RawStudyEpisode): StudyEpisode {
  return {
    ...episode,
    cards: normalizeStudyCards(episode.cards ?? []).map(card => ({
      ...card,
      ge_text: normalizeGeorgianText(card.ge_text),
    })),
  };
}

function isRawStudyEpisode(value: unknown): value is RawStudyEpisode {
  if (!value || typeof value !== 'object') return false;
  const episode = value as Record<string, unknown>;
  return (
    typeof episode.id === 'string' &&
    typeof episode.title === 'string' &&
    (episode.cards === undefined || Array.isArray(episode.cards)) &&
    (episode.letters === undefined ||
      (Array.isArray(episode.letters) &&
        episode.letters.every(letter => typeof letter === 'string')))
  );
}

function getCompatibleCardCount(episode: StudyEpisode | null): number {
  if (!episode) return 0;
  return episode.cards.filter(isFlashcardDeckCompatibleCard).length;
}

function isReadingLessonEpisode(episode: StudyEpisode | null): boolean {
  return !!episode && /^ep\d+[a-z]*$/i.test(episode.id) && /^Урок /.test(episode.title);
}

export function resolveStudyEpisode(
  bundled: Episode | null,
  episodeId: string,
): StudyEpisode | null {
  let resolvedEpisode: StudyEpisode | null = bundled
    ? normalizeStudyEpisode(bundled)
    : null;

  if (isReadingLessonEpisode(resolvedEpisode)) {
    return resolvedEpisode;
  }

  if (typeof window === 'undefined') {
    return resolvedEpisode;
  }

  try {
    const raw = window.localStorage.getItem(RAW_CONTENT_KEY);
    if (!raw) return resolvedEpisode;

    const parsed = JSON.parse(raw) as CachedContentPayload;
    const found = parsed.episodes?.find(
      (episode): episode is RawStudyEpisode =>
        isRawStudyEpisode(episode) && episode.id === episodeId,
    );
    if (!found) return resolvedEpisode;

    const cachedEpisode = normalizeStudyEpisode(found);
    const cachedCardCount = getCompatibleCardCount(cachedEpisode);
    if (cachedCardCount === 0) return resolvedEpisode;

    if (
      !resolvedEpisode ||
      cachedCardCount > getCompatibleCardCount(resolvedEpisode)
    ) {
      resolvedEpisode = cachedEpisode;
    }
  } catch {}

  return resolvedEpisode;
}

export function getStudyDeckCards(ep: StudyEpisode | null): FlashcardDeckCard[] {
  return orderLessonCardsByLetterProgression(
    (ep?.cards ?? []).filter(isFlashcardDeckCompatibleCard),
    ep?.letters,
  );
}
