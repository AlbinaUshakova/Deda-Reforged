'use client';

import { createPortal } from 'react-dom';
import { PREVIEW_SCALE, type Piece } from '@/lib/blocksGridLogic';
import { PieceSVG } from '@/components/blocks/PieceSVG';

type BlocksPalettePortalProps = {
  container: HTMLElement | null;
  pieces: Piece[];
  dragPieceId?: string;
  cellSize: number;
  placement: 'side' | 'bottom';
  sideStackShift: number;
  onStartDrag: (piece: Piece, event: React.PointerEvent) => void;
};

export function BlocksPalettePortal({
  container,
  pieces,
  dragPieceId,
  cellSize,
  placement,
  sideStackShift,
  onStartDrag,
}: BlocksPalettePortalProps) {
  if (!container) return null;

  return createPortal(
    <div
      className={
        placement === 'bottom'
          ? 'flex w-full flex-row items-center justify-center gap-[clamp(14px,2.2vw,24px)] overflow-hidden py-2'
          : 'flex h-full -translate-y-[18px] flex-col items-center justify-center gap-[clamp(16px,2.8vh,30px)] overflow-visible py-1'
      }
      style={
        placement === 'bottom'
          ? undefined
          : { transform: `translateX(${sideStackShift}px) translateY(-18px)` }
      }
    >
      {pieces.map(piece => {
        const widthCells =
          Math.max(...piece.shape.cells.map(c => c.c)) + 1;
        const heightCells =
          Math.max(...piece.shape.cells.map(c => c.r)) + 1;
        const isDragging = dragPieceId === piece.id;
        const previewCellSize = cellSize * PREVIEW_SCALE;

        return (
          <div
            key={piece.id}
            onPointerDown={e => onStartDrag(piece, e)}
            className="cursor-pointer touch-none"
            style={{
              width: widthCells * previewCellSize,
              height: heightCells * previewCellSize,
              opacity: isDragging ? 0.2 : 1,
            }}
          >
            <PieceSVG piece={piece} cellSize={previewCellSize} />
          </div>
        );
      })}
    </div>,
    container,
  );
}
