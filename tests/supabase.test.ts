import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createDefaultLocalProgress,
  mergeProgressRows,
  normalizeProgressArray,
  normalizeProgressRow,
} from '../lib/supabase.ts';

test('createDefaultLocalProgress builds zeroed progress rows', () => {
  const progress = createDefaultLocalProgress(['ep1', 'ep2']);

  assert.deepEqual(progress, [
    { episodeId: 'ep1', best: 0 },
    { episodeId: 'ep2', best: 0 },
  ]);
});

test('mergeProgressRows keeps highest score per episode and preserves initial map', () => {
  const merged = mergeProgressRows(
    [
      { episode_id: 'ep1', best: 3 },
      { episode_id: 'ep1', best: 9 },
      { episode_id: 'ep2', best: 4 },
    ],
    { ep1: 5, ep3: 7 },
  );

  assert.deepEqual(merged, {
    ep1: 9,
    ep2: 4,
    ep3: 7,
  });
});

test('normalizeProgressRow sanitizes server progress rows', () => {
  assert.deepEqual(normalizeProgressRow({ episode_id: 'ep1', best: '4.9' }), {
    episode_id: 'ep1',
    best: 4,
  });
  assert.deepEqual(normalizeProgressRow({ episode_id: 'ep2', best: -3 }), {
    episode_id: 'ep2',
    best: 0,
  });
  assert.equal(normalizeProgressRow({ episode_id: 12, best: 3 }), null);
  assert.equal(normalizeProgressRow({ episode_id: 'ep1', best: 'nope' }), null);
});

test('normalizeProgressArray filters invalid local progress rows', () => {
  assert.deepEqual(
    normalizeProgressArray([
      { episodeId: 'ep1', best: 2.8 },
      { episodeId: 'ep2', best: '5' },
      { episodeId: '', best: -1 },
      { episodeId: 3, best: 7 },
      null,
    ]),
    [
      { episodeId: 'ep1', best: 2 },
      { episodeId: 'ep2', best: 5 },
    ],
  );
});
