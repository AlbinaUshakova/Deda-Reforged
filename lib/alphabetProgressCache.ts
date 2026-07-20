'use client';

import type { AlphabetLetterStatus } from './lessonProgress';

export const ALPHABET_STATUS_CACHE_KEY = 'deda:alphabet-letter-status-cache:v1';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function isAlphabetLetterStatus(value: unknown): value is AlphabetLetterStatus {
  return (
    value === 'mastered' ||
    value === 'almost' ||
    value === 'current' ||
    value === 'locked' ||
    value === 'unknown'
  );
}

export function readAlphabetStatusCache(
  storage: StorageLike | null = getBrowserStorage(),
): Record<string, AlphabetLetterStatus> {
  if (!storage) return {};

  try {
    const raw = storage.getItem(ALPHABET_STATUS_CACHE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const result: Record<string, AlphabetLetterStatus> = {};
    for (const [letter, status] of Object.entries(parsed)) {
      if (letter && isAlphabetLetterStatus(status)) {
        result[letter] = status;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export function writeAlphabetStatusCache(
  statusByLetter: Record<string, AlphabetLetterStatus>,
  storage: StorageLike | null = getBrowserStorage(),
) {
  if (!storage) return;
  storage.setItem(ALPHABET_STATUS_CACHE_KEY, JSON.stringify(statusByLetter));
}
