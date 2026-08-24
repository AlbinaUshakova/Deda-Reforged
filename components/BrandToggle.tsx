'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/appStore';
import { getCourse } from '@/lib/courses';
import { getAlphabetDisplayTitle } from '@/lib/interfaceText';
import { getDisplayText } from '@/lib/transliteration';
import { getActiveTransliterationMode } from '@/lib/settings';

export default function BrandToggle() {
  const alphabetOpen = useAppStore(state => state.alphabetOpen);
  const courseId = useAppStore(state => state.settings.courseId);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const storedTransliterationMode = useAppStore(state => state.settings.transliterationMode);
  const transliterationMode = getActiveTransliterationMode(interfaceLanguage, courseId, storedTransliterationMode);
  const requestAlphabetToggle = useAppStore(state => state.requestAlphabetToggle);
  const course = getCourse(courseId);
  const alphabetButtonText = getAlphabetDisplayTitle(courseId, transliterationMode) ?? getDisplayText(course.scriptTitleNative, transliterationMode, courseId);
  const title = `${course.scriptTitleRu} — ${alphabetButtonText}`;
  const alphabetLabel = alphabetOpen
    ? (interfaceLanguage === 'en' ? `Hide ${title}` : `Скрыть ${title}`)
    : (interfaceLanguage === 'en' ? `Open ${title}` : `Открыть ${title}`);

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
