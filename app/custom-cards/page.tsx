'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import {
  addCustomCard,
  CUSTOM_CARDS_UPDATED_EVENT,
  deleteCustomCard,
  readCustomCards,
  updateCustomCard,
  type CustomCard,
  type CustomCardInput,
} from '@/lib/customCards';

const EMPTY_FORM: CustomCardInput = { front: '', meaning: '', transcription: '' };

function cardCountLabel(count: number, language: 'ru' | 'en') {
  if (language === 'en') return `${count} ${count === 1 ? 'card' : 'cards'}`;
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${count} карточек`;
  if (last === 1) return `${count} карточка`;
  if (last >= 2 && last <= 4) return `${count} карточки`;
  return `${count} карточек`;
}

export default function CustomCardsPage() {
  const courseId = useAppStore(state => state.settings.courseId);
  const language = useAppStore(state => state.settings.interfaceLanguage);
  const hydrate = useAppStore(state => state.hydrate);
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [form, setForm] = useState<CustomCardInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const refresh = useCallback(() => setCards(readCustomCards(courseId)), [courseId]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener(CUSTOM_CARDS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(CUSTOM_CARDS_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = editingId
      ? updateCustomCard(courseId, editingId, form)
      : addCustomCard(courseId, form);
    if (saved) resetForm();
  }

  function startEditing(card: CustomCard) {
    setEditingId(card.id);
    setForm({ front: card.front, meaning: card.meaning, transcription: card.transcription ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] px-4 py-8 text-[var(--text-primary)] sm:px-6 sm:py-12">
      <div className="study-screen-orb study-screen-orb--left" aria-hidden="true" />
      <div className="study-screen-orb study-screen-orb--right" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-[980px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              {language === 'en' ? 'Support mode' : 'Режим поддержки'}
            </span>
            <h1 className="mt-2 text-[clamp(2rem,6vw,4.2rem)] font-black leading-[0.95] tracking-[-0.055em]">
              {language === 'en' ? 'My cards' : 'Мои карточки'}
            </h1>
            <p className="mt-3 max-w-xl text-sm font-medium text-[var(--text-secondary)] sm:text-base">
              {language === 'en'
                ? 'Create a personal deck for the words you want to learn.'
                : 'Создай личную колоду для слов, которые хочешь выучить.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link className="study-action-pill study-action-pill--secondary" href="/lessons">
              <span aria-hidden="true">←</span>
              {language === 'en' ? 'Lessons' : 'Уроки'}
            </Link>
            {cards.length > 0 && (
              <Link className="study-action-pill study-action-pill--primary" href="/study/custom">
                <span aria-hidden="true">▶</span>
                {language === 'en' ? 'Study' : 'Учить'}
              </Link>
            )}
          </div>
        </div>

        <section className="rounded-[28px] border border-white/75 bg-white/80 p-4 shadow-[0_20px_60px_rgba(31,28,23,0.08)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold tracking-[-0.03em]">
              {editingId
                ? (language === 'en' ? 'Edit card' : 'Изменить карточку')
                : (language === 'en' ? 'New card' : 'Новая карточка')}
            </h2>
            <span className="rounded-full bg-[rgba(255,107,53,0.1)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
              {cardCountLabel(cards.length, language)}
            </span>
          </div>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="grid gap-1.5 text-xs font-bold text-[var(--text-secondary)]">
              {language === 'en' ? 'Word or phrase' : 'Слово или фраза'}
              <input
                className="min-h-12 rounded-2xl border border-black/10 bg-white px-4 text-base font-semibold text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                value={form.front}
                onChange={event => setForm(current => ({ ...current, front: event.target.value }))}
                maxLength={120}
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold text-[var(--text-secondary)]">
              {language === 'en' ? 'Translation' : 'Перевод'}
              <input
                className="min-h-12 rounded-2xl border border-black/10 bg-white px-4 text-base font-semibold text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                value={form.meaning}
                onChange={event => setForm(current => ({ ...current, meaning: event.target.value }))}
                maxLength={180}
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold text-[var(--text-secondary)] md:col-span-2">
              {language === 'en' ? 'Transcription (optional)' : 'Транскрипция (необязательно)'}
              <input
                className="min-h-12 rounded-2xl border border-black/10 bg-white px-4 text-base font-semibold text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                value={form.transcription ?? ''}
                onChange={event => setForm(current => ({ ...current, transcription: event.target.value }))}
                maxLength={160}
              />
            </label>
            <div className="mt-1 flex flex-wrap gap-2 md:col-span-2">
              <button className="study-action-pill study-action-pill--primary" type="submit">
                {editingId
                  ? (language === 'en' ? 'Save changes' : 'Сохранить')
                  : (language === 'en' ? 'Add card' : 'Добавить карточку')}
              </button>
              {editingId && (
                <button className="study-action-pill study-action-pill--secondary" type="button" onClick={resetForm}>
                  {language === 'en' ? 'Cancel' : 'Отмена'}
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-4 rounded-[28px] border border-white/75 bg-white/60 p-4 backdrop-blur-xl sm:p-6">
          {cards.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-lg font-extrabold">
                {language === 'en' ? 'Your deck is empty' : 'Личная колода пока пуста'}
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {language === 'en' ? 'Add the first word above.' : 'Добавь первое слово выше.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {cards.map(card => (
                <article key={card.id} className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white bg-white/85 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-extrabold">{card.front}</p>
                    <p className="truncate text-sm font-medium text-[var(--text-secondary)]">{card.meaning}</p>
                    {card.transcription && <p className="mt-1 truncate text-xs text-[var(--text-tertiary)]">{card.transcription}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      className="grid h-10 w-10 place-items-center rounded-full bg-black/[0.04] text-base transition hover:bg-black/[0.08]"
                      onClick={() => startEditing(card)}
                      aria-label={language === 'en' ? `Edit ${card.front}` : `Изменить ${card.front}`}
                      title={language === 'en' ? 'Edit' : 'Изменить'}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="grid h-10 w-10 place-items-center rounded-full bg-black/[0.04] text-base transition hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        deleteCustomCard(courseId, card.id);
                        if (editingId === card.id) resetForm();
                      }}
                      aria-label={language === 'en' ? `Delete ${card.front}` : `Удалить ${card.front}`}
                      title={language === 'en' ? 'Delete' : 'Удалить'}
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          <p className="mt-5 text-center text-[11px] font-medium text-[var(--text-tertiary)]">
            {language === 'en'
              ? 'Saved only on this device. Clearing browser data will remove these cards.'
              : 'Сохраняется только на этом устройстве. При очистке данных браузера карточки удалятся.'}
          </p>
        </section>
      </div>
    </main>
  );
}
