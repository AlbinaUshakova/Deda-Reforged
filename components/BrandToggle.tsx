'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/appStore';
import { getCourse } from '@/lib/courses';

export default function BrandToggle() {
  const alphabetOpen = useAppStore(state => state.alphabetOpen);
  const courseId = useAppStore(state => state.settings.courseId);
  const requestAlphabetToggle = useAppStore(state => state.requestAlphabetToggle);
  const course = getCourse(courseId);
  const alphabetLabel = alphabetOpen ? 'Скрыть алфавит' : 'Открыть алфавит';

  return (
    <div className="header-brand-wrap inline-flex items-center gap-4">
      <Link href="/" className="header-brand-label">
        Deda
      </Link>
      <button
        type="button"
        className={`header-control-btn header-control-btn--alphabet header-control-btn--alphabet-secondary inline-flex items-center justify-center px-2.5 ${
          alphabetOpen ? 'header-control-btn--active' : ''
        }`}
        onClick={requestAlphabetToggle}
        aria-label={alphabetLabel}
        title={alphabetLabel}
      >
        <span className="header-control-glyph" aria-hidden="true">{course.alphabet[0]}</span>
        Алфавит
      </button>
    </div>
  );
}
