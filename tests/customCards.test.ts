import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addCustomCard,
  CUSTOM_CARDS_KEY,
  deleteCustomCard,
  readCustomCards,
  updateCustomCard,
} from '../lib/customCards.ts';

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
}

test('custom cards are stored separately for each course', () => {
  const storage = createStorage();
  addCustomCard('ka', { front: 'გამარჯობა', meaning: 'привет' }, storage, { id: 'ka-1', now: 1 });
  addCustomCard('sr', { front: 'здраво', meaning: 'привет' }, storage, { id: 'sr-1', now: 2 });

  assert.deepEqual(readCustomCards('ka', storage).map(card => card.id), ['ka-1']);
  assert.deepEqual(readCustomCards('sr', storage).map(card => card.id), ['sr-1']);
});

test('custom cards are normalized and newest changes appear first', () => {
  const storage = createStorage();
  addCustomCard('ka', { front: '  ჩემი   სიტყვა ', meaning: ' мое   слово ', association: '  чем и сито ' }, storage, { id: 'one', now: 1 });
  addCustomCard('ka', { front: 'სხვა', meaning: 'другое' }, storage, { id: 'two', now: 2 });

  const cards = readCustomCards('ka', storage);
  assert.equal(cards[0]?.id, 'two');
  assert.deepEqual(cards[1], {
    id: 'one',
    courseId: 'ka',
    front: 'ჩემი სიტყვა',
    meaning: 'мое слово',
    association: 'чем и сито',
    createdAt: 1,
    updatedAt: 1,
  });
});

test('legacy custom card transcription becomes a sound association', () => {
  const storage = createStorage({
    [CUSTOM_CARDS_KEY]: JSON.stringify([
      {
        id: 'legacy',
        courseId: 'tr',
        front: 'merhaba',
        meaning: 'привет',
        transcription: 'мэр, оба',
        createdAt: 1,
        updatedAt: 1,
      },
    ]),
  });

  assert.deepEqual(readCustomCards('tr', storage)[0], {
    id: 'legacy',
    courseId: 'tr',
    front: 'merhaba',
    meaning: 'привет',
    association: 'мэр, оба',
    createdAt: 1,
    updatedAt: 1,
  });
});

test('editing and deletion do not change another course', () => {
  const storage = createStorage();
  addCustomCard('ka', { front: 'ერთი', meaning: 'один' }, storage, { id: 'shared', now: 1 });
  addCustomCard('sr', { front: 'један', meaning: 'один' }, storage, { id: 'shared', now: 1 });

  const updated = updateCustomCard('ka', 'shared', { front: 'ორი', meaning: 'два' }, storage, 3);
  assert.equal(updated?.front, 'ორი');
  assert.equal(readCustomCards('sr', storage)[0]?.front, 'један');

  assert.equal(deleteCustomCard('ka', 'shared', storage), true);
  assert.equal(readCustomCards('ka', storage).length, 0);
  assert.equal(readCustomCards('sr', storage).length, 1);
});

test('invalid storage and empty cards are ignored safely', () => {
  const storage = createStorage({ [CUSTOM_CARDS_KEY]: '{broken' });
  assert.deepEqual(readCustomCards('ka', storage), []);
  assert.equal(addCustomCard('ka', { front: ' ', meaning: 'translation' }, storage), null);
});
