'use client';

const TOPIC_CONFIG: Record<string, { label: string; description: string }> = {
  location_movement: {
    label: 'Где / Куда',
    description: 'Фразы про местоположение и движение: здесь, там, идём, остановка.',
  },
  questions: {
    label: 'Вопросы',
    description: 'Кто? Что? Где? Когда? Почему? — базовые вопросительные фразы.',
  },
  time: {
    label: 'Время',
    description: 'Сегодня, завтра, вчера, позже — ориентация во времени.',
  },
  daily_actions: {
    label: 'Дело/быт',
    description: 'Повседневные действия: работаю, читаю, готовлю, пользуюсь чем-то.',
  },
  needs_offers: {
    label: 'Хочу / можно',
    description: 'Хочу, могу, можно, помочь, подождать — выражение потребностей.',
  },
  shopping_places: {
    label: 'Магазин / кафе',
    description: 'Цена, открыто ли, очередь, варианты — всё про сервис и покупки.',
  },
  feelings_reactions: {
    label: 'Чувства / реакция',
    description: 'Нравится, помню, понимаю, забыла, правда? супер! — эмоции и мнение.',
  },
  politeness: {
    label: 'Вежливость',
    description: 'Спасибо, пожалуйста, извините, до свидания — вежливые формулы.',
  },
};

const chipBase =
  'h-8 px-3 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition transform duration-200';
const chipPassive =
  'bg-white border border-slate-300 text-[var(--text-secondary)] hover:bg-slate-50 hover:text-[var(--text-primary)]';
const chipActive =
  'bg-indigo-50 border border-indigo-400 text-indigo-700';

function renderLevelDescription(level: number | null) {
  if (level === 1) {
    return 'L1 — супербазовые фразы: короткие, без сложной грамматики.';
  }
  if (level === 2) {
    return 'L2 — простые фразы: полные предложения с объектами и обстоятельствами.';
  }
  if (level === 3) {
    return 'L3 — фразы посложнее: обобщения, эмоции, более длинные конструкции.';
  }
  return '';
}

export function FlashcardFilters({
  hasTopics,
  hasLevels,
  topics,
  topicFilter,
  levelFilter,
  levelInfo,
  onClearFilters,
  onSelectTopic,
  onSelectLevel,
}: {
  hasTopics: boolean;
  hasLevels: boolean;
  topics: string[];
  topicFilter: string | null;
  levelFilter: number | null;
  levelInfo: number | null;
  onClearFilters: () => void;
  onSelectTopic: (topic: string) => void;
  onSelectLevel: (level: number) => void;
}) {
  if (hasTopics) {
    return (
      <>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <button
            className={`${chipBase} ${topicFilter === null ? chipActive : chipPassive}`}
            onClick={onClearFilters}
          >
            Все
          </button>
          {topics.map(topic => {
            const cfg = TOPIC_CONFIG[topic];
            return (
              <button
                key={topic}
                className={`${chipBase} ${topicFilter === topic ? chipActive : chipPassive}`}
                onClick={() => onSelectTopic(topic)}
              >
                {cfg?.label ?? topic}
              </button>
            );
          })}
        </div>
        {topicFilter && (
          <div className="mt-1 max-w-xl text-center text-[11px] md:text-xs text-[var(--text-secondary)]">
            {TOPIC_CONFIG[topicFilter]?.description ?? 'Фразы по выбранной теме.'}
          </div>
        )}
      </>
    );
  }

  if (hasLevels) {
    return (
      <>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <button
            className={`${chipBase} ${levelFilter === null ? chipActive : chipPassive}`}
            onClick={onClearFilters}
          >
            Все
          </button>
          {[1, 2, 3].map(level => (
            <button
              key={level}
              className={`${chipBase} ${levelFilter === level ? chipActive : chipPassive}`}
              onClick={() => onSelectLevel(level)}
            >
              L{level}
            </button>
          ))}
        </div>
        {levelInfo !== null && (
          <div className="mt-1 max-w-xl text-center text-[11px] md:text-xs text-[var(--text-secondary)]">
            {renderLevelDescription(levelInfo)}
          </div>
        )}
      </>
    );
  }

  return null;
}
