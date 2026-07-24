export type LetterCellState = 'correct' | 'present' | 'absent';

export type BlocksWordLite = {
  ge: string;
  ru: string;
};

export const RECENT_WORD_GAP = 6;

const NUMBER_WORDS_RU: Record<string, number> = {
  'ноль': 0, 'один': 1, 'одна': 1, 'одно': 1, 'два': 2, 'две': 2, 'три': 3, 'четыре': 4, 'пять': 5,
  'шесть': 6, 'семь': 7, 'восемь': 8, 'девять': 9, 'десять': 10,
  'одиннадцать': 11, 'двенадцать': 12, 'тринадцать': 13, 'четырнадцать': 14,
  'пятнадцать': 15, 'шестнадцать': 16, 'семнадцать': 17, 'восемнадцать': 18,
  'девятнадцать': 19, 'двадцать': 20, 'тридцать': 30, 'сорок': 40,
  'пятьдесят': 50, 'шестьдесят': 60, 'семьдесят': 70, 'восемьдесят': 80,
  'девяносто': 90, 'сто': 100, 'двести': 200, 'триста': 300, 'четыреста': 400,
  'пятьсот': 500, 'шестьсот': 600, 'семьсот': 700, 'восемьсот': 800,
  'девятьсот': 900, 'тысяча': 1000,
};

const NUMBER_WORDS_GE: Record<string, number> = {
  'ნული': 0,
  'ერთი': 1,
  'ორი': 2,
  'სამი': 3,
  'ოთხი': 4,
  'ხუთი': 5,
  'ექვსი': 6,
  'შვიდი': 7,
  'რვა': 8,
  'ცხრა': 9,
  'ათი': 10,
  'ასი': 100,
  'ათასი': 1000,
};

const NUMBER_WORDS: Record<string, number> = {
  ...NUMBER_WORDS_RU,
  ...NUMBER_WORDS_GE,
};

const OPTIONAL_RU_WORDS = new Set(['я', 'мне', 'меня']);

function normalizeGeorgianCase(str: string) {
  return Array.from(str)
    .map(ch => {
      const code = ch.codePointAt(0);
      if (code !== undefined && code >= 0x1C90 && code <= 0x1CBF) {
        return String.fromCodePoint(code - 0xBC0);
      }
      return ch;
    })
    .join('');
}

function stripParentheticalText(str: string) {
  return str.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
}

export function normalizeRu(str: string) {
  return normalizeGeorgianCase(stripParentheticalText(str))
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е');
}

function parseNumberWordToDigits(str: string): string | null {
  const words = str
    .toLowerCase()
    .replace(/[^\p{L}\s-]/gu, ' ')
    .replace(/-+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return null;

  let result = 0;
  let temp = 0;
  let matched = false;

  for (const w of words) {
    const val = NUMBER_WORDS[w];
    if (val === undefined) {
      return null;
    }
    matched = true;

    if (val === 1000) {
      result += (temp || 1) * 1000;
      temp = 0;
    } else {
      temp += val;
    }
  }

  result += temp;
  if (!matched) return null;
  return String(result);
}

function normalizeSimpleNumberSequence(str: string): string | null {
  const tokens = normalizeRu(str)
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/-+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length < 2) return null;

  const normalizedTokens: string[] = [];

  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      normalizedTokens.push(token);
      continue;
    }

    const value = NUMBER_WORDS[token];
    if (value === undefined || value < 0 || value > 10) {
      return null;
    }

    normalizedTokens.push(String(value));
  }

  return normalizedTokens.join(' ');
}

function normalizeNumbersInText(str: string): string {
  const normalized = normalizeRu(str);
  const tokens = normalized
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/-+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) return normalized;

  const out: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (/^\d+$/.test(token)) {
      out.push(token);
      i += 1;
      continue;
    }
    if (!(token in NUMBER_WORDS)) {
      out.push(token);
      i += 1;
      continue;
    }

    let j = i;
    while (j < tokens.length && tokens[j] in NUMBER_WORDS) {
      j += 1;
    }
    const parsed = parseNumberWordToDigits(tokens.slice(i, j).join(' '));
    if (parsed !== null) {
      out.push(parsed);
      i = j;
      continue;
    }

    out.push(token);
    i += 1;
  }

  return out.join(' ');
}

function normalizeForCompare(str: string): string {
  const base = normalizeRu(str);
  return base.replace(/[^\p{L}\p{N}]+/gu, '');
}

function normalizeSentenceForCompare(str: string): string {
  return normalizeRu(str)
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeWordOrderForCompare(str: string): string | null {
  const tokens = normalizeNumbersInText(str)
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length < 2) return null;

  return tokens.sort((a, b) => a.localeCompare(b)).join(' ');
}

function normalizeMeaningfulWordOrderForCompare(str: string): string | null {
  const tokens = normalizeNumbersInText(str)
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(token => token && !OPTIONAL_RU_WORDS.has(token));

  if (tokens.length < 1) return null;

  return tokens.sort((a, b) => a.localeCompare(b)).join(' ');
}

function buildAcceptedAnswerVariants(correctAnswers: string | string[]): string[] {
  const answers = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
  const rawParts = answers.flatMap(answer => normalizeRu(answer)
    .split('/')
    .map(part => part.trim())
    .filter(Boolean));

  if (!rawParts.length) return answers;

  const variants = new Set<string>();
  rawParts.forEach(part => variants.add(part));

  if (rawParts.length > 1) {
    variants.add(rawParts.join(' '));
  }

  return Array.from(variants);
}

function tokenizeAnswerCells(str: string): string[] {
  return Array.from(normalizeRu(str).replace(/[^\p{L}\p{N}]+/gu, ''));
}

export function evaluateLetterCells(
  guessRaw: string,
  solutionRaw: string,
): Array<{ char: string; state: LetterCellState }> {
  const guess = tokenizeAnswerCells(guessRaw);
  const solution = tokenizeAnswerCells(solutionRaw);
  if (!guess.length || !solution.length) return [];

  const states: LetterCellState[] = Array(guess.length).fill('absent');
  const remaining = new Map<string, number>();
  const overlapLen = Math.min(guess.length, solution.length);

  for (let i = 0; i < overlapLen; i += 1) {
    if (guess[i] === solution[i]) {
      states[i] = 'correct';
    } else {
      const ch = solution[i];
      remaining.set(ch, (remaining.get(ch) ?? 0) + 1);
    }
  }
  for (let i = overlapLen; i < solution.length; i += 1) {
    const ch = solution[i];
    remaining.set(ch, (remaining.get(ch) ?? 0) + 1);
  }

  for (let i = 0; i < guess.length; i += 1) {
    if (states[i] === 'correct') continue;
    const ch = guess[i];
    const cnt = remaining.get(ch) ?? 0;
    if (cnt > 0) {
      states[i] = 'present';
      remaining.set(ch, cnt - 1);
    }
  }

  return guess.map((char, i) => ({ char, state: states[i] }));
}

export function isSameAnswer(userInput: string, correctAnswer: string | string[]): boolean {
  const nu = normalizeRu(userInput);

  if (!nu) return false;

  const acceptedVariants = buildAcceptedAnswerVariants(correctAnswer);

  return acceptedVariants.some(variant => {
    const nc = normalizeRu(variant);
    const userNum =
      parseNumberWordToDigits(nu) ?? (/^\d+$/.test(nu) ? nu : null);
    const correctNum =
      parseNumberWordToDigits(nc) ?? (/^\d+$/.test(nc) ? nc : null);

    if (userNum && correctNum && userNum === correctNum) {
      return true;
    }

    const cleanUser = normalizeForCompare(userInput);
    const cleanCorrect = normalizeForCompare(variant);
    if (cleanUser === cleanCorrect) return true;

    const sentenceUser = normalizeSentenceForCompare(userInput);
    const sentenceCorrect = normalizeSentenceForCompare(variant);
    if (sentenceUser === sentenceCorrect) return true;

    const unorderedUser = normalizeWordOrderForCompare(userInput);
    const unorderedCorrect = normalizeWordOrderForCompare(variant);
    if (unorderedUser && unorderedCorrect && unorderedUser === unorderedCorrect) {
      return true;
    }

    const meaningfulUser = normalizeMeaningfulWordOrderForCompare(userInput);
    const meaningfulCorrect = normalizeMeaningfulWordOrderForCompare(variant);
    if (meaningfulUser && meaningfulCorrect && meaningfulUser === meaningfulCorrect) {
      return true;
    }

    const sequenceUser = normalizeSimpleNumberSequence(userInput);
    const sequenceCorrect = normalizeSimpleNumberSequence(variant);
    if (sequenceUser && sequenceCorrect && sequenceUser === sequenceCorrect) {
      return true;
    }

    const numericUser = normalizeForCompare(normalizeNumbersInText(userInput));
    const numericCorrect = normalizeForCompare(normalizeNumbersInText(variant));
    return numericUser === numericCorrect;
  });
}

export function buildCycle(total: number, hardSet: Set<number>): number[] {
  if (total <= 0) return [];

  const base: number[] = [];
  for (let i = 0; i < total; i++) base.push(i);

  const extra: number[] = [];
  hardSet.forEach(idx => {
    if (idx >= 0 && idx < total) extra.push(idx);
  });

  const combined = [...base, ...extra];

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined;
}

export function wordKey(word: BlocksWordLite): string {
  return `${normalizeRu(word.ge)}|${normalizeRu(word.ru)}`;
}

function getRecentPenalty(
  idx: number,
  key: string,
  recentIndices: number[],
  recentKeys: string[],
): number {
  const recentIndexPosition = recentIndices.lastIndexOf(idx);
  const recentKeyPosition = recentKeys.lastIndexOf(key);
  let penalty = 0;

  if (recentIndexPosition !== -1) {
    penalty += recentIndices.length - recentIndexPosition;
  }
  if (recentKeyPosition !== -1) {
    penalty += recentKeys.length - recentKeyPosition;
  }

  return penalty;
}

export function pickNextIndexFromQueue(
  queue: number[],
  words: BlocksWordLite[],
  recentIndices: number[],
  recentKeys: string[],
): { nextIdx: number; rest: number[] } | null {
  if (!queue.length) return null;

  const recentWindow = Math.max(1, Math.min(RECENT_WORD_GAP, words.length - 1));
  const recentIdxSet = new Set(recentIndices.slice(-recentWindow));
  const recentKeySet = new Set(recentKeys.slice(-recentWindow));
  const lastKey = recentKeys[recentKeys.length - 1] ?? null;

  let pickPos = queue.findIndex(idx => {
    const w = words[idx];
    if (!w) return false;
    if (recentIdxSet.has(idx)) return false;
    if (recentKeySet.has(wordKey(w))) return false;
    return true;
  });

  if (pickPos === -1) {
    if (lastKey) {
      const nonSameAsLast = queue.findIndex(idx => {
        const w = words[idx];
        return !!w && wordKey(w) !== lastKey;
      });
      if (nonSameAsLast !== -1) {
        pickPos = nonSameAsLast;
      }
    }

    if (pickPos === -1) {
      let bestPos = 0;
      let bestScore = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < queue.length; i += 1) {
        const idx = queue[i];
        const w = words[idx];
        if (!w) continue;
        const key = wordKey(w);
        const recentPenalty = getRecentPenalty(idx, key, recentIndices, recentKeys);
        let score = -recentPenalty * 4;
        if (!recentIdxSet.has(idx)) score += 3;
        if (!recentKeySet.has(key)) score += 5;
        if (lastKey && key !== lastKey) score += 8;
        if (lastKey && key === lastKey) score -= 20;
        if (score > bestScore) {
          bestScore = score;
          bestPos = i;
        }
      }
      pickPos = bestPos;
    }
  }

  const nextIdx = queue[pickPos];
  const rest = [...queue.slice(0, pickPos), ...queue.slice(pickPos + 1)];
  return { nextIdx, rest };
}
