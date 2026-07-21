import staticEpisodes from '../public/content/episodes.json' with { type: 'json' };
import ep1Json from '../public/content/ka_ru_ep1.json' with { type: 'json' };
import ep2Json from '../public/content/ka_ru_ep2.json' with { type: 'json' };
import ep3Json from '../public/content/ka_ru_ep3.json' with { type: 'json' };
import ep4Json from '../public/content/ka_ru_ep4.json' with { type: 'json' };
import ep5Json from '../public/content/ka_ru_ep5.json' with { type: 'json' };
import ep6Json from '../public/content/ka_ru_ep6.json' with { type: 'json' };
import ep7Json from '../public/content/ka_ru_ep7.json' with { type: 'json' };
import ep8Json from '../public/content/ka_ru_ep8.json' with { type: 'json' };
import ep9Json from '../public/content/ka_ru_ep9.json' with { type: 'json' };

export type CardInfoNote = {
  kind: 'grammar' | 'speech' | 'mistake';
  text: string;
};

export type EpisodeCard = {
  type: 'word' | 'phrase' | 'letter';
  ge_text: string;
  ru_meaning: string;
  accepted_ru?: string[];
  accepted_ge?: string[];
  info_notes?: CardInfoNote[];
  audio_url?: string;
  topic?: string;
  playable?: boolean;
};

export type Episode = {
  id: string;
  title: string;
  cards: EpisodeCard[];
  letters?: string[];
};

export type EpisodesListItem = { id: string; title: string; best?: number };

type RawEpisode = {
  id: string;
  title: string;
  letters?: string[];
  cards: EpisodeCard[];
};

const RAW_EPISODES: RawEpisode[] = [
  ep1Json as RawEpisode,
  ep2Json as RawEpisode,
  ep3Json as RawEpisode,
  ep4Json as RawEpisode,
  ep5Json as RawEpisode,
  ep6Json as RawEpisode,
  ep7Json as RawEpisode,
  ep8Json as RawEpisode,
  ep9Json as RawEpisode,
];

const RAW_BY_ID: Record<string, RawEpisode> = Object.fromEntries(
  RAW_EPISODES.map((episode) => [episode.id, episode]),
);

export const STATIC_EPISODES_FALLBACK: EpisodesListItem[] = (
  staticEpisodes as Array<{ id: string; title: string }>
).map((episode) => ({
  id: episode.id,
  title: episode.title,
})).concat([
  { id: 'favorites', title: '⭐ Избранное' },
  { id: 'all', title: 'Все уроки' },
  { id: 'phrases', title: 'Разговорные фразы' },
]);

function phrase(
  ge_text: string,
  ru_meaning: string,
  note?: string,
  accepted_ru?: string[],
  playable?: boolean,
): EpisodeCard {
  return {
    type: 'word',
    ge_text,
    ru_meaning,
    ...(accepted_ru?.length ? { accepted_ru } : {}),
    ...(note ? { info_notes: [{ kind: 'grammar' as const, text: note }] } : {}),
    ...(playable === false ? { playable: false } : {}),
  };
}

export const PHRASES_EPISODE: Episode = {
  id: 'phrases',
  title: 'Разговорные фразы',
  cards: [
    phrase('გამარჯობა', 'Здравствуйте', undefined, ['Привет', 'Добрый день']),
    phrase('სალამი', 'Привет'),
    phrase('დილა მშვიდობისა', 'Доброе утро'),
    phrase('საღამო მშვიდობისა', 'Добрый вечер'),
    phrase('ღამე მშვიდობისა', 'Спокойной ночи'),
    phrase('ნახვამდის', 'До свидания'),
    phrase('კარგად', 'Пока'),
    phrase('მადლობა', 'Спасибо', undefined, ['Благодарю']),
    phrase('გმადლობთ', 'Спасибо', 'Вежливо → лучше с незнакомыми людьми.', ['Благодарю']),
    phrase('დიდი მადლობა', 'Большое спасибо', undefined, ['Спасибо большое']),
    phrase('არაფრის', 'Не за что'),
    phrase('ბოდიში', 'Извините', undefined, ['Простите', 'Извини', 'Прости']),
    phrase('უკაცრავად', 'Извините', 'Удобно, когда нужно привлечь внимание или пройти.', ['Простите']),
    phrase('მაპატიეთ', 'Простите', undefined, ['Извините']),
    phrase('თუ შეიძლება', 'Пожалуйста', undefined, ['Если можно']),
    phrase('კი', 'Да'),
    phrase('დიახ', 'Да', 'Вежливо → более формальное “да”.'),
    phrase('არა', 'Нет'),
    phrase('კარგი', 'Хорошо', undefined, ['Ладно', 'Ок', 'Окей']),
    phrase('კარგია', 'Хорошо', undefined, ['Это хорошо', 'Нормально']),
    phrase('ცუდია', 'Плохо', undefined, ['Это плохо']),
    phrase('არაუშავს', 'Ничего страшного', undefined, ['Все нормально', 'Ничего', 'Все хорошо']),
    phrase('რა თქმა უნდა', 'Конечно', undefined, ['Разумеется']),
    phrase('პრობლემა არ არის', 'Нет проблем', undefined, ['Без проблем']),
    phrase('მართალია', 'Правильно', undefined, ['Верно']),
    phrase('არ ვიცი', 'Я не знаю', undefined, ['Не знаю']),
    phrase('ვიცი', 'Я знаю', undefined, ['Знаю']),
    phrase('მესმის', 'Я понимаю', undefined, ['Понимаю']),
    phrase('არ მესმის', 'Я не понимаю', undefined, ['Не понимаю']),
    phrase('ვერ გავიგე', 'Я не понял', undefined, ['Не понял', 'Не поняла', 'Я не поняла']),
    phrase('გაიმეორეთ', 'Повторите', undefined, ['Повторите пожалуйста']),
    phrase('ნელა', 'Медленно', undefined, ['Помедленнее']),
    phrase('ცოტა', 'Немного'),
    phrase('ბევრი', 'Много'),
    phrase('როგორ ხარ?', 'Как дела?', 'Неформально → одному человеку на “ты”.', ['Как ты']),
    phrase('კარგად ვარ', 'У меня всё хорошо', undefined, ['Все хорошо', 'Хорошо']),
    phrase('ცუდად ვარ', 'Мне плохо'),
    phrase('ასე რა', 'Так себе'),
    phrase('შენ?', 'А ты?'),
    phrase('თქვენ?', 'А вы?'),
    phrase('რა გქვია?', 'Как тебя зовут?', undefined, ['Как зовут?']),
    phrase('მე მქვია ...', 'Меня зовут ...', undefined, undefined, false),
    phrase('სასიამოვნოა', 'Приятно познакомиться'),
    phrase('საიდან ხარ?', 'Ты откуда?', undefined, ['Откуда ты?']),
    phrase('საიდან ხართ?', 'Вы откуда?', undefined, ['Откуда вы?']),
    phrase('მე ...დან ვარ', 'Я из ...', 'Грамматика → -დან значит “из/откуда”.', undefined, false),
    phrase('ქართული იცი?', 'Ты знаешь грузинский?'),
    phrase('რუსული იცი?', 'Ты знаешь русский?'),
    phrase('ინგლისური იცი?', 'Ты знаешь английский?'),
    phrase('ცოტა ვიცი', 'Я немного знаю', undefined, ['Немного знаю']),
    phrase('ეს რა არის?', 'Что это?'),
    phrase('ეს ვინ არის?', 'Кто это?'),
    phrase('რას ნიშნავს?', 'Что это значит?'),
    phrase('ქართულად როგორ არის?', 'Как это по-грузински?'),
    phrase('დახმარება მჭირდება', 'Мне нужна помощь', undefined, ['Нужна помощь']),
    phrase('დამეხმარეთ', 'Помогите', undefined, ['Помогите пожалуйста']),
    phrase('სად არის?', 'Где это?'),
    phrase('აქ', 'Здесь'),
    phrase('იქ', 'Там'),
    phrase('ახლოს', 'Близко'),
    phrase('შორს', 'Далеко'),
    phrase('მარჯვნივ', 'Направо'),
    phrase('მარცხნივ', 'Налево'),
    phrase('პირდაპირ', 'Прямо'),
    phrase('აქ გააჩერეთ', 'Остановите здесь'),
    phrase('ტაქსი მინდა', 'Мне нужно такси', undefined, ['Нужно такси', 'Я хочу такси']),
    phrase('მეტრო სად არის?', 'Где метро?'),
    phrase('ტუალეტი სად არის?', 'Где туалет?'),
    phrase('აფთიაქი სად არის?', 'Где аптека?'),
    phrase('ექიმი მჭირდება', 'Мне нужен врач', undefined, ['Нужен врач']),
    phrase('სასწრაფო გამოიძახეთ', 'Вызовите скорую'),
    phrase('დავიკარგე', 'Я потерялся', undefined, ['Я потерялась', 'Я заблудился', 'Я заблудилась']),
    phrase('რამდენი ღირს?', 'Сколько стоит?'),
    phrase('ძვირია', 'Дорого'),
    phrase('იაფია', 'Дёшево', undefined, ['Дешево']),
    phrase('ბარათით შეიძლება?', 'Можно картой?', undefined, ['Оплата картой?']),
    phrase('ნაღდი მაქვს', 'У меня есть наличные', undefined, ['Есть наличные']),
    phrase('ქვითარი მინდა', 'Мне нужен чек', undefined, ['Нужен чек', 'Дайте чек', 'Чек пожалуйста']),
    phrase('ეს მინდა', 'Я хочу это', undefined, ['Хочу это']),
    phrase('ეს არ მინდა', 'Я не хочу это', undefined, ['Не хочу это']),
    phrase('მინდა', 'Хочу'),
    phrase('არ მინდა', 'Не хочу'),
    phrase('მჭირდება', 'Мне нужно', undefined, ['Нужно']),
    phrase('მაქვს', 'У меня есть', undefined, ['Есть']),
    phrase('არ მაქვს', 'У меня нет', undefined, ['Нет']),
    phrase('გაქვთ?', 'У вас есть?'),
    phrase('წყალი მინდა', 'Я хочу воды', undefined, ['Хочу воды', 'Мне воды']),
    phrase('ყავა მინდა', 'Я хочу кофе', undefined, ['Хочу кофе', 'Мне кофе']),
    phrase('ჩაი მინდა', 'Я хочу чай', undefined, ['Хочу чай', 'Мне чай']),
    phrase('პური მინდა', 'Я хочу хлеб', undefined, ['Хочу хлеб', 'Мне хлеб']),
    phrase('მენიუ, თუ შეიძლება', 'Меню, пожалуйста'),
    phrase('ანგარიში, თუ შეიძლება', 'Счёт, пожалуйста'),
    phrase('გემრიელია', 'Вкусно'),
    phrase('ცხარეა?', 'Остро?'),
    phrase('მარილი გაქვთ?', 'У вас есть соль?'),
    phrase('უშაქროდ', 'Без сахара'),
    phrase('რძით', 'С молоком'),
    phrase('მშია', 'Я голоден', undefined, ['Я голодна', 'Хочу есть']),
    phrase('მწყურია', 'Я хочу пить', undefined, ['Хочу пить', 'Мне хочется пить']),
    phrase('რომელი საათია?', 'Который час?'),
  ],
};

export function normalizeGeorgianText(text: string): string {
  if (!text) return text;
  if (/[\u10D0-\u10FF]/.test(text)) {
    return text.replace(/и/g, 'ი').replace(/И/g, 'ი');
  }
  return text;
}

function normalizeAcceptedAnswers(value: string[] | undefined): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const seen = new Set<string>();
  const answers = value.flatMap((answer) => {
    const trimmed = answer.trim();
    if (!trimmed) return [];
    const key = trimmed.toLocaleLowerCase('ru-RU');
    if (seen.has(key)) return [];
    seen.add(key);
    return [trimmed];
  });
  return answers.length ? answers : undefined;
}

function getGeneratedRussianAnswers(card: EpisodeCard): string[] {
  const meaning = card.ru_meaning.trim();
  const normalizedMeaning = meaning.toLocaleLowerCase('ru-RU');
  const variants: string[] = [];

  if (normalizedMeaning.startsWith('у меня есть ')) {
    variants.push(`есть ${meaning.slice('у меня есть '.length)}`);
  }

  if (normalizedMeaning.startsWith('да, у меня есть ')) {
    variants.push(`да есть ${meaning.slice('да, у меня есть '.length)}`);
  }

  if (normalizedMeaning.startsWith('я хочу ')) {
    variants.push(`хочу ${meaning.slice('я хочу '.length)}`);
  }

  if (normalizedMeaning.startsWith('я не хочу ')) {
    variants.push(`не хочу ${meaning.slice('я не хочу '.length)}`);
  }

  ['мне нужен ', 'мне нужна ', 'мне нужно ', 'мне нужны '].forEach((prefix) => {
    if (normalizedMeaning.startsWith(prefix)) {
      variants.push(meaning.slice('мне '.length));
    }
  });

  ['да, мне нужен ', 'да, мне нужна ', 'да, мне нужно ', 'да, мне нужны '].forEach((prefix) => {
    if (normalizedMeaning.startsWith(prefix)) {
      variants.push(`да ${meaning.slice('да, мне '.length)}`);
    }
  });

  return variants;
}

export function normalizeEpisode(episode: Episode): Episode {
  return {
    ...episode,
    cards: episode.cards.map((card) => {
      const acceptedRu = normalizeAcceptedAnswers([
        ...(card.accepted_ru ?? []),
        ...getGeneratedRussianAnswers(card),
      ]);
      const acceptedGe = normalizeAcceptedAnswers(card.accepted_ge);
      return {
        ...card,
        ge_text: normalizeGeorgianText(card.ge_text),
        ...(acceptedRu ? { accepted_ru: acceptedRu } : {}),
        ...(acceptedGe ? { accepted_ge: acceptedGe } : {}),
      };
    }),
  };
}

export function loadSingleStaticEpisode(id: string): Episode | null {
  const raw = RAW_BY_ID[id];
  if (!raw) return null;

  return normalizeEpisode({
    id: raw.id,
    title: raw.title,
    letters: raw.letters,
    cards: raw.cards.map((card) => ({ ...card })),
  });
}

export function listStaticEpisodeIds(): string[] {
  return RAW_EPISODES
    .map((episode) => episode.id)
    .filter((id): id is string => /^ep\d+$/.test(id))
    .sort((a, b) => Number(a.replace('ep', '')) - Number(b.replace('ep', '')));
}

export function buildLettersByEpisode(
  episodes: Array<Pick<Episode, 'id' | 'letters' | 'cards'>>,
): Record<string, string[]> {
  const isGeorgianLetter = (character: string) => /[\u10D0-\u10FF]/.test(character);
  const seen = new Set<string>();
  const result: Record<string, string[]> = {};

  for (const episode of episodes) {
    if (Array.isArray(episode.letters) && episode.letters.length > 0) {
      result[episode.id] = episode.letters;
      episode.letters.forEach((character) => seen.add(character));
      continue;
    }

    const local = new Set<string>();

    for (const card of episode.cards) {
      for (const character of String(card.ge_text ?? '')) {
        if (!isGeorgianLetter(character)) continue;
        if (!seen.has(character)) {
          local.add(character);
        }
      }
    }

    const letters = Array.from(local).sort((a, b) => a.localeCompare(b, 'ka'));
    result[episode.id] = letters;
    letters.forEach((character) => seen.add(character));
  }

  return result;
}

export function getStaticLettersByEpisode(): Record<string, string[]> {
  const episodes = listStaticEpisodeIds()
    .map((id) => loadSingleStaticEpisode(id))
    .filter((episode): episode is Episode => episode !== null);

  return buildLettersByEpisode(episodes);
}
