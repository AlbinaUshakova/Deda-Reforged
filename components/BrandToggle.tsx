'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/appStore';

export default function BrandToggle() {
  const alphabetOpen = useAppStore(state => state.alphabetOpen);
  const requestAlphabetToggle = useAppStore(state => state.requestAlphabetToggle);

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
        aria-label="Показать или скрыть грузинский алфавит"
        title="Показать/скрыть алфавит"
      >
        Алфавит
      </button>
    </div>
  );
}
