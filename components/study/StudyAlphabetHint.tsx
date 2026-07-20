'use client';

import { useAppStore } from '@/lib/appStore';

export function StudyAlphabetHint() {
  const alphabetOpen = useAppStore(state => state.alphabetOpen);
  const requestAlphabetToggle = useAppStore(state => state.requestAlphabetToggle);

  return (
    <aside className="study-alphabet-hint" aria-label="Как послушать буквы">
      <span className="study-alphabet-hint-icon" aria-hidden="true">
        ა
      </span>
      <span className="study-alphabet-hint-copy">
        Слушать буквы: открой «Алфавит» и нажми букву.
      </span>
      <button
        type="button"
        className="study-alphabet-hint-action"
        onClick={() => {
          if (!alphabetOpen) requestAlphabetToggle();
        }}
        aria-pressed={alphabetOpen}
      >
        {alphabetOpen ? 'Открыт' : 'Открыть'}
      </button>
    </aside>
  );
}
