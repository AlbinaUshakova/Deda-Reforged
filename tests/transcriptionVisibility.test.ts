import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getEpisodeOrderValue,
  shouldAutoShowTranscription,
  shouldShowTranscriptionToggle,
} from '../lib/transcriptionVisibility.ts';

test('getEpisodeOrderValue keeps letter-suffixed episodes in lesson order', () => {
  assert.equal(getEpisodeOrderValue('ep2'), 2);
  assert.equal(getEpisodeOrderValue('ep2b'), 2.02);
  assert.equal(getEpisodeOrderValue('ep3'), 3);
});

test('Georgian keeps transcription auto-visible through ep2b only', () => {
  assert.equal(shouldAutoShowTranscription('ep1', 'ka'), true);
  assert.equal(shouldAutoShowTranscription('ep2', 'ka'), true);
  assert.equal(shouldAutoShowTranscription('ep2b', 'ka'), true);
  assert.equal(shouldAutoShowTranscription('ep3', 'ka'), false);
});

test('default fallback keeps early plain numbered lessons only', () => {
  assert.equal(shouldAutoShowTranscription('ep2'), true);
  assert.equal(shouldAutoShowTranscription('ep2b'), false);
});

test('special decks never auto-open transcription', () => {
  assert.equal(shouldAutoShowTranscription('favorites', 'ka'), false);
  assert.equal(shouldAutoShowTranscription('all', 'ka'), false);
  assert.equal(shouldAutoShowTranscription('phrases', 'ka'), false);
  assert.equal(shouldAutoShowTranscription('custom', 'ka'), false);
});

test('toggle stays hidden on stronger lessons until needed', () => {
  assert.equal(shouldShowTranscriptionToggle('ep3', 'ka', false, false), false);
  assert.equal(shouldShowTranscriptionToggle('ep3', 'ka', true, false), true);
  assert.equal(shouldShowTranscriptionToggle('ep3', 'ka', false, true), true);
});

test('extra practice always offers transcription without opening it automatically', () => {
  assert.equal(shouldAutoShowTranscription('ep10a', 'tr'), false);
  assert.equal(shouldShowTranscriptionToggle('ep10a', 'tr', false, false), true);
  assert.equal(shouldShowTranscriptionToggle('ep10m', 'tr', false, false), true);
});
