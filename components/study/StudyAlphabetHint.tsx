'use client';

import { useAppStore } from '@/lib/appStore';

export function StudyAlphabetHint() {
  const alphabetOpen = useAppStore(state => state.alphabetOpen);

  return (
    <aside className="study-alphabet-hint" aria-label="Как послушать буквы">
      <span className="study-alphabet-hint-icon" aria-hidden="true">
        ა
      </span>
      <span className="study-alphabet-hint-copy">
        {alphabetOpen
          ? 'Нажми любую букву в алфавите, чтобы услышать звук.'
          : 'Нажми «Алфавит» рядом с Deda, затем выбери букву.'}
      </span>
    </aside>
  );
}
