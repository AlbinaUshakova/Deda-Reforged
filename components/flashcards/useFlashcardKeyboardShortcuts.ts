'use client';

import { useEffect } from 'react';

function isTypingOrButtonTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) return false;

  return (
    element.tagName === 'INPUT' ||
    element.tagName === 'TEXTAREA' ||
    element.tagName === 'SELECT' ||
    element.tagName === 'BUTTON' ||
    element.isContentEditable
  );
}

export function useFlashcardKeyboardShortcuts({
  hasCard,
  currentCardGeText,
  onFlip,
  onNext,
  onPrev,
  onToggleFavorite,
}: {
  hasCard: boolean;
  currentCardGeText?: string;
  onFlip: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFavorite: (geText: string) => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingOrButtonTarget(event.target)) return;

      if (event.code === 'Space') {
        if (!hasCard) return;
        event.preventDefault();
        onFlip();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
        return;
      }

      if (event.key.toLowerCase() === 's' && hasCard && currentCardGeText) {
        onToggleFavorite(currentCardGeText);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentCardGeText, hasCard, onFlip, onNext, onPrev, onToggleFavorite]);
}
