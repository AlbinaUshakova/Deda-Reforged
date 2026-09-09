'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useAppStore } from '@/lib/appStore';
import { LESSON_UNLOCK_SCORE } from '@/lib/lessonProgress';

export default function SupportPageClient() {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const privacyHref = '/privacy' as Route;

  return (
    <main className="min-h-[calc(100dvh-66px)] bg-[var(--app-bg)] px-4 py-10 text-[var(--text-primary)]">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-[var(--border-soft)] bg-[var(--bg-card)] px-5 py-6 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          Deda
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          {interfaceLanguage === 'en' ? 'Help' : 'Помощь'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {interfaceLanguage === 'en'
            ? 'If something feels unclear or broken, start here.'
            : 'Если что-то не работает или непонятно, начните с этих шагов.'}
        </p>

        <div className="mt-6 grid gap-3 text-sm leading-6 text-[var(--text-secondary)]">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--button-bg)] p-4">
            <h2 className="font-bold text-[var(--text-primary)]">
              {interfaceLanguage === 'en' ? 'No letter sound' : 'Не слышно буквы'}
            </h2>
            <p className="mt-1">
              {interfaceLanguage === 'en'
                ? 'Check your device volume and tap the letter again. On some devices, audio starts only after the first tap on the screen.'
                : 'Проверьте громкость устройства и нажмите букву ещё раз. На некоторых устройствах первый звук запускается только после касания экрана.'}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--button-bg)] p-4">
            <h2 className="font-bold text-[var(--text-primary)]">
              {interfaceLanguage === 'en' ? 'Lesson does not open' : 'Не открывается урок'}
            </h2>
            <p className="mt-1">
              {interfaceLanguage === 'en'
                ? `Locked lessons open after ${LESSON_UNLOCK_SCORE} points in the previous lesson practice. Start from the recommended lesson card on the lessons screen.`
                : `Закрытые уроки открываются после ${LESSON_UNLOCK_SCORE} очков в игре предыдущего урока. Начните с рекомендованной карточки на экране уроков.`}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--button-bg)] p-4">
            <h2 className="font-bold text-[var(--text-primary)]">
              {interfaceLanguage === 'en' ? 'I want to send an idea or bug' : 'Хочу отправить идею или ошибку'}
            </h2>
            <p className="mt-1">
              {interfaceLanguage === 'en'
                ? 'Open the top-right menu and choose “Help and feedback”. Contact details are optional.'
                : 'Откройте меню в правом верхнем углу и выберите «Помощь и отзывы». Контакт можно оставить необязательно.'}
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="study-action-pill study-action-pill--primary" href="/lessons">
            {interfaceLanguage === 'en' ? 'Lessons' : 'К урокам'}
          </Link>
          <Link className="study-action-pill study-action-pill--secondary" href={privacyHref}>
            {interfaceLanguage === 'en' ? 'Privacy' : 'Приватность'}
          </Link>
        </div>
      </section>
    </main>
  );
}
