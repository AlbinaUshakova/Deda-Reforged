import test from 'node:test';
import assert from 'node:assert/strict';

import { italianTextToHint } from '../lib/italianTranscription.ts';

test('Italian reading hints handle contextual C, G, QU and silent H', () => {
  assert.equal(italianTextToHint('cinque', 'ru'), 'чинквэ');
  assert.equal(italianTextToHint('cinque', 'latin'), 'chinkwe');
  assert.equal(italianTextToHint('ciao', 'ru'), 'чао');
  assert.equal(italianTextToHint('che', 'ru'), 'кэ');
  assert.equal(italianTextToHint('gelato', 'ru'), 'джэлато');
  assert.equal(italianTextToHint('spaghetti', 'ru'), 'спагэтти');
});

test('Italian reading hints handle GN, SC and GLI combinations', () => {
  assert.equal(italianTextToHint('gnocchi', 'ru'), 'ньокки');
  assert.equal(italianTextToHint('scena', 'ru'), 'шэна');
  assert.equal(italianTextToHint('sciarpa', 'ru'), 'шарпа');
  assert.equal(italianTextToHint('famiglia', 'ru'), 'фамилья');
});
