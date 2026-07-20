'use client';

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (url && key) ? createClient(url, key) : null;

// ===== Типы =====

export type Progress = { episodeId: string; best: number };
export type ProgressMap = Record<string, number>;
type ProgressRow = { episode_id: string; best: number };
type ProgressListener = (progressMap: ProgressMap) => void;

// ключ локального хранилища (новая версия)
const LS_KEY = 'deda_progress_v2';
const LEGACY_LS_KEYS = ['deda_progress', 'deda_progress_v1'];
const DEFAULT_EPISODE_IDS = Array.from({ length: 9 }, (_, i) => `ep${i + 1}`);
const PROGRESS_CACHE_TTL_MS = 5000;
let progressMapCache: { value: ProgressMap; at: number } | null = null;
let progressMapPromise: Promise<ProgressMap> | null = null;
const progressListeners = new Set<ProgressListener>();

export function createDefaultLocalProgress(
  episodeIds: string[] = DEFAULT_EPISODE_IDS,
): Progress[] {
  return episodeIds.map(episodeId => ({
    episodeId,
    best: 0,
  }));
}

export function mergeProgressRows(
  rows: ProgressRow[],
  initialMap: ProgressMap = {},
): ProgressMap {
  const merged = { ...initialMap };
  for (const row of rows) {
    merged[row.episode_id] = Math.max(merged[row.episode_id] ?? 0, row.best);
  }
  return merged;
}

export function normalizeProgressRow(value: unknown): ProgressRow | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  if (typeof row.episode_id !== 'string' || !row.episode_id.trim()) return null;
  const best =
    typeof row.best === 'number'
      ? row.best
      : typeof row.best === 'string'
        ? Number(row.best)
        : Number.NaN;
  if (!Number.isFinite(best)) return null;
  return {
    episode_id: row.episode_id,
    best: Math.max(0, Math.floor(best)),
  };
}

function normalizeProgress(value: unknown): Progress | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  if (typeof row.episodeId !== 'string' || !row.episodeId.trim()) return null;
  const best =
    typeof row.best === 'number'
      ? row.best
      : typeof row.best === 'string'
        ? Number(row.best)
        : Number.NaN;
  if (!Number.isFinite(best)) return null;
  return {
    episodeId: row.episodeId,
    best: Math.max(0, Math.floor(best)),
  };
}

export function normalizeProgressArray(value: unknown): Progress[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(row => {
    const normalized = normalizeProgress(row);
    return normalized ? [normalized] : [];
  });
}

function invalidateProgressCache() {
  progressMapCache = null;
}

function toProgressMap(progressRows: Progress[]): ProgressMap {
  const map: ProgressMap = {};
  for (const row of progressRows) {
    map[row.episodeId] = Math.max(map[row.episodeId] ?? 0, row.best);
  }
  return map;
}

function notifyProgressListeners(progressMap: ProgressMap) {
  const nextMap = { ...progressMap };
  for (const listener of progressListeners) {
    listener(nextMap);
  }
}

// ===== ЛОКАЛЬНЫЙ ПРОГРЕСС =====

function getLocalProgressArray(): Progress[] {
  if (typeof window === 'undefined') return [];
  try {
    return normalizeProgressArray(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));
  } catch {
    return [];
  }
}

function setLocalProgressArray(p: Progress[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_KEY, JSON.stringify(p));
}

function clearLegacyLocalProgress() {
  if (typeof window === 'undefined') return;
  for (const key of LEGACY_LS_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
}

// обновляем локальный прогресс и возвращаем новый best
export function upsertLocalProgress(episodeId: string, score: number): number {
  const p = getLocalProgressArray();
  const i = p.findIndex(x => x.episodeId === episodeId);
  if (i === -1) {
    p.push({ episodeId, best: score });
  } else {
    p[i].best = Math.max(p[i].best, score);
  }
  setLocalProgressArray(p);
  invalidateProgressCache();
  notifyProgressListeners(toProgressMap(p));

  const updated = p.find(x => x.episodeId === episodeId)!;
  return updated.best;
}

// старые функции-обёртки (на случай, если где-то используются)
export function getLocalProgress(): Progress[] {
  return getLocalProgressArray();
}
export function setLocalProgress(p: Progress[]) {
  setLocalProgressArray(p);
  invalidateProgressCache();
  notifyProgressListeners(toProgressMap(p));
}

export function getLocalProgressMap(): ProgressMap {
  return toProgressMap(getLocalProgressArray());
}

export function subscribeToProgress(listener: ProgressListener) {
  progressListeners.add(listener);
  return () => {
    progressListeners.delete(listener);
  };
}

// ===== РАБОТА С SUPABASE =====

// загружаем прогресс: локальный + серверный, берём максимум,
// при необходимости докидываем более высокий локальный прогресс на сервер
export async function loadProgressMap(): Promise<ProgressMap> {
  // 1) локальный
  const localArr = getLocalProgressArray();
  const map: ProgressMap = {};
  for (const row of localArr) {
    map[row.episodeId] = Math.max(map[row.episodeId] ?? 0, row.best);
  }

  // 2) если нет supabase — всё, выходим
  if (!supabase) return map;

  // 3) берём текущего пользователя
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return map;
  }
  const user = userData.user;

  // 4) грузим прогресс с сервера
  const { data: rows, error } = await supabase
    .from('progress')
    .select('episode_id, best')
    .eq('user_id', user.id);

  if (error || !rows) {
    console.error('load progress error', error);
    return map;
  }

  // 5) сливаем: берём максимум по каждой паре (episodeId)
  const typedRows = Array.isArray(rows)
    ? rows.flatMap(row => {
        const normalized = normalizeProgressRow(row);
        return normalized ? [normalized] : [];
      })
    : [];
  const serverMap = mergeProgressRows(typedRows);
  const mergedMap = mergeProgressRows(typedRows, map);
  Object.assign(map, mergedMap);

  // 6) если локально где-то лучше, чем на сервере — отправляем апдейт
  const toUpsert: { user_id: string; episode_id: string; best: number }[] = [];
  for (const [ep, best] of Object.entries(map)) {
    const serverBest = serverMap[ep] ?? 0;
    if (best > serverBest) {
      toUpsert.push({ user_id: user.id, episode_id: ep, best });
    }
  }

  if (toUpsert.length) {
    const { error: upErr } = await supabase
      .from('progress')
      .upsert(toUpsert, { onConflict: 'user_id,episode_id' });
    if (upErr) console.error('upsert merged progress error', upErr);
  }

  return map;
}

export async function loadProgressMapCached(forceRefresh = false): Promise<ProgressMap> {
  const now = Date.now();
  if (
    !forceRefresh &&
    progressMapCache &&
    now - progressMapCache.at < PROGRESS_CACHE_TTL_MS
  ) {
    return { ...progressMapCache.value };
  }

  if (!forceRefresh && progressMapPromise) {
    return progressMapPromise;
  }

  progressMapPromise = (async () => {
    const map = await loadProgressMap();
    progressMapCache = { value: map, at: Date.now() };
    notifyProgressListeners(map);
    return map;
  })();

  try {
    return await progressMapPromise;
  } finally {
    progressMapPromise = null;
  }
}

// универсальный апдейт прогресса: сначала локально, потом (если есть юзер) на сервер
export async function upsertProgress(episodeId: string, score: number) {
  const best = upsertLocalProgress(episodeId, score);
  invalidateProgressCache();

  if (!supabase) return;

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return;

  const user = userData.user;

  const { error } = await supabase
    .from('progress')
    .upsert(
      {
        user_id: user.id,
        episode_id: episodeId,
        best,
      },
      { onConflict: 'user_id,episode_id' },
    );

  if (error) {
    console.error('upsert progress error', error);
  }
}

// сброс прогресса: локально всегда, на сервере — если есть авторизованный пользователь
export async function resetProgress() {
  // Перезаписываем локально дефолтные значения (все уроки = 0).
  const defaultLocalProgress = createDefaultLocalProgress();
  setLocalProgressArray(defaultLocalProgress);
  clearLegacyLocalProgress();
  invalidateProgressCache();

  // Если backend не подключен — достаточно локального сброса.
  if (!supabase) {
    notifyProgressListeners(toProgressMap(defaultLocalProgress));
    return;
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    notifyProgressListeners(toProgressMap(defaultLocalProgress));
    return;
  }

  const { error: deleteError } = await supabase
    .from('progress')
    .delete()
    .eq('user_id', userData.user.id);

  if (deleteError) {
    console.error('reset progress delete error', deleteError);
  }

  // Жёсткая перезапись дефолта на сервере (на случай, если delete заблокирован политиками).
  const toUpsert = DEFAULT_EPISODE_IDS.map(episodeId => ({
    user_id: userData.user.id,
    episode_id: episodeId,
    best: 0,
  }));
  const { error: upsertError } = await supabase
    .from('progress')
    .upsert(toUpsert, { onConflict: 'user_id,episode_id' });

  if (upsertError) {
    console.error('reset progress upsert error', upsertError);
  }

  // Обновляем UI только после попытки серверного удаления,
  // чтобы не успевали вернуться старые значения.
  notifyProgressListeners(toProgressMap(defaultLocalProgress));
}
