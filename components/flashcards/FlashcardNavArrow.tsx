'use client';

type FlashcardNavArrowProps = {
  direction: 'prev' | 'next';
  placement: 'outside' | 'inside';
  onClick: () => void;
};

export function FlashcardNavArrow({
  direction,
  placement,
  onClick,
}: FlashcardNavArrowProps) {
  const isPrev = direction === 'prev';
  const isOutside = placement === 'outside';
  const title = isPrev ? 'Назад' : 'Вперёд';
  const sideClass = isPrev
    ? isOutside
      ? ''
      : 'left-[-52px] max-[640px]:left-[-44px]'
    : isOutside
      ? ''
      : 'right-[-52px] max-[640px]:right-[-44px]';
  const visibilityClass = isOutside
    ? 'hidden min-[1201px]:inline-flex'
    : 'inline-flex min-[1201px]:hidden';
  const sizeClass = isOutside ? 'h-13 w-13' : 'h-12 w-12';
  const style = isOutside
    ? isPrev
      ? { left: '-54px' }
      : { right: '-54px' }
    : undefined;

  return (
    <button
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      className={`flashcard-nav-arrow ${
        !isPrev ? 'flashcard-next-btn ' : ''
      }flashcard-nav-arrow--${placement} absolute top-1/2 z-20 ${visibilityClass} ${sizeClass} -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-[var(--text-secondary)] shadow-none transition-colors duration-150 ease-out ${sideClass}`}
      style={style}
      title={title}
      aria-label={title}
    >
      <svg
        className={`block mx-auto ${isPrev ? '-scale-x-100' : ''}`}
        width={isOutside ? '24' : '22'}
        height={isOutside ? '24' : '22'}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
