'use client';

import type { CourseId } from './courses.ts';

export const CUSTOM_CARDS_KEY = 'deda_custom_cards_v1';
export const CUSTOM_CARDS_UPDATED_EVENT = 'deda-custom-cards-updated';

export type CustomCard = {
  id: string;
  courseId: CourseId;
  front: string;
  meaning: string;
  association?: string;
  createdAt: number;
  updatedAt: number;
};

export type CustomCardInput = {
  front: string;
  meaning: string;
  association?: string;
};

type StoredCustomCard = CustomCard & { transcription?: string };

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function cleanText(value: string, maxLength: number): string {
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function normalizeInput(input: CustomCardInput): CustomCardInput {
  return {
    front: cleanText(input.front, 120),
    meaning: cleanText(input.meaning, 180),
    association: cleanText(input.association ?? '', 160) || undefined,
  };
}

function isStoredCustomCard(value: unknown): value is StoredCustomCard {
  if (!value || typeof value !== 'object') return false;
  const card = value as Record<string, unknown>;
  return (
    typeof card.id === 'string' &&
    typeof card.courseId === 'string' &&
    typeof card.front === 'string' &&
    card.front.trim().length > 0 &&
    typeof card.meaning === 'string' &&
    card.meaning.trim().length > 0 &&
    (card.association === undefined || typeof card.association === 'string') &&
    (card.transcription === undefined || typeof card.transcription === 'string') &&
    typeof card.createdAt === 'number' &&
    typeof card.updatedAt === 'number'
  );
}

function readAllCustomCards(storage: StorageLike | null): CustomCard[] {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(CUSTOM_CARDS_KEY) ?? '[]') as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredCustomCard).map(card => {
      const { transcription, ...currentCard } = card;
      return {
        ...currentCard,
        association: cleanText(card.association ?? transcription ?? '', 160) || undefined,
      };
    });
  } catch {
    return [];
  }
}

function notifyCustomCardsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CUSTOM_CARDS_UPDATED_EVENT));
  }
}

function createCardId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function readCustomCards(
  courseId: CourseId,
  storage: StorageLike | null = getBrowserStorage(),
): CustomCard[] {
  return readAllCustomCards(storage)
    .filter(card => card.courseId === courseId)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function addCustomCard(
  courseId: CourseId,
  input: CustomCardInput,
  storage: StorageLike | null = getBrowserStorage(),
  options: { id?: string; now?: number } = {},
): CustomCard | null {
  if (!storage) return null;
  const normalized = normalizeInput(input);
  if (!normalized.front || !normalized.meaning) return null;

  const now = options.now ?? Date.now();
  const card: CustomCard = {
    id: options.id ?? createCardId(),
    courseId,
    front: normalized.front,
    meaning: normalized.meaning,
    association: normalized.association,
    createdAt: now,
    updatedAt: now,
  };
  storage.setItem(CUSTOM_CARDS_KEY, JSON.stringify([...readAllCustomCards(storage), card]));
  notifyCustomCardsChanged();
  return card;
}

export function updateCustomCard(
  courseId: CourseId,
  cardId: string,
  input: CustomCardInput,
  storage: StorageLike | null = getBrowserStorage(),
  now = Date.now(),
): CustomCard | null {
  if (!storage) return null;
  const normalized = normalizeInput(input);
  if (!normalized.front || !normalized.meaning) return null;

  let updated: CustomCard | null = null;
  const cards = readAllCustomCards(storage).map(card => {
    if (card.id !== cardId || card.courseId !== courseId) return card;
    updated = { ...card, ...normalized, updatedAt: now };
    return updated;
  });
  if (!updated) return null;
  storage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(cards));
  notifyCustomCardsChanged();
  return updated;
}

export function deleteCustomCard(
  courseId: CourseId,
  cardId: string,
  storage: StorageLike | null = getBrowserStorage(),
): boolean {
  if (!storage) return false;
  const cards = readAllCustomCards(storage);
  const next = cards.filter(card => card.id !== cardId || card.courseId !== courseId);
  if (next.length === cards.length) return false;
  storage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(next));
  notifyCustomCardsChanged();
  return true;
}
