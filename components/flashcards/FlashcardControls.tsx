'use client';
import type { RefObject } from 'react';
import { FLASHCARD_AUTO_SPEED_OPTIONS } from '@/lib/studyPreferences';

const playControl =
  'flashcard-control-btn flashcard-control-btn--primary';
const shuffleControl =
  'flashcard-control-btn';

function ShuffleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="flashcard-control-icon">
      <path d="M4 7h3.1c2.1 0 3.2 1.1 4.2 3.2l1.4 3c1 2.1 2.1 3.2 4.2 3.2H20" />
      <path d="M17 4l3 3-3 3" />
      <path d="M4 17h3.1c1.5 0 2.5-.6 3.3-1.8" />
      <path d="M15.7 8.8c.6-1.1 1.6-1.8 3.2-1.8H20" />
      <path d="M17 14l3 3-3 3" />
    </svg>
  );
}

function PlayIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="flashcard-pause-icon" aria-hidden="true">
        <span />
        <span />
      </span>
    );
  }

  return <span className="flashcard-play-triangle" aria-hidden="true" />;
}

function SpeedIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="flashcard-control-icon">
      <path d="M5 13a7 7 0 0 1 14 0" />
      <path d="M12 13l4-4" />
      <path d="M4 17h16" />
    </svg>
  );
}

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
  const modeSummary = [
    shuffled ? 'Микс' : null,
    auto ? 'Авто' : null,
    currentSpeedLabel,
  ].filter(Boolean).join(' · ');

  return (
    <div className="flashcard-mode-control relative" ref={speedMenuRef}>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onToggleSpeedMenu();
        }}
        className="flashcard-mode-trigger flashcard-top-muted flashcard-mini-btn"
        aria-label="Режим карточек"
        aria-haspopup="menu"
        aria-expanded={speedMenuOpen}
        title={`Режим: ${modeSummary}`}
      >
        <span className="flashcard-control-glyph">
          <SpeedIcon />
        </span>
        <span className="flashcard-mode-label">Режим</span>
      </button>

      {speedMenuOpen && (
        <div className="flashcard-mode-menu absolute right-0 top-full z-50 mt-2">
          <div className="flashcard-mode-toggles">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onShuffle();
              }}
              className={`flashcard-shuffle-btn ${shuffleControl}`}
              title="Перемешать карточки"
              aria-pressed={shuffled}
              aria-label={shuffled ? 'Перемешивание включено' : 'Перемешать карточки'}
            >
              <span className="flashcard-control-glyph">
                <ShuffleIcon />
              </span>
              <span className="flashcard-control-label">Микс</span>
            </button>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onToggleAuto();
              }}
              className={`flashcard-play-btn ${playControl}`}
              title={auto ? 'Остановить автопрокрутку' : 'Запустить автопрокрутку'}
              aria-pressed={auto}
              aria-label={auto ? 'Автопрокрутка включена' : 'Запустить автопрокрутку'}
            >
              <span className="flashcard-control-glyph">
                <PlayIcon active={auto} />
              </span>
              <span className="flashcard-control-label">Авто</span>
            </button>
          </div>

          <div className="flashcard-mode-speed-list" aria-label="Скорость автопрокрутки">
            {FLASHCARD_AUTO_SPEED_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onSelectSpeed(option.value);
                }}
                title={`Установить скорость ${option.label}`}
                className={`flashcard-speed-option ${
                  autoSpeedMs === option.value
                    ? 'flashcard-speed-option--active'
                    : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
