import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';

export const metadata: Metadata = {
  title: 'Приватность - Deda',
  description: 'Как Deda хранит настройки, прогресс и сообщения обратной связи.',
};

export default function PrivacyPage() {
  const supportHref = '/support' as Route;

  return (
    <main className="min-h-[calc(100dvh-66px)] bg-[var(--app-bg)] px-4 py-10 text-[var(--text-primary)]">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-[var(--border-soft)] bg-[var(--bg-card)] px-5 py-6 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          Deda
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          Приватность
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          Deda собирает только данные, которые нужны для обучения и поддержки приложения.
        </p>

        <div className="mt-6 space-y-5 text-sm leading-6 text-[var(--text-secondary)]">
          <section>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Что хранится на устройстве</h2>
            <p className="mt-1">
              Тема, настройки, избранные слова и часть прогресса сохраняются локально в браузере, чтобы приложение работало быстрее и не теряло состояние между занятиями.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Что может отправляться на сервер</h2>
            <p className="mt-1">
              Если вы отправляете отзыв, Deda передаёт текст сообщения и контакт, если вы сами его указали. Прогресс уроков может синхронизироваться через Supabase, если серверная синхронизация включена.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Аналитика</h2>
            <p className="mt-1">
              В проекте могут использоваться Vercel Analytics и Google Analytics для понимания общих ошибок и посещаемости. Эти данные не нужны для продажи рекламы.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Контроль данных</h2>
            <p className="mt-1">
              Вы можете очистить локальные данные сайта в настройках браузера. Если нужно удалить отправленный отзыв или связаться по вопросу данных, напишите через страницу поддержки.
            </p>
          </section>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="study-action-pill study-action-pill--primary" href="/lessons">
            К урокам
          </Link>
          <Link className="study-action-pill study-action-pill--secondary" href={supportHref}>
            Поддержка
          </Link>
        </div>
      </section>
    </main>
  );
}
