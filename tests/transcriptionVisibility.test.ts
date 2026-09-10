import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getEpisodeOrderValue,
  isPracticalEpisodeId,
  shouldAutoShowTranscription,
  shouldShowTranscriptionToggle,
} from '../lib/transcriptionVisibility.ts';
import { listEpisodes, loadEpisode, loadNewLettersPerEpisode } from '../lib/content.ts';
import { resolveCardTranscription } from '../lib/cardTranscription.ts';
import type { CourseId } from '../lib/courses.ts';

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

test('extra practice always offers transcription without opening it automatically', async () => {
  const courseIds: CourseId[] = ['ka', 'sr', 'tr', 'es', 'de', 'en', 'fr', 'it'];

  for (const courseId of courseIds) {
    const [episodes, lettersByEpisode] = await Promise.all([
      listEpisodes(courseId),
      loadNewLettersPerEpisode(courseId),
    ]);
    const practicalEpisodes = episodes.filter(
      episode => /^ep\d+[a-z]*$/i.test(episode.id) &&
        (lettersByEpisode[episode.id] ?? []).length === 0,
    );

    assert.ok(practicalEpisodes.length > 0, `${courseId} should include extra practice`);

    for (const item of practicalEpisodes) {
      assert.equal(isPracticalEpisodeId(item.id, courseId), true, `${courseId}:${item.id}`);
      assert.equal(shouldAutoShowTranscription(item.id, courseId), false, `${courseId}:${item.id}`);
      assert.equal(
        shouldShowTranscriptionToggle(item.id, courseId, false, false),
        true,
        `${courseId}:${item.id}`,
      );

      const episode = await loadEpisode(item.id, courseId);
      assert.ok(episode, `${courseId}:${item.id} should load`);
      for (const card of episode.cards) {
        assert.ok(
          resolveCardTranscription(card, 'ru', 'ru', courseId).trim(),
          `${courseId}:${item.id}:${card.ge_text} should have Russian transcription`,
        );
        assert.ok(
          resolveCardTranscription(card, 'en', 'latin', courseId).trim(),
          `${courseId}:${item.id}:${card.ge_text} should have Latin transcription`,
        );
      }
    }
  }
});
