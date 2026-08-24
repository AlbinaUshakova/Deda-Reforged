'use client';

import { DEFAULT_COURSE_ID, normalizeCourseId, type CourseId } from './courses.ts';

type SettingsListener = (settings: Settings) => void;

export type Settings = {
  courseId: CourseId;
  interfaceLanguage: 'ru' | 'en';
  lessonTargetScore: number;
  translationDirection: 'ge-ru' | 'ru-ge';
  transliterationMode: 'ru' | 'latin';
  hasCompletedOnboarding: boolean;
};

const KEY = 'deda_settings_v1';
export const DEFAULT_SETTINGS: Settings = {
  courseId: DEFAULT_COURSE_ID,
  interfaceLanguage: 'en',
  lessonTargetScore: 25,
  translationDirection: 'ge-ru',
  transliterationMode: 'ru',
  hasCompletedOnboarding: false,
};

const settingsListeners = new Set<SettingsListener>();

function normalizeInterfaceLanguage(value: unknown): Settings['interfaceLanguage'] {
  return value === 'ru' ? 'ru' : 'en';
}

function normalizeLessonTargetScore(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return DEFAULT_SETTINGS.lessonTargetScore;
  const rounded = Math.round(num);
  return Math.max(10, Math.min(100, rounded));
}

function normalizeTranslationDirection(value: unknown): Settings['translationDirection'] {
  return value === 'ru-ge' ? 'ru-ge' : 'ge-ru';
}

function normalizeTransliterationMode(value: unknown): Settings['transliterationMode'] {
  return value === 'latin' ? 'latin' : 'ru';
}

function normalizeOnboardingFlag(
  raw: Partial<Settings> | Record<string, unknown> | null | undefined,
): boolean {
  if (typeof raw?.hasCompletedOnboarding === 'boolean') return raw.hasCompletedOnboarding;
  return raw?.courseId != null || raw?.interfaceLanguage != null;
}

export function normalizeSettings(
  raw: Partial<Settings> | Record<string, unknown> | null | undefined,
  legacyDirection?: unknown,
): Settings {
  if (raw == null) {
    return DEFAULT_SETTINGS;
  }

  const interfaceLanguage = normalizeInterfaceLanguage(raw.interfaceLanguage ?? 'ru');
  const normalizedCourseId = normalizeCourseId(raw.courseId);
  const courseId =
    interfaceLanguage === 'en' && normalizedCourseId === 'en'
      ? DEFAULT_COURSE_ID
      : normalizedCourseId;

  return {
    courseId,
    interfaceLanguage,
    lessonTargetScore: normalizeLessonTargetScore(raw.lessonTargetScore),
    translationDirection: normalizeTranslationDirection(
      raw.translationDirection ?? legacyDirection,
    ),
    transliterationMode: normalizeTransliterationMode(raw.transliterationMode),
    hasCompletedOnboarding: normalizeOnboardingFlag(raw),
  };
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
  const merged = { ...current, ...s };
  const nextSettings =
    merged.courseId === 'en'
      ? {
        ...merged,
        interfaceLanguage: 'ru' as const,
        ...(s.translationDirection === undefined ? { translationDirection: 'ge-ru' as const } : {}),
        ...(s.transliterationMode === undefined ? { transliterationMode: 'ru' as const } : {}),
      }
      : merged;
  const normalized = normalizeSettings(nextSettings);
  localStorage.setItem(KEY, JSON.stringify(normalized));
  localStorage.setItem('deda_translation_direction', normalized.translationDirection);
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

export function getActiveTransliterationMode(
  interfaceLanguage: Settings['interfaceLanguage'],
  courseId?: CourseId,
  storedMode?: Settings['transliterationMode'],
): Settings['transliterationMode'] {
  if (courseId === 'sr') {
    return normalizeTransliterationMode(storedMode);
  }
  return interfaceLanguage === 'en' ? 'latin' : 'ru';
}

export function getActiveTranslationLanguage(interfaceLanguage: Settings['interfaceLanguage']): 'ru' | 'en' {
  return interfaceLanguage === 'en' ? 'en' : 'ru';
}
