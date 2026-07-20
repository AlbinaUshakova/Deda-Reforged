import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BOARD_SIZE,
  SHAPES,
  canPlace,
  clearLines,
  createEmptyBoard,
  findNearestValidPos,
  hasAnyMove,
  makeBag,
  placePiece,
  type CellColor,
  type Piece,
} from '../lib/blocksGridLogic.ts';

test('createEmptyBoard creates an empty square board', () => {
  const board = createEmptyBoard();

  assert.equal(board.length, BOARD_SIZE);
  assert.equal(board.every(row => row.length === BOARD_SIZE), true);
  assert.equal(board.flat().every(cell => cell === null), true);
});

test('canPlace and placePiece validate bounds and occupied cells', () => {
  const board = createEmptyBoard();
  const square = SHAPES.find(shape => shape.id === 'square2');
  assert.ok(square);

  assert.equal(canPlace(board, square, 0, 0), true);
  assert.equal(canPlace(board, square, BOARD_SIZE - 1, BOARD_SIZE - 1), false);

  const placed = placePiece(board, square, 0, 0, 'red');
  assert.equal(placed[0][0], 'red');
  assert.equal(placed[1][1], 'red');
  assert.equal(board[0][0], null);
  assert.equal(canPlace(placed, square, 0, 0), false);
});

test('clearLines clears full rows', () => {
  const board = createEmptyBoard();
  board[0] = Array<CellColor>(BOARD_SIZE).fill('red');

  const result = clearLines(board);

  assert.equal(result.cleared, 1);
  assert.equal(result.board[0].every(cell => cell === null), true);
  assert.equal(result.clearedCellsRaw.length, BOARD_SIZE);
});

test('clearLines clears full columns', () => {
  const board = createEmptyBoard();
  for (let r = 0; r < BOARD_SIZE; r += 1) {
    board[r][1] = 'blue';
  }

  const result = clearLines(board);

  assert.equal(result.cleared, 1);
  assert.equal(result.board.every(row => row[1] === null), true);
  assert.equal(result.clearedCellsRaw.length, BOARD_SIZE);
});

test('hasAnyMove detects blocked boards', () => {
  const fullBoard = Array.from({ length: BOARD_SIZE }, () =>
    Array<CellColor>(BOARD_SIZE).fill('red'),
  );
  const single = SHAPES.find(shape => shape.id === 'single1');
  assert.ok(single);

  const pieces: Piece[] = [{ id: 'single', shape: single, color: 'blue' }];
  assert.equal(hasAnyMove(fullBoard, pieces), false);
});

test('findNearestValidPos snaps to a nearby valid cell', () => {
  const board = createEmptyBoard();
  board[0][0] = 'red';
  const single = SHAPES.find(shape => shape.id === 'single1');
  assert.ok(single);

  assert.deepEqual(findNearestValidPos(board, single, 0, 0, 1), {
    row: 0,
    col: 1,
  });
});

test('makeBag returns up to three distinct pieces when moves exist', () => {
  const bag = makeBag(createEmptyBoard());

  assert.equal(bag.length, 3);
  assert.equal(new Set(bag.map(piece => piece.shape.id)).size, bag.length);
  assert.equal(new Set(bag.map(piece => piece.color)).size, bag.length);
});
