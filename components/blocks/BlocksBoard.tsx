'use client';

import type { Route } from 'next';
import type React from 'react';
import {
  canPlace,
  type CellColor,
  type HoverPos,
  type Piece,
} from '@/lib/blocksGridLogic';
import { BlocksGameOverOverlay } from '@/components/blocks/BlocksGameOverOverlay';

type ClearedCell = {
  r: number;
  c: number;
  color1: string;
  color2: string;
};

type BlocksBoardProps = {
  board: CellColor[][];
  boardRef: React.RefObject<HTMLDivElement>;
  dragPiece: Piece | null;
  hover: HoverPos;
  clearedCells: ClearedCell[];
  gameOver: boolean;
  interfaceLanguage: 'ru' | 'en';
  studyHref?: Route;
  nextLessonHref?: Route;
  hasUnlockedNextLesson?: boolean;
  milestoneOverlay?: React.ReactNode;
  onRestart: () => void;
};

export function BlocksBoard({
  board,
  boardRef,
  dragPiece,
  hover,
  clearedCells,
  gameOver,
  interfaceLanguage,
  studyHref,
  nextLessonHref,
  hasUnlockedNextLesson,
  milestoneOverlay,
  onRestart,
}: BlocksBoardProps) {
  return (
    <div
      ref={boardRef}
      className="blocks-grid-board relative grid grid-cols-8 gap-[4px]"
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        minHeight: 240,
        marginTop: 0,
      }}
    >
      {board.map((row, r) =>
        row.map((color, c) => {
          const showHover =
            hover &&
            dragPiece &&
            canPlace(board, dragPiece.shape, hover.row, hover.col) &&
            dragPiece.shape.cells.some(
              cell =>
                cell.r + hover.row === r &&
                cell.c + hover.col === c,
            );

          const flash = clearedCells.find(
            cell => cell.r === r && cell.c === c,
          );

          return (
            <div
              key={`${r}-${c}`}
              className="blocks-grid-cell relative overflow-hidden rounded-lg bg-[var(--grid-cell)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-[var(--grid-cell-hover)]"
            >
              {color && (
                <div
                  className="blocks-grid-filled-cell w-full h-full"
                  style={{ backgroundColor: color, borderRadius: 8 }}
                />
              )}

              {showHover && (
                <div className="blocks-grid-hover-cell absolute inset-[3px] rounded-md border border-indigo-400/90 pointer-events-none" />
              )}

              {flash && (
                <div
                  className="absolute inset-[2px] rounded-md cell-flash pointer-events-none"
                  style={
                    {
                      '--c1': flash.color1,
                      '--c2': flash.color2,
                    } as React.CSSProperties
                  }
                />
              )}
            </div>
          );
        }),
      )}

      {gameOver && (
        <BlocksGameOverOverlay
          interfaceLanguage={interfaceLanguage}
          studyHref={studyHref}
          nextLessonHref={nextLessonHref}
          hasUnlockedNextLesson={hasUnlockedNextLesson}
          onRestart={onRestart}
        />
      )}
      {!gameOver && milestoneOverlay}
    </div>
  );
}
