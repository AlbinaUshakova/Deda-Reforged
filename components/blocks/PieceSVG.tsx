'use client';

import type { Piece } from '@/lib/blocksGridLogic';

type PieceSVGProps = {
  piece: Piece;
  cellSize: number;
};

export function PieceSVG({ piece, cellSize }: PieceSVGProps) {
  const widthCells = Math.max(...piece.shape.cells.map(c => c.c)) + 1;
  const heightCells = Math.max(...piece.shape.cells.map(c => c.r)) + 1;

  return (
    <svg width={widthCells * cellSize} height={heightCells * cellSize}>
      {piece.shape.cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.c * cellSize}
          y={cell.r * cellSize}
          width={cellSize}
          height={cellSize}
          rx={cellSize * 0.25}
          ry={cellSize * 0.25}
          fill={piece.color}
        />
      ))}
    </svg>
  );
}
