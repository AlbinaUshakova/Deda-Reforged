'use client';

export const FAVORITE_WORDS_KEY = 'deda_fav_ge';
export const LEGACY_FAVORITE_WORDS_KEY = 'deda_favorite_words';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function parseStringArray(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  } catch {
    return [];
  }
}

export function favoriteWordsToMap(words: Iterable<string>): Record<string, true> {
  const map: Record<string, true> = {};
  for (const word of words) {
    const normalized = word.trim();
    if (normalized) map[normalized] = true;
  }
  return map;
}

export function readFavoriteWords(storage: StorageLike | null = getBrowserStorage()): Set<string> {
  if (!storage) return new Set();

  const words = new Set<string>();
  for (const word of parseStringArray(storage.getItem(FAVORITE_WORDS_KEY))) {
    words.add(word);
  }

  const legacyWords = parseStringArray(storage.getItem(LEGACY_FAVORITE_WORDS_KEY));
  if (legacyWords.length > 0) {
    for (const word of legacyWords) {
      words.add(word);
    }
    writeFavoriteWords(words, storage);
    storage.removeItem(LEGACY_FAVORITE_WORDS_KEY);
  }

  return words;
}

export function readFavoriteWordMap(storage: StorageLike | null = getBrowserStorage()): Record<string, true> {
  return favoriteWordsToMap(readFavoriteWords(storage));
}

export function writeFavoriteWords(
  words: Iterable<string>,
  storage: StorageLike | null = getBrowserStorage(),
) {
  if (!storage) return;
  storage.setItem(FAVORITE_WORDS_KEY, JSON.stringify(Array.from(new Set(words))));
}

export function toggleFavoriteWord(
  words: Iterable<string>,
  geText: string,
  storage: StorageLike | null = getBrowserStorage(),
): Set<string> {
  const next = new Set(words);
  if (next.has(geText)) {
    next.delete(geText);
  } else {
    next.add(geText);
  }
  writeFavoriteWords(next, storage);
  return next;
}
