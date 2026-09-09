'use client';

import type { CourseId } from '@/lib/courses';

const REVIEW_MEMORY_PREFIX = 'deda_review_memory_v1';
const MAX_DIFFICULTY = 10;
export const REVIEW_MEMORY_UPDATED_EVENT = 'deda:review-memory-updated';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export type ReviewMemoryEntry = {
  difficulty: number;
  lastSeenAt: number;
};

export type ReviewMemory = Record<string, ReviewMemoryEntry>;

function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function storageKey(courseId: CourseId): string {
  return `${REVIEW_MEMORY_PREFIX}:${courseId}`;
}

function normalizeEntry(value: unknown): ReviewMemoryEntry | null {
  if (!value || typeof value !== 'object') return null;
  const entry = value as Partial<ReviewMemoryEntry>;
  if (!Number.isFinite(entry.difficulty) || !Number.isFinite(entry.lastSeenAt)) return null;
  return {
    difficulty: Math.max(0, Math.min(MAX_DIFFICULTY, Math.round(entry.difficulty ?? 0))),
    lastSeenAt: Math.max(0, Math.round(entry.lastSeenAt ?? 0)),
  };
}

export function readReviewMemory(
  courseId: CourseId,
  storage: StorageLike | null = getBrowserStorage(),
): ReviewMemory {
  if (!storage) return {};

  try {
    const parsed = JSON.parse(storage.getItem(storageKey(courseId)) ?? '{}') as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const memory: ReviewMemory = {};
    for (const [word, value] of Object.entries(parsed)) {
      const entry = normalizeEntry(value);
      if (word.trim() && entry && entry.difficulty > 0) memory[word] = entry;
    }
    return memory;
  } catch {
    return {};
  }
}

function updateDifficulty(
  courseId: CourseId,
  word: string,
  delta: number,
  storage: StorageLike | null,
  now: number,
): ReviewMemory {
  if (!storage || !word.trim()) return {};
  const memory = readReviewMemory(courseId, storage);
  const current = memory[word]?.difficulty ?? 0;
  if (current === 0 && delta < 0) return memory;
  const difficulty = Math.max(0, Math.min(MAX_DIFFICULTY, current + delta));

  if (difficulty === 0) {
    delete memory[word];
  } else {
    memory[word] = { difficulty, lastSeenAt: now };
  }
  storage.setItem(storageKey(courseId), JSON.stringify(memory));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(REVIEW_MEMORY_UPDATED_EVENT, {
      detail: { courseId },
    }));
  }
  return memory;
}

export function recordReviewMistake(
  courseId: CourseId,
  word: string,
  storage: StorageLike | null = getBrowserStorage(),
  now = Date.now(),
): ReviewMemory {
  return updateDifficulty(courseId, word, 2, storage, now);
}

export function recordReviewSuccess(
  courseId: CourseId,
  word: string,
  storage: StorageLike | null = getBrowserStorage(),
  now = Date.now(),
): ReviewMemory {
  return updateDifficulty(courseId, word, -1, storage, now);
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function orderReviewCards<T extends { ge_text: string }>(
  cards: T[],
  memory: ReviewMemory,
  seed = new Date().toISOString().slice(0, 10),
): T[] {
  return cards
    .map((card, index) => ({ card, index }))
    .sort((a, b) => {
      const aDifficulty = memory[a.card.ge_text]?.difficulty ?? 0;
      const bDifficulty = memory[b.card.ge_text]?.difficulty ?? 0;
      if (aDifficulty !== bDifficulty) return bDifficulty - aDifficulty;

      const aHash = stableHash(`${seed}:${a.card.ge_text}:${a.index}`);
      const bHash = stableHash(`${seed}:${b.card.ge_text}:${b.index}`);
      return aHash - bHash;
    })
    .map(({ card }) => card);
}
