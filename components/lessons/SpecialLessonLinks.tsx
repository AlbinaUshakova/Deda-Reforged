'use client';

import Link from 'next/link';
import type { LessonListItem } from '@/lib/lessonProgress';

const sectionIconPaths: Record<string, string> = {
  'Приветствия и прощания': 'M6.5 12.5c1.3-2.1 3.1-3.1 5.5-3.1s4.2 1 5.5 3.1M8 8.2a2.2 2.2 0 1 0 4.4 0 2.2 2.2 0 0 0-4.4 0Zm6.7.4 2.8-2.8m0 0v2.4m0-2.4h-2.4',
  'Вежливость': 'M7.2 11.4 10 14.2l6.8-6.8M5.6 7.8l2.7-2.7 3.1 3.1-2.7 2.7M12.6 11.4l2.7-2.7 3.1 3.1-2.7 2.7',
  'Знакомство': 'M6.2 15.8c.9-2.2 2.8-3.4 5.8-3.4s4.9 1.2 5.8 3.4M9.4 7.7a2.6 2.6 0 1 0 5.2 0 2.6 2.6 0 0 0-5.2 0',
  'Простые ответы': 'M6.8 8.5h10.4M6.8 12h7.2M6.8 15.5h4.6M15.2 14.9l1.2 1.2 2.3-2.6',
  'Понимание языка': 'M6.6 9.2c1.5-2 3.2-3 5.4-3 3.2 0 5.8 2.6 5.8 5.8 0 1-.2 1.9-.7 2.7l1.1 2.6-2.8-.8c-1 .8-2.2 1.3-3.4 1.3-2.2 0-3.9-1-5.4-3',
  'Основные вопросы': 'M10 8.4a2.1 2.1 0 0 1 4 1c0 2.2-2.5 1.8-2.5 4M11.5 16.4h.1',
  'Магазин и оплата': 'M6.6 8.2h10.8l-1.1 6.2H8L6.6 8.2Zm0 0-.5-2.1H4.8M9 17.2h.1M15 17.2h.1',
  'Кафе и еда': 'M7.2 7v5.2a2.8 2.8 0 1 0 5.6 0V7M7.2 7h5.6M15.4 7v10.2M15.4 7c1.8.7 2.9 2.1 2.9 3.8 0 1.7-1.1 3.1-2.9 3.8',
  'Общественные места': 'M7.8 17.2l2-5.2-1.4-2.2M10.4 6.6a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Zm1.8 4.3 2.1 1.4 2.4-.9M12.5 17.2l-1.1-4.3',
  'Помощь и самочувствие': 'M12 5.8v12.4M5.8 12h12.4M8.1 8.1a5.5 5.5 0 1 1 7.8 7.8 5.5 5.5 0 0 1-7.8-7.8Z',
};

function getCardCount(item: LessonListItem): number {
  return Math.max(0, item.cardCount ?? 0);
}

function getStudiedCount(item: LessonListItem): number {
  const cardCount = getCardCount(item);
  const best = Math.max(0, item.best ?? 0);
  return cardCount > 0 ? Math.min(best, cardCount) : best;
}

function SectionIcon({ title }: { title: string }) {
  const path = sectionIconPaths[title] ?? sectionIconPaths['Простые ответы'];

  return (
    <span className="home-special-card-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="img">
        <path d={path} />
      </svg>
    </span>
  );
}

export function SpecialLessonLinks({
  practicalSpecials,
  phrasesSpecial,
}: {
  practicalSpecials: LessonListItem[];
  phrasesSpecial?: LessonListItem;
}) {
  const legacyPhrasesSpecial = phrasesSpecial && !practicalSpecials.some(
    special => special.id === phrasesSpecial.id,
  )
    ? phrasesSpecial
    : undefined;

  if (!legacyPhrasesSpecial && practicalSpecials.length === 0) {
    return null;
  }

  const totalCards = practicalSpecials.reduce((sum, special) => sum + getCardCount(special), 0);
  const studiedCards = practicalSpecials.reduce((sum, special) => sum + getStudiedCount(special), 0);
  const totalProgress = totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;

  return (
    <section className="home-special-section relative z-[170] mt-8 min-[1512px]:mt-12 min-[1700px]:mt-14 [@media(max-height:980px)]:mt-9 mx-auto w-full max-w-[1160px]">
      {practicalSpecials.length > 0 && (
        <div className="home-special-block">
          <div className="home-special-heading">
            <div>
              <span className="home-special-eyebrow">Фразы для первых дней в новой стране</span>
              <span className="home-special-summary">{studiedCards} из {totalCards} изучено</span>
            </div>
          </div>
          <div className="home-special-total-progress" aria-label={`Изучено ${totalProgress}%`}>
            <span style={{ width: `${totalProgress}%` }} />
          </div>
          <div className="home-special-grid">
            {practicalSpecials.map(special => {
              const cardCount = getCardCount(special);
              const studiedCount = getStudiedCount(special);
              const progressPercent = cardCount > 0 ? Math.round((studiedCount / cardCount) * 100) : 0;
              const isComplete = cardCount > 0 && studiedCount >= cardCount;
              const isStarted = studiedCount > 0;
              const metaText = isComplete
                ? 'Пройдено'
                : isStarted
                  ? `${studiedCount} из ${cardCount} изучено`
                  : `${cardCount} базовых`;

              return (
                <Link key={special.id} href={`/study/${special.id}`} legacyBehavior>
                  <a className="home-special-card lesson-card--interactive">
                    <SectionIcon title={special.title} />
                    <span className="home-special-card-copy">
                      <span className="home-special-card-title">{special.title}</span>
                      <span className="home-special-card-meta">
                        <span>{metaText}</span>
                        {!isStarted && !isComplete && <span>Не начато</span>}
                      </span>
                      <span className="home-special-card-progress" aria-hidden="true">
                        <span style={{ width: `${progressPercent}%` }} />
                      </span>
                    </span>
                    <span className="home-special-card-arrow" aria-hidden="true">›</span>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="home-special-links flex items-center justify-center gap-2.5 [@media(max-width:720px)]:gap-2 [@media(max-width:480px)]:gap-1.5">
        {legacyPhrasesSpecial && (
          <Link href={`/study/${legacyPhrasesSpecial.id}`} legacyBehavior>
            <a className="home-special-btn h-9 min-w-[152px] px-3 text-[12px] [@media(max-width:900px)]:h-8 [@media(max-width:900px)]:min-w-[136px] [@media(max-width:900px)]:px-2.5 [@media(max-width:900px)]:text-[11px] [@media(max-width:720px)]:h-7.5 [@media(max-width:720px)]:min-w-[120px] [@media(max-width:720px)]:px-2 [@media(max-width:720px)]:text-[10px] [@media(max-width:480px)]:min-w-[112px] [@media(max-width:480px)]:px-2 rounded-2xl border border-slate-200/80 bg-transparent text-[var(--text-secondary)] flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-[var(--button-hover)] hover:text-[var(--text-primary)] shadow-[0_8px_18px_rgba(15,23,42,0.1)] [@media(max-width:700px)]:shadow-[0_5px_12px_rgba(15,23,42,0.07)]">
              <span>{legacyPhrasesSpecial.title}</span>
              {typeof legacyPhrasesSpecial.cardCount === 'number' && (
                <span className="home-special-btn-count">{legacyPhrasesSpecial.cardCount}</span>
              )}
            </a>
          </Link>
        )}
      </div>
    </section>
  );
}
