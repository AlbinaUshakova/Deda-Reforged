type LessonCard = {
  ge_text: string;
};

function getLessonLettersInText(text: string, lessonLetters: Set<string>) {
  const found = new Set<string>();

  for (const ch of Array.from(String(text || ''))) {
    if (lessonLetters.has(ch)) found.add(ch);
  }

  return found;
}

function isPhrase(text: string) {
  return /\s/.test(String(text || '').trim());
}

export function orderLessonCardsByLetterProgression<T extends LessonCard>(
  cards: T[],
  letters?: string[],
) {
  if (!Array.isArray(cards) || cards.length <= 1 || !Array.isArray(letters) || letters.length === 0) {
    return cards;
  }

  // Урок написан «воронкой» (фразы вплетены между словами, слов больше, чем фраз)
  // — уважаем авторский порядок и не выносим фразы в конец.
  const phraseCount = cards.filter((card) => isPhrase(card.ge_text)).length;
  const wordCount = cards.length - phraseCount;
  const interleaved = cards.some(
    (card, i) => isPhrase(card.ge_text) && cards.slice(i + 1).some((next) => !isPhrase(next.ge_text)),
  );
  if (interleaved && wordCount > phraseCount) {
    return cards;
  }

  const lessonLetters = new Set(letters);
  const letterToIndex = new Map(letters.map((letter, index) => [letter, index]));
  const wordEntries: Array<{ card: T }> = [];
  const phraseEntries: Array<{ card: T }> = [];

  cards.forEach((card) => {
    (isPhrase(card.ge_text) ? phraseEntries : wordEntries).push({ card });
  });

  const sortableCards = wordEntries.map(entry => entry.card);
  const ordered: T[] = [];
  const used = new Set<number>();

  const meta = sortableCards.map(card => {
    const presentLetters = getLessonLettersInText(card.ge_text, lessonLetters);
    const sortedIndexes = Array.from(presentLetters)
      .map(letter => letterToIndex.get(letter))
      .filter((index): index is number => typeof index === 'number')
      .sort((a, b) => a - b);

    return {
      card,
      singleIndex: sortedIndexes.length === 1 ? sortedIndexes[0] : null,
      maxIndex: sortedIndexes.length > 0 ? sortedIndexes[sortedIndexes.length - 1] : null,
    };
  });

  for (let currentIndex = 0; currentIndex < letters.length; currentIndex += 1) {
    meta.forEach((entry, cardIndex) => {
      if (used.has(cardIndex)) return;
      if (entry.singleIndex !== currentIndex) return;
      ordered.push(entry.card);
      used.add(cardIndex);
    });

    meta.forEach((entry, cardIndex) => {
      if (used.has(cardIndex)) return;
      if (entry.maxIndex !== currentIndex) return;
      ordered.push(entry.card);
      used.add(cardIndex);
    });
  }

  meta.forEach((entry, cardIndex) => {
    if (used.has(cardIndex)) return;
    ordered.push(entry.card);
  });

  return ordered.concat(phraseEntries.map(entry => entry.card));
}
