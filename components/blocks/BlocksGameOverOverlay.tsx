'use client';

type BlocksGameOverOverlayProps = {
  onRestart: () => void;
};

export function BlocksGameOverOverlay({ onRestart }: BlocksGameOverOverlayProps) {
  return (
    <div className="absolute inset-0 rounded-3xl flex items-center justify-center pointer-events-none">
      <div className="blocks-grid-gameover-overlay absolute inset-0 rounded-3xl" />
      <div className="blocks-grid-gameover-card pointer-events-auto relative mx-4 w-[min(100%,286px)] rounded-[24px] border border-white/80 bg-white px-5 py-4 text-center shadow-[0_16px_34px_rgba(15,23,42,0.16)]">
        <div className="blocks-grid-gameover-title text-slate-800 text-[19px] font-semibold tracking-[-0.02em]">
          Ходов больше нет
        </div>
        <div className="blocks-grid-gameover-text mt-1.5 text-[14px] leading-[1.3] text-slate-600">
          Фигуры разместить нельзя
        </div>
        <div className="mt-3 flex justify-center">
          <button
            onClick={onRestart}
            className="blocks-grid-gameover-button inline-flex min-h-[42px] min-w-[160px] items-center justify-center rounded-2xl bg-teal-600 px-5 text-[15px] font-semibold text-white shadow-[0_6px_14px_rgba(15,118,110,0.18)] transition-all duration-150 hover:bg-teal-700"
          >
            Сыграть снова
          </button>
        </div>
      </div>
    </div>
  );
}
