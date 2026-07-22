'use client';

import type { AlphabetLetterStatus } from './lessonProgress';
import { DEFAULT_COURSE_ID, normalizeCourseId, type CourseId } from './courses.ts';

export const ALPHABET_STATUS_CACHE_KEY = 'deda:alphabet-letter-status-cache:v1';
const ALPHABET_STATUS_CACHE_KEY_PREFIX = 'deda:alphabet-letter-status-cache:v2';

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
  courseOrStorage: CourseId | StorageLike | null = DEFAULT_COURSE_ID,
  maybeStorage?: StorageLike | null,
): Record<string, AlphabetLetterStatus> {
  const courseId =
    typeof courseOrStorage === 'string' ? normalizeCourseId(courseOrStorage) : DEFAULT_COURSE_ID;
  const storage =
    typeof courseOrStorage === 'string' || courseOrStorage === null
      ? maybeStorage ?? getBrowserStorage()
      : courseOrStorage;
  if (!storage) return {};

  try {
    const raw =
      storage.getItem(`${ALPHABET_STATUS_CACHE_KEY_PREFIX}:${normalizeCourseId(courseId)}`) ??
      (courseId === DEFAULT_COURSE_ID ? storage.getItem(ALPHABET_STATUS_CACHE_KEY) : null);
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
  courseOrStorage: CourseId | StorageLike | null = DEFAULT_COURSE_ID,
  maybeStorage?: StorageLike | null,
) {
  const courseId =
    typeof courseOrStorage === 'string' ? normalizeCourseId(courseOrStorage) : DEFAULT_COURSE_ID;
  const storage =
    typeof courseOrStorage === 'string' || courseOrStorage === null
      ? maybeStorage ?? getBrowserStorage()
      : courseOrStorage;
  if (!storage) return;
  storage.setItem(
    `${ALPHABET_STATUS_CACHE_KEY_PREFIX}:${normalizeCourseId(courseId)}`,
    JSON.stringify(statusByLetter),
  );
  if (courseId === DEFAULT_COURSE_ID) {
    storage.setItem(ALPHABET_STATUS_CACHE_KEY, JSON.stringify(statusByLetter));
  }
}
