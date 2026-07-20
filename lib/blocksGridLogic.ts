export const BOARD_SIZE = 8;
export const PREVIEW_SCALE = 0.78;
export const BOARD_PIXEL_SIZE = 'min(64dvh, clamp(180px, 100%, 620px))';
export const GRID_GAP_PX = 4;

export type CellColor = string | null;
export type ShapeCell = { r: number; c: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Shape = { id: string; cells: ShapeCell[]; difficulty: Difficulty };
export type Piece = { id: string; shape: Shape; color: string };
export type HoverPos = { row: number; col: number } | null;

export const SHAPES: Shape[] = [
  {
    id: 'line4',
    difficulty: 'easy',
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 0, c: 2 },
      { r: 0, c: 3 },
    ],
  },
  {
    id: 'L3',
    difficulty: 'easy',
    cells: [
      { r: 0, c: 0 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
    ],
  },
  {
    id: 'square3',
    difficulty: 'medium',
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 0, c: 2 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
      { r: 1, c: 2 },
      { r: 2, c: 0 },
      { r: 2, c: 1 },
      { r: 2, c: 2 },
    ],
  },
  {
    id: 'bigL',
    difficulty: 'hard',
    cells: [
      { r: 0, c: 0 },
      { r: 1, c: 0 },
      { r: 2, c: 0 },
      { r: 2, c: 1 },
    ],
  },
  {
    id: 'line3',
    difficulty: 'easy',
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 0, c: 2 },
    ],
  },
  {
    id: 'square2',
    difficulty: 'easy',
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
    ],
  },
  {
    id: 'plus5',
    difficulty: 'medium',
    cells: [
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
      { r: 1, c: 2 },
      { r: 2, c: 1 },
    ],
  },
  {
    id: 'U5',
    difficulty: 'hard',
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 2 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
      { r: 1, c: 2 },
    ],
  },
  {
    id: 'T4',
    difficulty: 'medium',
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 0, c: 2 },
      { r: 1, c: 1 },
    ],
  },
  {
    id: 'zigzag4',
    difficulty: 'medium',
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 1, c: 1 },
      { r: 1, c: 2 },
    ],
  },
  {
    id: 'single1',
    difficulty: 'easy',
    cells: [{ r: 0, c: 0 }],
  },
  {
    id: 'vline4',
    difficulty: 'medium',
    cells: [
      { r: 0, c: 0 },
      { r: 1, c: 0 },
      { r: 2, c: 0 },
      { r: 3, c: 0 },
    ],
  },
  {
    id: 'vline3',
    difficulty: 'easy',
    cells: [
      { r: 0, c: 0 },
      { r: 1, c: 0 },
      { r: 2, c: 0 },
    ],
  },
];

const TYPE_COLORS = [
  'var(--shape-orange)',
  'var(--shape-purple)',
  'var(--shape-blue)',
  'var(--shape-green)',
];

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function randomPaletteColor() {
  return TYPE_COLORS[randomInt(TYPE_COLORS.length)];
}

function pickDistinctBagColors(count: number): string[] {
  const shuffledColors = [...TYPE_COLORS];
  for (let i = shuffledColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
  }
  return shuffledColors.slice(0, count);
}

export function createEmptyBoard(): CellColor[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array<CellColor>(BOARD_SIZE).fill(null),
  );
}

function getBoardFillRatio(board: CellColor[][]): number {
  const total = BOARD_SIZE * BOARD_SIZE;
  let filled = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== null) filled++;
    }
  }

  return filled / total;
}

export function canPlace(
  board: CellColor[][],
  shape: Shape,
  baseRow: number,
  baseCol: number,
): boolean {
  const minRow = Math.min(...shape.cells.map(cell => cell.r));
  const maxRow = Math.max(...shape.cells.map(cell => cell.r));
  const minCol = Math.min(...shape.cells.map(cell => cell.c));
  const maxCol = Math.max(...shape.cells.map(cell => cell.c));

  if (baseRow + minRow < 0 || baseCol + minCol < 0) return false;
  if (baseRow + maxRow >= BOARD_SIZE || baseCol + maxCol >= BOARD_SIZE) return false;

  for (const cell of shape.cells) {
    const r = baseRow + cell.r;
    const c = baseCol + cell.c;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false;
    if (board[r][c] !== null) return false;
  }
  return true;
}

export function placePiece(
  board: CellColor[][],
  shape: Shape,
  baseRow: number,
  baseCol: number,
  color: string,
) {
  if (!canPlace(board, shape, baseRow, baseCol)) {
    return board.map(row => [...row]);
  }

  const next = board.map(row => [...row]);
  for (const cell of shape.cells) {
    const r = baseRow + cell.r;
    const c = baseCol + cell.c;
    next[r][c] = color;
  }
  return next;
}

function shapeHasAnyMove(board: CellColor[][], shape: Shape): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (canPlace(board, shape, r, c)) return true;
    }
  }
  return false;
}

function isLineShape(shape: Shape): boolean {
  const sameRow = shape.cells.every(cell => cell.r === shape.cells[0].r);
  const sameCol = shape.cells.every(cell => cell.c === shape.cells[0].c);
  return sameRow || sameCol;
}

export function makeBag(board: CellColor[][]): Piece[] {
  const fill = getBoardFillRatio(board);
  const availableShapes = SHAPES.filter(shape =>
    shapeHasAnyMove(board, shape),
  );

  if (availableShapes.length === 0) {
    return [];
  }

  let weights: { easy: number; medium: number; hard: number };

  if (fill < 0.25) {
    weights = { easy: 6, medium: 3, hard: 1 };
  } else if (fill < 0.6) {
    weights = { easy: 4, medium: 3, hard: 2 };
  } else {
    weights = { easy: 8, medium: 1, hard: 0 };
  }

  const shapeWeight = (shape: Shape) =>
    shape.difficulty === 'easy'
      ? weights.easy
      : shape.difficulty === 'medium'
        ? weights.medium
        : weights.hard;

  const poolAvailable: Shape[] = [];
  for (const s of availableShapes) {
    const w = Math.max(shapeWeight(s), 1);
    for (let i = 0; i < w; i++) {
      poolAvailable.push(s);
    }
  }

  const guaranteedShape =
    poolAvailable.length > 0
      ? poolAvailable[randomInt(poolAvailable.length)]
      : availableShapes[randomInt(availableShapes.length)];

  const pickedShapes: Shape[] = [guaranteedShape];
  const usedIds = new Set<string>([guaranteedShape.id]);
  let pickedLineShapes = isLineShape(guaranteedShape) ? 1 : 0;

  const poolAll: Shape[] = [];
  for (const s of SHAPES) {
    const w = Math.max(shapeWeight(s), 1);
    for (let i = 0; i < w; i++) {
      poolAll.push(s);
    }
  }

  for (let i = poolAll.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [poolAll[i], poolAll[j]] = [poolAll[j], poolAll[i]];
  }

  for (const s of poolAll) {
    if (pickedShapes.length >= 3) break;
    if (usedIds.has(s.id)) continue;
    if (pickedLineShapes >= 1 && isLineShape(s)) continue;
    pickedShapes.push(s);
    usedIds.add(s.id);
    if (isLineShape(s)) pickedLineShapes += 1;
  }

  if (pickedShapes.length < 3) {
    for (const s of SHAPES) {
      if (pickedShapes.length >= 3) break;
      if (usedIds.has(s.id)) continue;
      if (pickedLineShapes >= 1 && isLineShape(s)) continue;
      pickedShapes.push(s);
      usedIds.add(s.id);
      if (isLineShape(s)) pickedLineShapes += 1;
    }
  }

  const now = Date.now();
  const bagColors = pickDistinctBagColors(pickedShapes.length);

  return pickedShapes.map((shape, idx) => ({
    id: `p_${shape.id}_${now}_${idx}`,
    shape,
    color: bagColors[idx],
  }));
}

export function clearLines(board: CellColor[][]) {
  let cleared = 0;
  let next = board.map(row => [...row]);
  const clearedCellsRaw: { r: number; c: number }[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (next[r].every(c => c !== null)) {
      cleared++;
      for (let c = 0; c < BOARD_SIZE; c++) {
        clearedCellsRaw.push({ r, c });
        next[r][c] = null;
      }
    }
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    let full = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (next[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) {
      cleared++;
      for (let r = 0; r < BOARD_SIZE; r++) {
        clearedCellsRaw.push({ r, c });
        next[r][c] = null;
      }
    }
  }

  return { board: next, cleared, clearedCellsRaw };
}

export function hasAnyMove(board: CellColor[][], pieces: Piece[]): boolean {
  for (const piece of pieces) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (canPlace(board, piece.shape, r, c)) return true;
      }
    }
  }
  return false;
}

export function findNearestValidPos(
  board: CellColor[][],
  shape: Shape,
  baseRow: number,
  baseCol: number,
  radius: number,
): HoverPos {
  if (canPlace(board, shape, baseRow, baseCol)) {
    return { row: baseRow, col: baseCol };
  }

  let best: HoverPos = null;
  let bestDist = Infinity;

  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      const r = baseRow + dr;
      const c = baseCol + dc;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) continue;
      if (!canPlace(board, shape, r, c)) continue;

      const d = Math.abs(dr) + Math.abs(dc);
      if (d < bestDist) {
        bestDist = d;
        best = { row: r, col: c };
      }
    }
  }
  return best;
}
