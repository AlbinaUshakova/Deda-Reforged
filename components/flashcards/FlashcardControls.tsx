'use client';

import Image from 'next/image';
import type { RefObject } from 'react';
import { FLASHCARD_AUTO_SPEED_OPTIONS } from '@/lib/studyPreferences';

const playControl =
  'h-[clamp(24px,5.9vw,44px)] w-[clamp(24px,5.9vw,44px)] rounded-full border-0 bg-transparent text-current opacity-100 transition-all duration-200 ease-out hover:scale-[1.05] active:scale-[0.97] flex items-center justify-center text-[clamp(18px,4.8vw,29px)] font-light leading-none';
const shuffleControl =
  'h-[clamp(24px,5.9vw,44px)] w-[clamp(24px,5.9vw,44px)] rounded-full border-0 bg-transparent text-current opacity-100 transition-all duration-200 ease-out hover:scale-[1.05] active:scale-[0.97] flex items-center justify-center text-[clamp(20px,5.1vw,31px)] font-light leading-none';

export function FlashcardControls({
  shuffled,
  auto,
  autoSpeedMs,
  speedMenuOpen,
  speedMenuRef,
  onShuffle,
  onToggleAuto,
  onToggleSpeedMenu,
  onSelectSpeed,
}: {
  shuffled: boolean;
  auto: boolean;
  autoSpeedMs: number;
  speedMenuOpen: boolean;
  speedMenuRef: RefObject<HTMLDivElement>;
  onShuffle: () => void;
  onToggleAuto: () => void;
  onToggleSpeedMenu: () => void;
  onSelectSpeed: (speedMs: number) => void;
}) {
  const currentSpeedLabel =
    FLASHCARD_AUTO_SPEED_OPTIONS.find(option => option.value === autoSpeedMs)?.label ?? '1.5x';

  return (
    <div className="flashcard-controls-wrap relative h-[clamp(31px,7.2vw,56px)] min-w-0">
      <div className="flashcard-cat-inline pointer-events-none absolute z-[20] select-none">
        <Image
          src="/images/deda-cat_2.png"
          alt="Deda cat"
          width={160}
          height={107}
          priority
          className="flashcard-cat drop-shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
          style={{ filter: 'saturate(0.9) brightness(1)' }}
        />
      </div>

      <div className="flashcard-controls-compact absolute left-1/2 top-1/2 inline-flex h-[clamp(31px,7.2vw,56px)] -translate-x-1/2 -translate-y-1/2 items-center gap-[clamp(22px,6vw,40px)]">
        <button
          onClick={onShuffle}
          className={`flashcard-shuffle-btn ${shuffleControl}`}
          title="Перемешать"
          aria-pressed={shuffled}
        >
          <span className="relative inline-flex h-full w-full items-center justify-center">
            <span>⇄</span>
          </span>
        </button>

        <button
          onClick={onToggleAuto}
          className={`flashcard-play-btn ${playControl}`}
          title="Автопрокрутка"
          aria-pressed={auto}
        >
          {auto ? (
            <span className="inline-flex h-[0.54em] items-center gap-[4px]" aria-hidden="true">
              <span className="block h-full w-[4px] rounded-full bg-current" />
              <span className="block h-full w-[4px] rounded-full bg-current" />
            </span>
          ) : (
            <span
              className="flashcard-play-triangle inline-block translate-x-[1px]"
              aria-hidden="true"
            />
          )}
        </button>

        <div className="relative flex items-center justify-center" ref={speedMenuRef}>
          <button
            type="button"
            onClick={onToggleSpeedMenu}
            className="flashcard-speed-btn h-[clamp(24px,5.9vw,44px)] min-w-0 rounded-full border-0 bg-transparent px-[clamp(1px,0.4vw,2px)] text-[clamp(11px,2.5vw,13px)] leading-none font-normal text-current outline-none transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] focus:outline-none"
            aria-label="Скорость автопрокрутки"
            title={`Скорость: ${currentSpeedLabel}`}
            aria-haspopup="menu"
            aria-expanded={speedMenuOpen}
          >
            {currentSpeedLabel}
          </button>
          {speedMenuOpen && (
            <div className="absolute right-0 top-full mt-1 z-30 flex flex-col items-end gap-1 py-0.5">
              {FLASHCARD_AUTO_SPEED_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelectSpeed(option.value)}
                  title={`Установить скорость ${option.label}`}
                  className={`flashcard-speed-option min-w-0 px-1 py-0.5 text-right text-[11px] leading-none transition-all duration-150 active:scale-[0.99] ${
                    autoSpeedMs === option.value
                      ? 'font-medium text-current'
                      : 'text-current'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
