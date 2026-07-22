import test from 'node:test';
import assert from 'node:assert/strict';

import { getEpisodeByIdCached } from '../lib/clientContentCache.ts';

test('getEpisodeByIdCached can bypass stale in-memory episode cache', async () => {
  const requests: Array<{ url: string; cache?: RequestCache }> = [];
  let version = 0;
  const originalFetch = globalThis.fetch;

  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: async (url: string | URL | Request, init?: RequestInit) => {
      requests.push({
        url: String(url),
        cache: init?.cache,
      });
      version += 1;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          episode: {
            id: 'ep-cache-test',
            title: 'Cache test',
            cards: [
              { type: 'word', ge_text: `реч ${version}`, ru_meaning: 'слово' },
            ],
          },
        }),
      };
    },
  });

  try {
    const first = await getEpisodeByIdCached('ep-cache-test', 'sr');
    const cached = await getEpisodeByIdCached('ep-cache-test', 'sr');
    const refreshed = await getEpisodeByIdCached('ep-cache-test', 'sr', true);

    assert.equal(first?.cards[0]?.ge_text, 'реч 1');
    assert.equal(cached?.cards[0]?.ge_text, 'реч 1');
    assert.equal(refreshed?.cards[0]?.ge_text, 'реч 2');
    assert.equal(requests.length, 2);
    assert.equal(requests[0]?.cache, 'force-cache');
    assert.equal(requests[1]?.cache, 'no-store');
  } finally {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: originalFetch,
    });
  }
});
