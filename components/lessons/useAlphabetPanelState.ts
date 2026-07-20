'use client';

import { useEffect, useRef, useState } from 'react';

type UseAlphabetPanelStateArgs = {
  alphabetToggleRequest: number;
  profileMenuOpen: boolean;
  setAlphabetOpen: (open: boolean) => void;
  layoutDeps: readonly unknown[];
};

export function useAlphabetPanelState({
  alphabetToggleRequest,
  profileMenuOpen,
  setAlphabetOpen,
  layoutDeps,
}: UseAlphabetPanelStateArgs) {
  const [showAlphabet, setShowAlphabet] = useState(false);
  const [alphabetOverlapsLessons, setAlphabetOverlapsLessons] = useState(false);
  const alphabetRef = useRef<HTMLElement | null>(null);
  const lessonsWrapRef = useRef<HTMLDivElement | null>(null);
  const alphabetUserToggledRef = useRef(false);
  const handledAlphabetToggleRef = useRef(alphabetToggleRequest);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateAlphabetLayoutMode = () => {
      const alphabetRect = alphabetRef.current?.getBoundingClientRect();
      const lessonsRect = lessonsWrapRef.current?.getBoundingClientRect();
      const canFitWithoutOverlap =
        !!alphabetRect &&
        !!lessonsRect &&
        alphabetRect.right + 16 <= lessonsRect.left;
      setAlphabetOverlapsLessons(!canFitWithoutOverlap);
    };

    updateAlphabetLayoutMode();
    window.addEventListener('resize', updateAlphabetLayoutMode);
    return () => window.removeEventListener('resize', updateAlphabetLayoutMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, layoutDeps);

  useEffect(() => {
    if (handledAlphabetToggleRef.current === alphabetToggleRequest) return;
    handledAlphabetToggleRef.current = alphabetToggleRequest;
    alphabetUserToggledRef.current = true;
    setShowAlphabet(v => !v);
  }, [alphabetToggleRequest]);

  useEffect(() => {
    if (profileMenuOpen) {
      setShowAlphabet(false);
    }
  }, [profileMenuOpen]);

  useEffect(() => {
    if (!showAlphabet) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (alphabetRef.current && !alphabetRef.current.contains(e.target as Node)) {
        setShowAlphabet(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAlphabet(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showAlphabet]);

  useEffect(() => {
    setAlphabetOpen(showAlphabet);
  }, [setAlphabetOpen, showAlphabet]);

  const toggleAlphabet = () => {
    alphabetUserToggledRef.current = true;
    setShowAlphabet(v => !v);
  };

  return {
    alphabetRef,
    lessonsWrapRef,
    showAlphabet,
    alphabetOverlapsLessons,
    toggleAlphabet,
  };
}
