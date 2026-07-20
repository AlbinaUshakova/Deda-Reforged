import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';

export const metadata: Metadata = {
  title: 'Поддержка - Deda',
  description: 'Помощь по обучению, настройкам, звуку и обратной связи в Deda.',
};

export default function SupportPage() {
  const privacyHref = '/privacy' as Route;

  return (
    <main className="min-h-[calc(100dvh-66px)] bg-[var(--app-bg)] px-4 py-10 text-[var(--text-primary)]">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-[var(--border-soft)] bg-[var(--bg-card)] px-5 py-6 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          Deda
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          Поддержка
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          Если что-то не работает или непонятно, начните с этих шагов.
        </p>

        <div className="mt-6 grid gap-3 text-sm leading-6 text-[var(--text-secondary)]">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--button-bg)] p-4">
            <h2 className="font-bold text-[var(--text-primary)]">Не слышно буквы</h2>
            <p className="mt-1">Проверьте громкость устройства и нажмите букву ещё раз. На некоторых устройствах первый звук запускается только после касания экрана.</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--button-bg)] p-4">
            <h2 className="font-bold text-[var(--text-primary)]">Не открывается урок</h2>
            <p className="mt-1">Закрытые уроки открываются после прогресса в предыдущем уроке. Начните с рекомендованной карточки на экране уроков.</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--button-bg)] p-4">
            <h2 className="font-bold text-[var(--text-primary)]">Хочу отправить идею или ошибку</h2>
            <p className="mt-1">Откройте меню в правом верхнем углу и выберите «Помощь и отзывы». Контакт можно оставить необязательно.</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="study-action-pill study-action-pill--primary" href="/lessons">
            К урокам
          </Link>
          <Link className="study-action-pill study-action-pill--secondary" href={privacyHref}>
            Приватность
          </Link>
        </div>
      </section>
    </main>
  );
}
