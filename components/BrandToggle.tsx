'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/appStore';
import { getCourse } from '@/lib/courses';

export default function BrandToggle() {
  const alphabetOpen = useAppStore(state => state.alphabetOpen);
  const courseId = useAppStore(state => state.settings.courseId);
  const requestAlphabetToggle = useAppStore(state => state.requestAlphabetToggle);
  const course = getCourse(courseId);
  const alphabetButtonText = course.scriptTitleNative;
  const title = `${course.scriptTitleRu} — ${course.scriptTitleNative}`;
  const alphabetLabel = alphabetOpen
    ? `Скрыть ${title}`
    : `Открыть ${title}`;

  return (
    <div className="header-brand-wrap inline-flex items-center gap-4">
      <Link href="/" className="header-brand-label">
        Deda
      </Link>
      <button
        type="button"
        className={`header-control-btn header-control-btn--alphabet header-control-btn--alphabet-secondary inline-flex items-center justify-center px-3 ${alphabetOpen ? 'header-control-btn--active' : ''
          }`}
        onClick={requestAlphabetToggle}
        aria-label={alphabetLabel}
        title={alphabetLabel}
      >
        {alphabetButtonText}
      </button>
    </div>
  );
}
