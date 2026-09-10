export type SpecialEpisodeKind = 'favorites' | 'all' | 'phrases' | 'custom' | null;

export function getSpecialEpisodeKind(episodeId: string): SpecialEpisodeKind {
  if (episodeId === 'favorites') return 'favorites';
  if (episodeId === 'all') return 'all';
  if (episodeId === 'phrases') return 'phrases';
  if (episodeId === 'custom') return 'custom';
  return null;
}

export function getSpecialEpisodeLabel(
  kind: SpecialEpisodeKind,
  interfaceLanguage: 'ru' | 'en',
): string | undefined {
  if (kind === 'favorites') {
    return interfaceLanguage === 'en' ? 'Saved words' : 'Сохраненные слова';
  }
  if (kind === 'all') {
    return interfaceLanguage === 'en' ? 'Review deck' : 'Повторение';
  }
  if (kind === 'phrases') {
    return interfaceLanguage === 'en' ? 'Phrase pack' : 'Набор фраз';
  }
  if (kind === 'custom') {
    return interfaceLanguage === 'en' ? 'My cards' : 'Мои карточки';
  }
  return undefined;
}

export function getSpecialStudyCopy(
  kind: SpecialEpisodeKind,
  interfaceLanguage: 'ru' | 'en',
): string | undefined {
  if (kind === 'favorites') {
    return interfaceLanguage === 'en'
      ? 'All words marked with a star in one deck.'
      : 'Все отмеченные звездой слова в одной колоде.';
  }
  if (kind === 'all') {
    return interfaceLanguage === 'en'
      ? 'A mixed course deck with difficult words first.'
      : 'Смешанная колода курса: сложные слова идут первыми.';
  }
  if (kind === 'phrases') {
    return interfaceLanguage === 'en'
      ? 'Short ready-made phrases for quick speaking review.'
      : 'Короткие готовые фразы для быстрого повторения перед разговорной практикой.';
  }
  if (kind === 'custom') {
    return interfaceLanguage === 'en'
      ? 'A personal deck with the words you added.'
      : 'Личная колода со словами, которые ты добавила.';
  }
  return undefined;
}

export function getSpecialPlayCopy(
  kind: SpecialEpisodeKind,
  interfaceLanguage: 'ru' | 'en',
): string | undefined {
  if (kind === 'favorites') {
    return interfaceLanguage === 'en'
      ? 'Practice only your saved words here.'
      : 'Тренируй здесь только сохраненные слова.';
  }
  if (kind === 'all') {
    return interfaceLanguage === 'en'
      ? 'Practice difficult words first, then review the rest.'
      : 'Сначала сложные слова, затем остальная колода.';
  }
  if (kind === 'phrases') {
    return interfaceLanguage === 'en'
      ? 'Practice ready-made phrases for quick speaking recall.'
      : 'Быстрая тренировка готовых речевых фраз.';
  }
  if (kind === 'custom') {
    return interfaceLanguage === 'en'
      ? 'Practice the words from your personal deck.'
      : 'Тренируй слова из своей личной колоды.';
  }
  return undefined;
}

export function getSpecialPlayEmptyState(
  kind: SpecialEpisodeKind,
  interfaceLanguage: 'ru' | 'en',
): string | undefined {
  if (kind === 'favorites') {
    return interfaceLanguage === 'en'
      ? 'No saved words to practice yet.'
      : 'Пока нет сохраненных слов для игры.';
  }
  if (kind === 'phrases') {
    return interfaceLanguage === 'en'
      ? 'No phrase cards for practice yet.'
      : 'Пока нет фраз для игры.';
  }
  if (kind === 'all') {
    return interfaceLanguage === 'en'
      ? 'No review cards for practice yet.'
      : 'Пока нет карточек для повторения в игре.';
  }
  if (kind === 'custom') {
    return interfaceLanguage === 'en'
      ? 'Add cards to your personal deck before starting practice.'
      : 'Сначала добавь карточки в личную колоду.';
  }
  return undefined;
}

export function getSpecialEmptyState(
  kind: SpecialEpisodeKind,
  interfaceLanguage: 'ru' | 'en',
): string | undefined {
  if (kind === 'favorites') {
    return interfaceLanguage === 'en'
      ? 'No saved words yet. Open any lesson and save words with the star.'
      : 'Пока нет сохраненных слов. Открой любой урок и нажимай на звезду у слов, которые хочешь сохранить.';
  }
  if (kind === 'phrases') {
    return interfaceLanguage === 'en'
      ? 'No phrase cards here yet.'
      : 'Здесь пока нет карточек с фразами.';
  }
  if (kind === 'all') {
    return interfaceLanguage === 'en'
      ? 'No review cards here yet.'
      : 'Здесь пока нет карточек для повторения.';
  }
  if (kind === 'custom') {
    return interfaceLanguage === 'en'
      ? 'Your deck is empty. Add the first card.'
      : 'Личная колода пока пуста. Добавь первую карточку.';
  }
  return undefined;
}

export function getSpecialDeckHint(
  kind: SpecialEpisodeKind,
  flipped: boolean,
  isLastCard: boolean,
  interfaceLanguage: 'ru' | 'en',
): string | undefined {
  if (flipped) {
    if (isLastCard) {
      if (kind === 'phrases') {
        return interfaceLanguage === 'en'
          ? 'Finish this phrase, then open practice.'
          : 'Закончи эту фразу и переходи к практике.';
      }
      return interfaceLanguage === 'en'
        ? 'Finish this card, then open practice.'
        : 'Закончи эту карточку и переходи к практике.';
    }

    if (kind === 'phrases') {
      return interfaceLanguage === 'en'
        ? 'Move to the next phrase.'
        : 'Переходи к следующей фразе.';
    }

    return interfaceLanguage === 'en'
      ? 'Go to the next saved word.'
      : 'Переходи к следующей сохраненной карточке.';
  }

  if (kind === 'phrases') {
    return interfaceLanguage === 'en'
      ? 'Read the phrase aloud, then flip the card.'
      : 'Сначала прочитай фразу вслух, потом переверни карточку.';
  }

  if (kind === 'favorites') {
    return interfaceLanguage === 'en'
      ? 'Read the saved word first, then flip it.'
      : 'Сначала прочитай сохраненное слово, потом переверни карточку.';
  }

  if (kind === 'all') {
    return interfaceLanguage === 'en'
      ? 'Read the card first, then flip it.'
      : 'Сначала прочитай карточку, потом переверни ее.';
  }

  if (kind === 'custom') {
    return interfaceLanguage === 'en'
      ? 'Read your word first, then flip the card.'
      : 'Сначала прочитай свое слово, потом переверни карточку.';
  }

  return undefined;
}
