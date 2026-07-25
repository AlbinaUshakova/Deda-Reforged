'use client';
import { useEffect, useMemo, useState } from 'react';

type Word = { ge: string; ru: string; audio?: string };

function shuffle<T>(arr: T[]): T[] { const a = arr.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

type Tile = { id: string; text: string; kind: 'term'|'def'; wordIdx: number; matched: boolean };

export default function MatchGame({ words }: { words: Word[] }) {
  const [round, setRound] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [sel, setSel] = useState<number[]>([]);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [time, setTime] = useState<number>(0);
  const [penalty, setPenalty] = useState<number>(0);
  const [finished, setFinished] = useState(false);

  const roundWords = useMemo(() => {
    const start = (round * 6) % Math.max(words.length, 6);
    const pool = words.slice();
    const picked = [];
    for (let i = 0; i < Math.min(6, words.length); i++) picked.push(pool[(start + i) % words.length]);
    return picked;
  }, [round, words]);

  useEffect(() => {
    const t: Tile[] = [];
    roundWords.forEach((w, idx) => {
      t.push({ id: `t${idx}`, text: w.ge, kind: 'term', wordIdx: idx, matched: false });
      t.push({ id: `d${idx}`, text: w.ru, kind: 'def', wordIdx: idx, matched: false });
    });
    setTiles(shuffle(t));
    setSel([]);
    setTime(0);
    setPenalty(0);
    setFinished(false);
    setStartAt(performance.now());
  }, [round, roundWords]);

  useEffect(() => {
    if (startAt === null || finished) return;
    const raf = requestAnimationFrame(function step(now){ 
      setTime((now - (startAt||now))/1000); 
      if (!finished) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [startAt, finished]);

  const onPick = (i: number) => {
    if (finished) return;
    if (tiles[i].matched) return;
    if (sel.length === 0) { setSel([i]); return; }
    if (sel.length === 1) {
      const j = sel[0];
      if (i === j) return;
      const a = tiles[j], b = tiles[i];
      if (a.wordIdx === b.wordIdx && a.kind !== b.kind) {
        const next = tiles.slice();
        next[i] = { ...b, matched: true };
        next[j] = { ...a, matched: true };
        setTiles(next);
        setSel([]);
        if (next.every(t => t.matched)) setFinished(true);
      } else {
        setPenalty(p => p + 1);
        setSel([]);
      }
    }
  };

  const total = Math.max(0, time + penalty);
  const pill = 'rounded-full border border-[var(--progress-bg)] bg-black/5 px-2 py-0.5 text-xs font-semibold text-[var(--text-primary)]';
  return (
    <div className="space-y-4 text-[var(--text-primary)]">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--text-secondary)]">Раунд: {round+1}</div>
        <div className="text-sm text-[var(--text-secondary)]">Время: <span className={pill}>{total.toFixed(1)}s</span> (+{penalty}s)</div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {tiles.map((t, i) => (
          <button key={t.id} onClick={()=>onPick(i)}
            className={`rounded-2xl border border-[var(--progress-bg)] bg-[var(--surface,rgba(255,255,255,0.9))] p-3 text-center transition ${t.matched ? 'opacity-60' : 'hover:bg-black/5'} ${sel.includes(i) ? 'ring-2 ring-[var(--accent)]' : ''}`}>
            <div className="text-sm">{t.text}</div>
          </button>
        ))}
      </div>
      {finished ? (
        <div className="rounded-2xl border border-[var(--progress-bg)] bg-[var(--surface,rgba(255,255,255,0.9))] p-4">
          <div className="mb-2">Раунд завершён! Время: <span className={pill}>{total.toFixed(1)}s</span></div>
          <button
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-4 py-2 font-semibold text-white transition hover:brightness-105 active:scale-95"
            onClick={()=>setRound(r=>r+1)}
          >
            Следующий раунд
          </button>
        </div>
      ) : (
        <div className="text-xs text-[var(--text-tertiary)]">Совмести грузинское слово с переводом. За ошибку +1 секунда.</div>
      )}
    </div>
  );
}
