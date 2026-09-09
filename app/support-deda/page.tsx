'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/appStore';
import { getDonationUrl } from '@/lib/donation';

export default function SupportDedaPage() {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const donationUrl = getDonationUrl();
  const isEnglish = interfaceLanguage === 'en';

  return (
    <main className="min-h-[calc(100dvh-66px)] bg-[var(--app-bg)] px-4 py-10 text-[var(--text-primary)]">
      <section className="mx-auto max-w-xl overflow-hidden rounded-[32px] border border-[var(--border-soft)] bg-[var(--bg-card)] px-6 py-8 text-center shadow-[var(--shadow-soft)] sm:px-10 sm:py-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,107,53,0.11)] text-2xl text-[var(--accent)]" aria-hidden="true">
          ♡
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Deda
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          {isEnglish ? 'Help Deda grow' : 'Помоги Deda расти'}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-6 text-[var(--text-secondary)]">
          {isEnglish
            ? 'All lessons stay free. If Deda helped you start reading, you can support the project.'
            : 'Все уроки остаются бесплатными. Если Deda помог начать читать, можно поддержать проект.'}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-tertiary)]">
          {isEnglish
            ? 'Support helps us add new scripts, verify content, and improve lessons.'
            : 'Поддержка поможет добавлять новые письменности, проверять контент и улучшать уроки.'}
        </p>

        <div className="mt-7 flex flex-col items-center gap-3">
          {donationUrl ? (
            <a
              className="btn-primary inline-flex min-h-[48px] items-center justify-center rounded-full px-7"
              href={donationUrl}
              target="_blank"
              rel="noreferrer"
            >
              {isEnglish ? 'Support the project' : 'Поддержать проект'}
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex min-h-[48px] cursor-not-allowed items-center justify-center rounded-full bg-[var(--button-bg)] px-7 text-sm font-semibold text-[var(--text-tertiary)]"
            >
              {isEnglish ? 'Support link coming soon' : 'Ссылка для поддержки скоро появится'}
            </button>
          )}
          <Link className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]" href="/lessons">
            {isEnglish ? 'Back to lessons' : 'Вернуться к урокам'}
          </Link>
        </div>
      </section>
    </main>
  );
}
