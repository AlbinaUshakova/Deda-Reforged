import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGrammarDisplay,
  insertSoftHyphens,
  splitDialogLines,
} from '../components/flashcards/flashcardText.ts';

test('splitDialogLines trims blank dialog lines', () => {
  assert.deepEqual(splitDialogLines(' კითხვა \n\n პასუხი '), [
    'კითხვა',
    'პასუხი',
  ]);
});

test('insertSoftHyphens chunks long single words only', () => {
  assert.equal(insertSoftHyphens('გამარჯობა', 4), 'გამა\u00ADრჯობ\u00ADა');
  assert.equal(insertSoftHyphens('ორი სიტყვა', 4), 'ორი სიტყვა');
});

test('getGrammarDisplay derives readable grammar note labels', () => {
  assert.deepEqual(getGrammarDisplay('вежливо → с незнакомыми людьми'), {
    title: 'Это вежливо',
    summary: 'с незнакомыми людьми',
    detail: '',
  });

  assert.equal(
    getGrammarDisplay('объект ставим вперед: так звучит естественнее.').title,
    'Как строится фраза',
  );
});
