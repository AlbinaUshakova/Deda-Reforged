// src/components/BlocksGrid.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BlocksBoard } from '@/components/blocks/BlocksBoard';
import { BlocksCatHint } from '@/components/blocks/BlocksCatHint';
import { BlocksPalettePortal } from '@/components/blocks/BlocksPalettePortal';
import { PieceSVG } from '@/components/blocks/PieceSVG';
import {
  BOARD_PIXEL_SIZE,
  BOARD_SIZE,
  GRID_GAP_PX,
  PREVIEW_SCALE,
  canPlace,
  clearLines,
  createEmptyBoard,
  findNearestValidPos,
  hasAnyMove,
  makeBag,
  placePiece,
  randomPaletteColor,
  type CellColor,
  type HoverPos,
  type Piece,
} from '@/lib/blocksGridLogic';

type DragState = { piece: Piece; pointerX: number; pointerY: number } | null;

type BlocksGridProps = {
  roundId: number;
  onRoundFinished: () => void;
  onRestartRequested: () => void;
  onGameOver: () => void;
  initialBestScore?: number;
  onBestScoreChange?: (best: number) => void;
  topActions?: React.ReactNode;
  leftOfCatAction?: React.ReactNode;
  answerState?: 'idle' | 'wrong' | 'correct';
  paletteSlotId?: string;
  palettePlacement?: 'side' | 'bottom';
};

type ClearedCell = {
  r: number;
  c: number;
  color1: string;
  color2: string;
};

export default function BlocksGrid({
  roundId,
  onRoundFinished,
  onRestartRequested,
  onGameOver,
  initialBestScore = 0,
  onBestScoreChange,
  topActions,
  leftOfCatAction,
  answerState = 'idle',
  paletteSlotId = 'blocks-palette-slot',
  palettePlacement = 'side',
}: BlocksGridProps) {
  const [board, setBoard] = useState<CellColor[][]>(() => createEmptyBoard());
  const [bag, setBag] = useState<Piece[]>([]);
  const [drag, setDrag] = useState<DragState>(null);
  const [hover, setHover] = useState<HoverPos>(null);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(initialBestScore);
  const [gameOver, setGameOver] = useState(false);
  const [scorePop, setScorePop] = useState(false);
  const [showCatLangHint, setShowCatLangHint] = useState(false);
  const [catReaction, setCatReaction] = useState<{
    emoji: string;
    text?: string;
    bounce?: boolean;
  } | null>(null);
  const [catReactionVisible, setCatReactionVisible] = useState(false);

  const [clearedCells, setClearedCells] = useState<ClearedCell[]>([]);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const scorePopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const catHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionFadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reactionClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const prevAnswerStateRef = useRef(answerState);
  const prevGameOverRef = useRef(gameOver);
  const prevScoreRef = useRef(0);
  const [cellSize, setCellSize] = useState(48);

  const [paletteContainer, setPaletteContainer] = useState<HTMLElement | null>(
    null,
  );
  const boardPixelSize =
    palettePlacement === 'bottom'
      ? 'min(54dvh, clamp(160px, 92vw, 480px))'
      : BOARD_PIXEL_SIZE;

  useEffect(() => {
    setBestScore(initialBestScore || 0);
  }, [initialBestScore]);

  useEffect(() => {
    const el = document.getElementById(paletteSlotId);
    setPaletteContainer(el);
  }, [paletteSlotId, roundId]);

  useEffect(() => {
    const measure = () => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      if (!rect.width) return;
      const size = (rect.width - GRID_GAP_PX * (BOARD_SIZE - 1)) / BOARD_SIZE;
      if (Number.isFinite(size) && size > 0) {
        setCellSize(size);
      }
    };

    measure();
    window.addEventListener('resize', measure);

    let ro: ResizeObserver | null = null;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window && boardRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(boardRef.current);
    }

    return () => {
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (scorePopTimeoutRef.current) {
        clearTimeout(scorePopTimeoutRef.current);
      }
      if (catHintTimeoutRef.current) {
        clearTimeout(catHintTimeoutRef.current);
      }
      if (reactionFadeTimeoutRef.current) {
        clearTimeout(reactionFadeTimeoutRef.current);
      }
      if (reactionClearTimeoutRef.current) {
        clearTimeout(reactionClearTimeoutRef.current);
      }
    };
  }, []);

  const triggerCatReaction = (
    emoji: string,
    text?: string,
    durationMs = 1500,
  ) => {
    if (reactionFadeTimeoutRef.current) {
      clearTimeout(reactionFadeTimeoutRef.current);
    }
    if (reactionClearTimeoutRef.current) {
      clearTimeout(reactionClearTimeoutRef.current);
    }

    setCatReaction({ emoji, text, bounce: emoji === '🎉' });
    setCatReactionVisible(true);

    const fadeDelay = Math.max(700, durationMs - 350);
    reactionFadeTimeoutRef.current = setTimeout(() => {
      setCatReactionVisible(false);
      reactionFadeTimeoutRef.current = null;
    }, fadeDelay);

    reactionClearTimeoutRef.current = setTimeout(() => {
      setCatReaction(null);
      reactionClearTimeoutRef.current = null;
    }, durationMs);
  };

  useEffect(() => {
    if (score > prevScoreRef.current) {
      setScorePop(true);
      if (scorePopTimeoutRef.current) {
        clearTimeout(scorePopTimeoutRef.current);
      }
      scorePopTimeoutRef.current = setTimeout(() => {
        setScorePop(false);
      }, 220);
    }
    prevScoreRef.current = score;
  }, [score]);

  useEffect(() => {
    const prev = prevAnswerStateRef.current;
    if (answerState !== prev) {
      if (answerState === 'correct') triggerCatReaction('😄', undefined, 1400);
      if (answerState === 'wrong') triggerCatReaction('🥺', undefined, 1600);
      prevAnswerStateRef.current = answerState;
    }
  }, [answerState]);

  useEffect(() => {
    if (!prevGameOverRef.current && gameOver) {
      triggerCatReaction('🥺', 'Давай ещё раз?', 1800);
    }
    prevGameOverRef.current = gameOver;
  }, [gameOver]);

  // новый раунд: подбираем мешок
  useEffect(() => {
    if (roundId <= 0) return;

    const newBag = makeBag(board);
    setBag(newBag);

    if (newBag.length === 0 || !hasAnyMove(board, newBag)) {
      setTimeout(() => {
        setGameOver(true);
        // onGameOver();
      }, 2000);
    } else {
      setGameOver(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundId]);

  // drag & drop
  useEffect(() => {
    if (!drag) return;

    const onMove = (e: PointerEvent) => {
      setDrag(prev =>
        prev ? { ...prev, pointerX: e.clientX, pointerY: e.clientY } : prev,
      );

      if (!boardRef.current) {
        setHover(null);
        return;
      }

      const piece = drag.piece;
      if (!piece) {
        setHover(null);
        return;
      }

      const rect = boardRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      const maxCol = Math.max(...piece.shape.cells.map(c => c.c)) + 1;
      const maxRow = Math.max(...piece.shape.cells.map(c => c.r)) + 1;

      const baseCol = Math.round(relX / cellSize - maxCol / 2);
      const baseRow = Math.round(relY / cellSize - maxRow / 2);

      const nearest = findNearestValidPos(
        board,
        piece.shape,
        baseRow,
        baseCol,
        2,
      );
      setHover(nearest);
    };

    const onUp = () => {
      setDrag(prev => {
        if (!prev || gameOver) {
          setHover(null);
          return null;
        }
        const piece = prev.piece;
        if (!boardRef.current) {
          setHover(null);
          return null;
        }

        const rect = boardRef.current.getBoundingClientRect();
        const relX = prev.pointerX - rect.left;
        const relY = prev.pointerY - rect.top;
        const maxCol = Math.max(...piece.shape.cells.map(c => c.c)) + 1;
        const maxRow = Math.max(...piece.shape.cells.map(c => c.r)) + 1;
        const baseCol = Math.round(relX / cellSize - maxCol / 2);
        const baseRow = Math.round(relY / cellSize - maxRow / 2);
        const finalPos = findNearestValidPos(board, piece.shape, baseRow, baseCol, 2);

        if (!finalPos) {
          setHover(null);
          return null;
        }

        const { row, col } = finalPos;

        if (canPlace(board, piece.shape, row, col)) {
          const placed = placePiece(board, piece.shape, row, col, piece.color);
          const {
            board: clearedBoard,
            cleared,
            clearedCellsRaw,
          } = clearLines(placed);

          const gainedLines = cleared;
          const newScore = score + gainedLines;

          setBoard(clearedBoard);
          setScore(newScore);
          setBestScore(prevBest => {
            const updated = newScore > prevBest ? newScore : prevBest;
            if (onBestScoreChange) onBestScoreChange(updated);
            return updated;
          });

          if (cleared > 0 && clearedCellsRaw.length) {
            const withColors: ClearedCell[] = clearedCellsRaw.map(cell => ({
              r: cell.r,
              c: cell.c,
              color1: randomPaletteColor(),
              color2: randomPaletteColor(),
            }));
            setClearedCells(withColors);
            setTimeout(() => setClearedCells([]), 1900);
            triggerCatReaction('🎉', undefined, 1400);
          }

          setBag(oldBag => {
            const rest = oldBag.filter(p => p.id !== piece.id);
            setHover(null);

            if (rest.length > 0) {
              if (!hasAnyMove(clearedBoard, rest)) {
                setTimeout(() => {
                  setGameOver(true);
                  // onGameOver();
                }, 2000);
                return rest;
              }
              return rest;
            }

            onRoundFinished();
            return rest;
          });
        } else {
          setHover(null);
        }

        return null;
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [
    drag,
    board,
    hover,
    score,
    cellSize,
    gameOver,
    onRoundFinished,
    onGameOver,
    onBestScoreChange,
  ]);

  const dragPiece = drag?.piece ?? null;

  const startDrag = (piece: Piece, e: React.PointerEvent) => {
    if (!bag.find(p => p.id === piece.id) || gameOver) return;
    e.preventDefault();
    setDrag({ piece, pointerX: e.clientX, pointerY: e.clientY });
  };

  const showLanguageHint = () => {
    setShowCatLangHint(true);
    if (catHintTimeoutRef.current) clearTimeout(catHintTimeoutRef.current);
    catHintTimeoutRef.current = setTimeout(() => setShowCatLangHint(false), 3200);
  };

  const handleRestart = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setBag([]);
    setGameOver(false);
    setDrag(null);
    setHover(null);
    setClearedCells([]);
    onRestartRequested();
  };

  let ghostWidth = 0;
  let ghostHeight = 0;
  if (dragPiece) {
    const maxCol = Math.max(...dragPiece.shape.cells.map(c => c.c)) + 1;
    const maxRow = Math.max(...dragPiece.shape.cells.map(c => c.r)) + 1;
    ghostWidth = maxCol * cellSize;
    ghostHeight = maxRow * cellSize;
  }
  const catMoodClass =
    answerState === 'correct'
      ? 'animate-cat-happy'
      : answerState === 'wrong'
        ? 'animate-cat-sad'
        : '';
  const sidePaletteStackShift = React.useMemo(() => {
    if (palettePlacement !== 'side' || bag.length === 0) return 0;

    const previewCellSize = cellSize * PREVIEW_SCALE;
    const widths = bag.map(piece => Math.max(...piece.shape.cells.map(c => c.c)) + 1);
    const totalCells = widths.reduce((sum, width) => sum + width, 0);
    const anchorCell = Math.ceil(totalCells / 2);
    const anchorCenter = anchorCell - 0.5;
    const safeGap = previewCellSize * 0.7;
    return -(anchorCenter * previewCellSize * 0.42) - safeGap;
  }, [bag, cellSize, palettePlacement]);

  return (
    <div className="flex justify-center w-full py-2">
      <div className="flex w-full max-w-6xl justify-center">
        <div
          className="flex flex-col items-stretch relative"
          style={{ width: boardPixelSize }}
        >
          <div className="blocks-grid-score-row mb-[clamp(4px,0.8vh,8px)] px-1 relative z-[70] flex justify-end">
            <div className="blocks-grid-score mt-0 text-center text-[clamp(11px,1.2vw,13px)] font-medium tracking-[-0.01em] text-slate-700 opacity-72">
              <span>Счёт {score}</span>
              <span aria-hidden="true">•</span>
              <span>Рекорд {bestScore}</span>
            </div>
          </div>

          {topActions && (
            <div className="absolute right-0 -top-[5.5rem] md:-top-24 z-[95] flex items-center gap-2">
              {topActions}
            </div>
          )}
          {leftOfCatAction && (
            <div className="absolute left-0 -top-[2.35rem] md:-top-[2.75rem] z-[96] translate-x-[245%] origin-top-left scale-150">
              {leftOfCatAction}
            </div>
          )}
          <BlocksBoard
            board={board}
            boardRef={boardRef}
            dragPiece={dragPiece}
            hover={hover}
            clearedCells={clearedCells}
            gameOver={gameOver}
            onRestart={handleRestart}
          />

          <BlocksCatHint
            cellSize={cellSize}
            placement={palettePlacement}
            moodClass={catMoodClass}
            showLanguageHint={showCatLangHint}
            reaction={catReaction}
            reactionVisible={catReactionVisible}
            onShowLanguageHint={showLanguageHint}
          />
        </div>
      </div>

      {/* призрак фигуры */}
      {drag && dragPiece && (
        <div
          className="pointer-events-none fixed z-[1000]"
          style={{
            left: drag.pointerX - ghostWidth / 2,
            top: drag.pointerY - ghostHeight / 2,
          }}
        >
          <PieceSVG piece={dragPiece} cellSize={cellSize} />
        </div>
      )}

      <BlocksPalettePortal
        container={paletteContainer}
        pieces={bag}
        dragPieceId={dragPiece?.id}
        cellSize={cellSize}
        placement={palettePlacement}
        sideStackShift={sidePaletteStackShift}
        onStartDrag={startDrag}
      />

      <style jsx>{`
        @keyframes flashTwice {
          0% {
            opacity: 0;
            transform: scale(1);
            background: var(--c1);
          }
          10% {
            opacity: 1;
            transform: scale(1.05);
          }
          25% {
            opacity: 0;
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
            background: var(--c2);
          }
          75% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }

        .cell-flash {
          animation: flashTwice 1.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
