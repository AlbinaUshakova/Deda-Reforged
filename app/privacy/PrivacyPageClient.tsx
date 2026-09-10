'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useAppStore } from '@/lib/appStore';

export default function PrivacyPageClient() {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const supportHref = '/support' as Route;

  return (
    <main className="app-page-below-header bg-[var(--app-bg)] px-4 py-10 text-[var(--text-primary)]">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-[var(--border-soft)] bg-[var(--bg-card)] px-5 py-6 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          Deda
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          {interfaceLanguage === 'en' ? 'Privacy' : 'Приватность'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {interfaceLanguage === 'en'
            ? 'Deda stores only the data needed for learning and app support.'
            : 'Deda собирает только данные, которые нужны для обучения и поддержки приложения.'}
        </p>

        <div className="mt-6 space-y-5 text-sm leading-6 text-[var(--text-secondary)]">
          <section>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {interfaceLanguage === 'en' ? 'What is stored on your device' : 'Что хранится на устройстве'}
            </h2>
            <p className="mt-1">
              {interfaceLanguage === 'en'
                ? 'Settings, favorite words, and part of your progress are stored locally in the browser so the app stays fast and keeps state between sessions.'
                : 'Настройки, избранные слова и часть прогресса сохраняются локально в браузере, чтобы приложение работало быстрее и не теряло состояние между занятиями.'}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {interfaceLanguage === 'en' ? 'What can be sent to the server' : 'Что может отправляться на сервер'}
            </h2>
            <p className="mt-1">
              {interfaceLanguage === 'en'
                ? 'If you send feedback, Deda can transfer the message text and contact information if you provide it yourself. Lesson progress can also sync through Supabase when server sync is enabled.'
                : 'Если вы отправляете отзыв, Deda передаёт текст сообщения и контакт, если вы сами его указали. Прогресс уроков может синхронизироваться через Supabase, если серверная синхронизация включена.'}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {interfaceLanguage === 'en' ? 'Analytics' : 'Аналитика'}
            </h2>
            <p className="mt-1">
              {interfaceLanguage === 'en'
                ? 'The project may use Vercel Analytics and Google Analytics to understand overall traffic and errors. This data is not used for ad sales.'
                : 'В проекте могут использоваться Vercel Analytics и Google Analytics для понимания общих ошибок и посещаемости. Эти данные не нужны для продажи рекламы.'}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {interfaceLanguage === 'en' ? 'Data control' : 'Контроль данных'}
            </h2>
            <p className="mt-1">
              {interfaceLanguage === 'en'
                ? 'You can clear local site data in your browser settings. If you need to remove submitted feedback or ask a data question, use the support page.'
                : 'Вы можете очистить локальные данные сайта в настройках браузера. Если нужно удалить отправленный отзыв или связаться по вопросу данных, напишите через страницу поддержки.'}
            </p>
          </section>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="study-action-pill study-action-pill--primary" href="/lessons">
            {interfaceLanguage === 'en' ? 'Lessons' : 'К урокам'}
          </Link>
          <Link className="study-action-pill study-action-pill--secondary" href={supportHref}>
            {interfaceLanguage === 'en' ? 'Help' : 'Помощь'}
          </Link>
        </div>
      </section>
    </main>
  );
}
