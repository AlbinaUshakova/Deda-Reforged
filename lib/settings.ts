'use client';

type SettingsListener = (settings: Settings) => void;

export type Settings = {
  lessonTargetScore: number;
  translationDirection: 'ge-ru' | 'ru-ge';
  theme: 'light' | 'dark';
  transliterationMode: 'ru' | 'latin';
};

const KEY = 'deda_settings_v1';
export const DEFAULT_SETTINGS: Settings = {
  lessonTargetScore: 25,
  translationDirection: 'ge-ru',
  theme: 'light',
  transliterationMode: 'ru',
};

const settingsListeners = new Set<SettingsListener>();

function normalizeLessonTargetScore(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return DEFAULT_SETTINGS.lessonTargetScore;
  const rounded = Math.round(num);
  return Math.max(10, Math.min(100, rounded));
}

function normalizeTranslationDirection(value: unknown): Settings['translationDirection'] {
  return value === 'ru-ge' ? 'ru-ge' : 'ge-ru';
}

function normalizeTheme(value: unknown): Settings['theme'] {
  return value === 'dark' ? 'dark' : 'light';
}

function normalizeTransliterationMode(value: unknown): Settings['transliterationMode'] {
  return value === 'latin' ? 'latin' : 'ru';
}

export function normalizeSettings(
  raw: Partial<Settings> | Record<string, unknown> | null | undefined,
  legacyDirection?: unknown,
): Settings {
  return {
    lessonTargetScore: normalizeLessonTargetScore(raw?.lessonTargetScore),
    translationDirection: normalizeTranslationDirection(
      raw?.translationDirection ?? legacyDirection,
    ),
    theme: normalizeTheme(raw?.theme),
    transliterationMode: normalizeTransliterationMode(raw?.transliterationMode),
  };
}

export function applyThemeToDocument(theme: Settings['theme']) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', normalizeTheme(theme));
}

export function getSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
    const legacyDirection = localStorage.getItem('deda_translation_direction');
    return normalizeSettings(raw, legacyDirection);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function setSettings(s: Partial<Settings>) {
  if (typeof window === 'undefined') return;
  const current = getSettings();
  const normalized = normalizeSettings({ ...current, ...s });
  localStorage.setItem(KEY, JSON.stringify(normalized));
  localStorage.setItem('deda_translation_direction', normalized.translationDirection);
  applyThemeToDocument(normalized.theme);
  for (const listener of settingsListeners) {
    listener(normalized);
  }
}

export function subscribeToSettings(listener: SettingsListener) {
  settingsListeners.add(listener);
  return () => {
    settingsListeners.delete(listener);
  };
}
