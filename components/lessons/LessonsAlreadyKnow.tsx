'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getEpisodeByIdCached } from '@/lib/clientContentCache';
import type { CourseId } from '@/lib/courses';

const costumeCatByCourse: Record<CourseId, string> = {
  ka: '/images/cats/deda-cost-ka.png',
  en: '/images/cats/deda-cost-en.png',
  es: '/images/cats/deda-cost-es.png',
  de: '/images/cats/deda-cost-de.png',
  sr: '/images/cats/deda-cost-sr.png',
  tr: '/images/cats/deda-cost-tr.png',
};

function plural(n: number, one: string, few: string, many: string): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

const roleByCourse: Record<CourseId, string> = {
  ka: 'джигит',
  tr: 'паша',
  es: 'кабальеро',
  en: 'джентльмен',
  de: 'мейстер',
  sr: 'газда',
};

const wordLabel = (n: number) => plural(n, 'слово', 'слова', 'слов');
const phraseLabel = (n: number) => plural(n, 'фраза', 'фразы', 'фраз');
const letterLabel = (n: number) => plural(n, 'буква', 'буквы', 'букв');

type Counts = { words: number; phrases: number };

export function LessonsAlreadyKnow({
  courseId,
  episodeIds,
  masteredEpisodeIds,
  lettersLearned,
  lettersTotal,
}: {
  courseId: CourseId;
  episodeIds: string[];
  masteredEpisodeIds: string[];
  lettersLearned: number;
  lettersTotal: number;
}) {
  const [learned, setLearned] = useState<Counts>({ words: 0, phrases: 0 });
  const [total, setTotal] = useState<Counts>({ words: 0, phrases: 0 });

  useEffect(() => {
    let cancelled = false;
    if (episodeIds.length === 0) {
      setLearned({ words: 0, phrases: 0 });
      setTotal({ words: 0, phrases: 0 });
      return;
    }

    const masteredSet = new Set(masteredEpisodeIds);
    (async () => {
      try {
        const episodes = await Promise.all(
          episodeIds.map(async (id) => ({ id, episode: await getEpisodeByIdCached(id, courseId) })),
        );
        if (cancelled) return;
        const learnedCounts: Counts = { words: 0, phrases: 0 };
        const totalCounts: Counts = { words: 0, phrases: 0 };
        for (const { id, episode } of episodes) {
          if (!episode) continue;
          let words = 0;
          let phrases = 0;
          for (const card of episode.cards) {
            const text = (card.ge_text ?? '').trim();
            if (!text) continue;
            if (/\s/.test(text)) phrases += 1;
            else words += 1;
          }
          totalCounts.words += words;
          totalCounts.phrases += phrases;
          if (masteredSet.has(id)) {
            learnedCounts.words += words;
            learnedCounts.phrases += phrases;
          }
        }
        setLearned(learnedCounts);
        setTotal(totalCounts);
      } catch {
        if (!cancelled) {
          setLearned({ words: 0, phrases: 0 });
          setTotal({ words: 0, phrases: 0 });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId, episodeIds, masteredEpisodeIds]);

  if (masteredEpisodeIds.length === 0) return null;

  const knownStats = [
    { value: learned.words, label: wordLabel(learned.words) },
    { value: learned.phrases, label: phraseLabel(learned.phrases) },
    { value: lettersLearned, label: letterLabel(lettersLearned) },
  ].filter((stat) => stat.value > 0);

  if (knownStats.length === 0) return null;

  const remaining = [
    { value: Math.max(0, total.words - learned.words), label: (n: number) => wordLabel(n) },
    { value: Math.max(0, total.phrases - learned.phrases), label: (n: number) => phraseLabel(n) },
    { value: Math.max(0, lettersTotal - lettersLearned), label: (n: number) => letterLabel(n) },
  ].filter((item) => item.value > 0);

  const catSrc = costumeCatByCourse[courseId] ?? costumeCatByCourse.ka;

  return (
    <section className="lessons-know mx-auto mt-4 w-full max-w-[760px] [@media(max-width:700px)]:mt-3">
      <div className="flex items-end gap-2 sm:gap-3">
        <Image
          src={catSrc}
          alt=""
          width={140}
          height={140}
          priority
          className="h-[92px] w-[92px] shrink-0 self-end object-contain [@media(max-width:560px)]:h-[72px] [@media(max-width:560px)]:w-[72px] sm:h-[108px] sm:w-[108px]"
        />
        <div className="relative flex-1 rounded-[20px] rounded-bl-[6px] border border-white/60 bg-white/72 px-[clamp(14px,2vw,20px)] py-[clamp(11px,1.6vw,14px)] shadow-[0_10px_28px_rgba(31,28,23,0.07)] backdrop-blur-[10px]">
          <span
            aria-hidden="true"
            className="absolute -left-[7px] bottom-6 h-0 w-0 border-y-[7px] border-r-[8px] border-y-transparent border-r-white/72"
          />
          <div className="text-[clamp(12px,1.35vw,14px)] font-medium text-[var(--text-primary)]">
            Смотри, ты уже умеешь читать
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {knownStats.map((stat) => (
              <span
                key={stat.label}
                className="inline-flex items-baseline gap-1.5 rounded-[13px] bg-[rgba(255,107,53,0.08)] px-2.5 py-1.5 text-[var(--text-primary)]"
              >
                <span className="text-[clamp(16px,1.8vw,20px)] font-semibold leading-none text-[var(--accent)]">
                  {stat.value}
                </span>
                <span className="text-[clamp(12px,1.3vw,13px)] text-[var(--text-secondary)]">{stat.label}</span>
              </span>
            ))}
          </div>
          <div className="mt-2 text-[clamp(11px,1.2vw,12.5px)] leading-snug text-[var(--text-tertiary)]">
            {remaining.length > 0
              ? `Ещё ${remaining.map((item) => `${item.value} ${item.label(item.value)}`).join(', ')} — и ты настоящий ${roleByCourse[courseId] ?? 'мастер'}.`
              : `Весь курс пройден — ты настоящий ${roleByCourse[courseId] ?? 'мастер'}!`}
          </div>
        </div>
      </div>
    </section>
  );
}
