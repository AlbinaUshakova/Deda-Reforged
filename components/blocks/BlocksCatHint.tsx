'use client';

import Image from 'next/image';
import { useAppStore } from '@/lib/appStore';

type CatReaction = {
  emoji: string;
  text?: string;
  bounce?: boolean;
} | null;

type BlocksCatHintProps = {
  cellSize: number;
  placement: 'side' | 'bottom';
  moodClass: string;
  showLanguageHint: boolean;
  reaction: CatReaction;
  reactionVisible: boolean;
  onShowLanguageHint: () => void;
};

export function BlocksCatHint({
  cellSize,
  placement,
  moodClass,
  showLanguageHint,
  reaction,
  reactionVisible,
  onShowLanguageHint,
}: BlocksCatHintProps) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  return (
    <button
      type="button"
      onClick={onShowLanguageHint}
      aria-label={interfaceLanguage === 'en' ? 'Translation direction hint' : 'Подсказка по выбору языка'}
      className="absolute left-0 z-[60] select-none"
      style={{
        top: placement === 'bottom' ? -cellSize * 0.92 : -cellSize * 1.16,
        left: placement === 'bottom' ? cellSize * 0.08 : -cellSize * 0.02,
        width: placement === 'bottom' ? cellSize * 1.95 : cellSize * 2.2,
        transform: undefined,
      }}
    >
      {reaction && (
        <div
          className={`pointer-events-none absolute top-1 right-0 px-1.5 py-0.5 text-[15px] transition-opacity duration-300 ${
            reactionVisible ? 'opacity-100' : 'opacity-0'
          } ${reaction.bounce ? 'animate-bounce' : ''}
          `}
        >
          {reaction.emoji}
        </div>
      )}
      {showLanguageHint && (
        <div className="pointer-events-none absolute bottom-[calc(100%-8px)] left-[58%] -translate-x-1/2 w-[250px] z-[80]">
          <div className="relative w-[270px]">
            <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.35)]">
              <path
                d="M70 170 C35 170, 20 145, 30 120 C10 105, 18 72, 50 68 C62 40, 98 30, 122 48 C145 20, 190 20, 212 50 C245 40, 275 58, 280 88 C305 98, 312 128, 292 148 C282 162, 262 170, 240 170 C220 186, 96 186, 70 170 Z"
                fill="rgba(255,255,255,0.85)"
                stroke="#334155"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center px-10 text-[15px] leading-snug text-center font-semibold tracking-tight text-slate-900">
              {interfaceLanguage === 'en' ? (
                <>
                  Translation direction
                  <br />
                  changes in Settings
                </>
              ) : (
                <>
                  Направление перевода
                  <br />
                  меняется в Настройках
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="animate-cat-blink">
        <Image
          src="/images/deda-cat_6.png"
          alt="deda cat"
          width={480}
          height={480}
          draggable={false}
          className={`select-none pointer-events-none ${moodClass}`}
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
    </button>
  );
}
