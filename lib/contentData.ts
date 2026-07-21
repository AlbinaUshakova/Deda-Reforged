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
    phrase('გამარჯობა', 'Здравствуйте / привет', undefined, ['Добрый день']),
    phrase('დილა მშვიდობისა', 'Доброе утро'),
    phrase('საღამო მშვიდობისა', 'Добрый вечер'),
    phrase('ღამე მშვიდობისა', 'Спокойной ночи'),
    phrase('ნახვამდის', 'До свидания'),
    phrase('მალე გნახავ', 'Скоро увидимся'),
    phrase('შევხვდებით', 'Увидимся'),
    phrase('კარგად იყავი', 'Пока / будь здоров', 'Неформально → одному человеку на “ты”.', ['Будь здорова']),
    phrase('კარგად ბრძანდებოდეთ', 'До свидания / всего доброго', 'Вежливо → одному человеку или группе на “вы”.', ['До свидания', 'Всего доброго']),
    phrase('მადლობა', 'Спасибо', undefined, ['Благодарю']),
    phrase('გმადლობთ', 'Спасибо', 'Вежливо → лучше с незнакомыми людьми.', ['Благодарю']),
    phrase('დიდი მადლობა', 'Большое спасибо', undefined, ['Огромное спасибо', 'Спасибо большое']),
    phrase('მადლობა დახმარებისთვის', 'Спасибо за помощь', undefined, ['Благодарю за помощь']),
    phrase('არაფრის', 'Не за что'),
    phrase('ბოდიში', 'Извините / простите', undefined, ['Извини', 'Прости']),
    phrase('უკაცრავად', 'Извините / простите', 'Удобно, когда нужно привлечь внимание или пройти.', ['Извини', 'Прости']),
    phrase('მაპატიეთ', 'Простите', undefined, ['Извините', 'Извини', 'Прости']),
    phrase('არაუშავს', 'Ничего страшного / всё нормально', undefined, ['Ничего', 'Все хорошо', 'Нормально']),
    phrase('თუ შეიძლება', 'Пожалуйста / если можно'),
    phrase('კი', 'Да'),
    phrase('დიახ', 'Да', 'Вежливо → более формальное “да”.'),
    phrase('არა', 'Нет'),
    phrase('კარგი', 'Хорошо / ладно', undefined, ['Ок', 'Окей']),
    phrase('კარგია', 'Хорошо / это хорошо', undefined, ['Нормально', 'Это нормально']),
    phrase('რა თქმა უნდა', 'Конечно', undefined, ['Разумеется']),
    phrase('პრობლემა არ არის', 'Нет проблем', undefined, ['Без проблем']),
    phrase('არ ვიცი', 'Я не знаю', undefined, ['Не знаю']),
    phrase('მესმის', 'Я понимаю', undefined, ['Понимаю']),
    phrase('არ მესმის', 'Я не понимаю', undefined, ['Не понимаю']),
    phrase('გასაგებია', 'Понятно'),
    phrase('ვერ გავიგე', 'Я не понял', undefined, ['Не понял', 'Не поняла', 'Я не поняла']),
    phrase('გაიმეორეთ, თუ შეიძლება', 'Повторите, пожалуйста'),
    phrase('ნელა, თუ შეიძლება', 'Помедленнее, пожалуйста'),
    phrase('როგორ ხარ?', 'Как дела?', 'Неформально → одному человеку на “ты”.', ['Как ты']),
    phrase('როგორ ხართ?', 'Как дела?', 'Вежливо → одному человеку или группе на “вы”.', ['Как вы']),
    phrase('კარგად ვარ', 'У меня всё хорошо', undefined, ['Все хорошо', 'Хорошо']),
    phrase('ცუდად არ ვარ', 'Неплохо'),
    phrase('ასე რა', 'Так себе'),
    phrase('შენ როგორ ხარ?', 'А у тебя как дела?'),
    phrase('თქვენ როგორ ხართ?', 'А у вас как дела?'),
    phrase('რა გქვია?', 'Как тебя зовут?', undefined, ['Как зовут?', 'Твое имя?']),
    phrase('რა გქვიათ?', 'Как вас зовут?', undefined, ['Как зовут?', 'Ваше имя?']),
    phrase('მე მქვია ...', 'Меня зовут ...', undefined, undefined, false),
    phrase('სასიამოვნოა', 'Приятно познакомиться'),
    phrase('საიდან ხარ?', 'Ты откуда?', undefined, ['Откуда ты?']),
    phrase('საიდან ხართ?', 'Вы откуда?', undefined, ['Откуда вы?']),
    phrase('მე ...დან ვარ', 'Я из ...', 'Грамматика → -დან значит “из/откуда”.', undefined, false),
    phrase('ქართულად ლაპარაკობ?', 'Ты говоришь по-грузински?', undefined, ['Говоришь по-грузински?', 'Ты говоришь на грузинском?', 'Говоришь на грузинском?']),
    phrase('ქართულად ლაპარაკობთ?', 'Вы говорите по-грузински?', undefined, ['Говорите по-грузински?', 'Вы говорите на грузинском?', 'Говорите на грузинском?']),
    phrase('რუსულად ლაპარაკობთ?', 'Вы говорите по-русски?', undefined, ['Говорите по-русски?', 'Вы говорите на русском?', 'Говорите на русском?']),
    phrase('ინგლისურად ლაპარაკობთ?', 'Вы говорите по-английски?', undefined, ['Говорите по-английски?', 'Вы говорите на английском?', 'Говорите на английском?']),
    phrase('ცოტა ქართულად ვლაპარაკობ', 'Я немного говорю по-грузински', undefined, ['Немного говорю по-грузински', 'Я немного говорю на грузинском', 'Немного говорю на грузинском']),
    phrase('ქართულად კარგად ვერ ვლაპარაკობ', 'Я плохо говорю по-грузински', undefined, ['Плохо говорю по-грузински', 'Я плохо говорю на грузинском', 'Плохо говорю на грузинском', 'Не очень говорю по-грузински']),
    phrase('ეს ქართულად როგორ არის?', 'Как это по-грузински?'),
    phrase('რა ჰქვია ამას?', 'Как это называется?'),
    phrase('რას ნიშნავს?', 'Что это значит?'),
    phrase('დამეხმარეთ, თუ შეიძლება', 'Помогите, пожалуйста', undefined, ['Помогите пожалуйста']),
    phrase('შეგიძლიათ დამეხმაროთ?', 'Вы можете мне помочь?', undefined, ['Можете помочь?', 'Можете мне помочь?']),
    phrase('დახმარება მჭირდება', 'Мне нужна помощь', undefined, ['Нужна помощь']),
    phrase('სად არის ...?', 'Где ...?', undefined, undefined, false),
    phrase('სად არის ტუალეტი?', 'Где туалет?'),
    phrase('სად არის გაჩერება?', 'Где остановка?'),
    phrase('სად არის მეტრო?', 'Где метро?'),
    phrase('როგორ მივიდე ...მდე?', 'Как дойти / доехать до ...?', 'Грамматика → -მდე значит “до”.', undefined, false),
    phrase('შორს არის?', 'Это далеко?'),
    phrase('ახლოს არის?', 'Это близко?'),
    phrase('მარჯვნივ', 'Направо'),
    phrase('მარცხნივ', 'Налево'),
    phrase('პირდაპირ', 'Прямо'),
    phrase('აქ გააჩერეთ', 'Остановите здесь'),
    phrase('ტაქსი მინდა', 'Мне нужно такси', undefined, ['Нужно такси', 'Я хочу такси']),
    phrase('აეროპორტში მივდივარ', 'Я еду в аэропорт'),
    phrase('სასტუმროში მივდივარ', 'Я еду в отель'),
    phrase('დავიკარგე', 'Я потерялся / потерялась', undefined, ['Я заблудился', 'Я заблудилась']),
    phrase('ექიმი მჭირდება', 'Мне нужен врач', undefined, ['Нужен врач']),
    phrase('აფთიაქი სად არის?', 'Где аптека?'),
    phrase('სასწრაფო გამოიძახეთ', 'Вызовите скорую'),
    phrase('რამდენი ღირს?', 'Сколько стоит?'),
    phrase('ბარათით შეიძლება?', 'Можно картой?', undefined, ['Можно оплатить картой?', 'Оплата картой?']),
    phrase('ნაღდით გადავიხდი', 'Я заплачу наличными'),
    phrase('ქვითარი მინდა', 'Мне нужен чек', undefined, ['Нужен чек', 'Дайте чек', 'Чек пожалуйста']),
    phrase('ეს მინდა', 'Я хочу это', undefined, ['Хочу это']),
    phrase('ეს არ მინდა', 'Я не хочу это', undefined, ['Не хочу это']),
    phrase('ერთი, თუ შეიძლება', 'Один / одну, пожалуйста'),
    phrase('ორი, თუ შეიძლება', 'Два / две, пожалуйста'),
    phrase('წყალი მინდა', 'Я хочу воды', undefined, ['Хочу воды', 'Мне воды']),
    phrase('ყავა მინდა', 'Я хочу кофе', undefined, ['Хочу кофе', 'Мне кофе']),
    phrase('ჩაი მინდა', 'Я хочу чай', undefined, ['Хочу чай', 'Мне чай']),
    phrase('მენიუ, თუ შეიძლება', 'Меню, пожалуйста'),
    phrase('ანგარიში, თუ შეიძლება', 'Счёт, пожалуйста'),
    phrase('გემრიელია', 'Вкусно'),
    phrase('ცხარეა?', 'Это острое?'),
    phrase('მარილი გაქვთ?', 'У вас есть соль?'),
    phrase('უშაქროდ, თუ შეიძლება', 'Без сахара, пожалуйста'),
    phrase('რძით, თუ შეიძლება', 'С молоком, пожалуйста'),
    phrase('ვეგეტარიანული გაქვთ?', 'У вас есть вегетарианское?'),
    phrase('ალერგია მაქვს', 'У меня аллергия'),
    phrase('მშია', 'Я голоден / голодна', undefined, ['Хочу есть']),
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
  const answers = Array.from(
    new Set(value.map((answer) => answer.trim()).filter(Boolean)),
  );
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
