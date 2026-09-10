import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_SETTINGS, normalizeSettings } from '../lib/settings.ts';

test('normalizeSettings migrates old score targets and sanitizes values', () => {
  const normalized = normalizeSettings({
    lessonTargetScore: 999,
    translationDirection: 'bad-value',
    transliterationMode: 'latin',
  });

  assert.deepEqual(normalized, {
    courseId: 'ka',
    interfaceLanguage: 'ru',
    lessonTargetScore: 5,
    translationDirection: 'ge-ru',
    transliterationMode: 'latin',
    hasCompletedOnboarding: false,
  });
});

test('normalizeSettings falls back to legacy translation direction', () => {
  const normalized = normalizeSettings({}, 'ru-ge');

  assert.equal(normalized.translationDirection, 'ru-ge');
});

test('normalizeSettings returns defaults for invalid input', () => {
  const normalized = normalizeSettings(null);

  assert.deepEqual(normalized, DEFAULT_SETTINGS);
});

test('Russian course is reserved for the English learning interface', () => {
  assert.equal(normalizeSettings({ courseId: 'ru', interfaceLanguage: 'en' }).courseId, 'ru');
  assert.equal(normalizeSettings({ courseId: 'ru', interfaceLanguage: 'ru' }).courseId, 'ka');
});
