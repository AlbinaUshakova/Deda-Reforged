import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_SETTINGS, normalizeSettings } from '../lib/settings.ts';

test('normalizeSettings clamps and sanitizes values', () => {
  const normalized = normalizeSettings({
    lessonTargetScore: 999,
    translationDirection: 'bad-value',
    transliterationMode: 'latin',
  });

  assert.deepEqual(normalized, {
    lessonTargetScore: 100,
    translationDirection: 'ge-ru',
    transliterationMode: 'latin',
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
