'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useAppStore } from '@/lib/appStore';
import { readFavoriteWords } from '@/lib/studyPreferences';
import { CUSTOM_CARDS_UPDATED_EVENT, readCustomCards } from '@/lib/customCards';
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
  'Транспорт': 'M5.5 15.5h13M7 15.5l1-7h8l1 7M8.5 11h7M8 18h.1M16 18h.1',
  'Отель': 'M6 18V7h12v11M6 13h12M9 10h.1M15 10h.1M12 13v5',
  'Числа': 'M9.6 7.4 8.2 16.6M15.4 7.4 14 16.6M7.4 10.8H17M6.9 13.8H16.5',
};

const sectionTitleEn: Record<string, string> = {
  'Приветствия и прощания': 'Greetings and goodbyes',
  'Вежливость': 'Politeness',
  'Знакомство': 'Introductions',
  'Простые ответы': 'Simple answers',
  'Понимание языка': 'Understanding the language',
  'Основные вопросы': 'Basic questions',
  'Магазин и оплата': 'Shopping and payment',
  'Кафе и еда': 'Cafe and food',
  'Общественные места': 'Public places',
  'Помощь и самочувствие': 'Help and wellbeing',
  'Транспорт': 'Transport',
  'Отель': 'Hotel',
  'Числа': 'Numbers',
};

function translateSectionTitle(title: string, interfaceLanguage: 'ru' | 'en') {
  return interfaceLanguage === 'en' ? (sectionTitleEn[title] ?? title) : title;
}

function getCardCount(item: LessonListItem): number {
  return Math.max(0, item.cardCount ?? 0);
}

function getStudiedCount(item: LessonListItem): number {
  const cardCount = getCardCount(item);
  const best = Math.max(0, item.best ?? 0);
  return cardCount > 0 ? Math.min(best, cardCount) : best;
}

function getCardCountLabel(count: number, interfaceLanguage: 'ru' | 'en') {
  if (interfaceLanguage === 'en') {
    return `${count} ${count === 1 ? 'card' : 'cards'}`;
  }

  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${count} карточек`;
  if (last === 1) return `${count} карточка`;
  if (last >= 2 && last <= 4) return `${count} карточки`;
  return `${count} карточек`;
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

type SupportModeCard = {
  id: string;
  href: Route;
  title: string;
  meta: string;
  locked?: boolean;
  featured?: boolean;
};

export function SpecialLessonLinks({
  practicalSpecials,
  allLessonsSpecial,
  favoritesSpecial,
  phrasesSpecial,
  allLessonsReady,
  reviewDeckCardCount,
}: {
  practicalSpecials: LessonListItem[];
  allLessonsSpecial?: LessonListItem;
  favoritesSpecial?: LessonListItem;
  phrasesSpecial?: LessonListItem;
  allLessonsReady: boolean;
  reviewDeckCardCount: number;
}) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const courseId = useAppStore(state => state.settings.courseId);
  const [savedWordsCount, setSavedWordsCount] = useState(0);
  const [customCardsCount, setCustomCardsCount] = useState(0);

  useEffect(() => {
    const refreshCounts = () => {
      try {
        setSavedWordsCount(readFavoriteWords().size);
        setCustomCardsCount(readCustomCards(courseId).length);
      } catch {
        setSavedWordsCount(0);
        setCustomCardsCount(0);
      }
    };
    refreshCounts();
    window.addEventListener('focus', refreshCounts);
    window.addEventListener('storage', refreshCounts);
    window.addEventListener(CUSTOM_CARDS_UPDATED_EVENT, refreshCounts);
    return () => {
      window.removeEventListener('focus', refreshCounts);
      window.removeEventListener('storage', refreshCounts);
      window.removeEventListener(CUSTOM_CARDS_UPDATED_EVENT, refreshCounts);
    };
  }, [courseId]);
  const legacyPhrasesSpecial = phrasesSpecial && !practicalSpecials.some(
    special => special.id === phrasesSpecial.id,
  )
    ? phrasesSpecial
    : undefined;
  const supportModeCards = [
    {
      id: 'custom',
      href: '/custom-cards' as Route,
      title: interfaceLanguage === 'en' ? 'My cards' : 'Мои карточки',
      meta: interfaceLanguage === 'en'
        ? `Write new words in your own letters · ${getCardCountLabel(customCardsCount, interfaceLanguage)}`
        : `Записывай новые слова родными буквами · ${getCardCountLabel(customCardsCount, interfaceLanguage)}`,
      featured: true,
    },
    favoritesSpecial
      ? {
          id: favoritesSpecial.id,
          href: `/study/${favoritesSpecial.id}` as Route,
          title: interfaceLanguage === 'en' ? 'Saved words' : 'Сохраненные слова',
          meta: interfaceLanguage === 'en'
            ? `Words you starred · ${getCardCountLabel(savedWordsCount, interfaceLanguage)}`
            : `Слова со звездой · ${getCardCountLabel(savedWordsCount, interfaceLanguage)}`,
        }
      : null,
    allLessonsSpecial
      ? {
          id: allLessonsSpecial.id,
          href: `/study/${allLessonsSpecial.id}` as Route,
          title: interfaceLanguage === 'en' ? 'Review' : 'Повторение',
          locked: !allLessonsReady,
          meta:
            !allLessonsReady
              ? interfaceLanguage === 'en'
                ? 'Words from learned lessons · opens after 5 points'
                : 'Слова из освоенных уроков · откроется после 5 очков'
              : interfaceLanguage === 'en'
                ? `Words from learned lessons · ${getCardCountLabel(reviewDeckCardCount, interfaceLanguage)}`
                : `Слова из освоенных уроков · ${getCardCountLabel(reviewDeckCardCount, interfaceLanguage)}`,
        }
      : null,
    legacyPhrasesSpecial
      ? {
          id: legacyPhrasesSpecial.id,
          href: `/study/${legacyPhrasesSpecial.id}` as Route,
          title: translateSectionTitle(legacyPhrasesSpecial.title, interfaceLanguage),
          meta:
            interfaceLanguage === 'en'
              ? 'Ready-made phrases for speaking'
              : 'Готовые речевые фразы',
        }
      : null,
  ] as Array<SupportModeCard | null>;
  const visibleSupportModeCards = supportModeCards.filter((item): item is SupportModeCard => item !== null);

  if (visibleSupportModeCards.length === 0 && practicalSpecials.length === 0) {
    return null;
  }

  const totalCards = practicalSpecials.reduce((sum, special) => sum + getCardCount(special), 0);
  const studiedCards = practicalSpecials.reduce((sum, special) => sum + getStudiedCount(special), 0);
  const totalProgress = totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;

  return (
    <section className="home-special-section relative z-[170] mt-8 min-[1512px]:mt-12 min-[1700px]:mt-14 [@media(max-height:980px)]:mt-9 mx-auto w-full max-w-[1160px]">
      {visibleSupportModeCards.length > 0 && (
        <div className="home-special-block mb-4">
          <div className="home-special-heading">
            <div>
              <span className="home-special-eyebrow">
                {interfaceLanguage === 'en' ? 'More practice' : 'Ещё для практики'}
              </span>
            </div>
          </div>
          <div className="home-support-grid">
            {visibleSupportModeCards.map((card) => (
              <Link key={card.id} href={card.href} legacyBehavior>
                <a
                  className={`home-support-card ${card.featured ? 'home-support-card--featured' : ''} ${card.locked ? 'home-support-card--locked' : 'lesson-card--interactive'}`}
                  onClick={(event) => {
                    if (!card.locked) return;
                    event.preventDefault();
                  }}
                  aria-disabled={card.locked ? 'true' : undefined}
                >
                  <span className="home-special-card-copy">
                    {card.featured && (
                      <span className="home-support-card-badge">
                        <span aria-hidden="true">＋</span>
                        {interfaceLanguage === 'en' ? 'Create your own' : 'Создай свои'}
                      </span>
                    )}
                    <span className="home-support-card-title">{card.title}</span>
                    <span className="home-support-card-meta">{card.meta}</span>
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}

      {practicalSpecials.length > 0 && (
        <div className="home-special-block">
          <div className="home-special-heading">
            <div>
              <span className="home-special-eyebrow">
                {interfaceLanguage === 'en' ? 'Extra practice' : 'Дополнительная практика'}
              </span>
              <span className="home-special-summary">
                {interfaceLanguage === 'en'
                  ? `${studiedCards} of ${totalCards} studied`
                  : `${studiedCards} из ${totalCards} изучено`}
              </span>
            </div>
          </div>
          <div className="home-special-total-progress" aria-label={interfaceLanguage === 'en' ? `Studied ${totalProgress}%` : `Изучено ${totalProgress}%`}>
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
                ? (interfaceLanguage === 'en' ? 'Completed' : 'Пройдено')
                : isStarted
                  ? (interfaceLanguage === 'en' ? `${studiedCount} of ${cardCount} studied` : `${studiedCount} из ${cardCount} изучено`)
                  : getCardCountLabel(cardCount, interfaceLanguage);

              return (
                <Link key={special.id} href={`/study/${special.id}`} legacyBehavior>
                  <a className="home-special-card lesson-card--interactive">
                    <SectionIcon title={special.title} />
                    <span className="home-special-card-copy">
                      <span className="home-special-card-title">{translateSectionTitle(special.title, interfaceLanguage)}</span>
                      <span className="home-special-card-meta">
                        <span>{metaText}</span>
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

    </section>
  );
}
