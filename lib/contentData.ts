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
  info_notes?: CardInfoNote[];
  audio_url?: string;
  topic?: string;
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

export const PHRASES_EPISODE: Episode = {
  id: 'phrases',
  title: 'Разговорные фразы',
  cards: [
    { type: 'word', ge_text: 'გამარჯობა', ru_meaning: 'Здравствуйте / Привет', info_notes: [{ kind: 'grammar', text: 'Вежливо → нейтральное приветствие.' }] },
    { type: 'word', ge_text: 'სალამი', ru_meaning: 'Привет', info_notes: [{ kind: 'grammar', text: 'Неформально → для друзей и близких.' }] },
    { type: 'word', ge_text: 'ნახვამდის', ru_meaning: 'До свидания', info_notes: [{ kind: 'grammar', text: 'Вежливо → при прощании.' }] },
    { type: 'word', ge_text: 'გმადლობთ', ru_meaning: 'Спасибо', info_notes: [{ kind: 'grammar', text: 'Вежливо → форма для незнакомых.' }] },
    { type: 'word', ge_text: 'დიდი მადლობა', ru_meaning: 'Большое спасибо', info_notes: [{ kind: 'grammar', text: 'Грамматика → დიდი значит “большой”.' }] },
    { type: 'word', ge_text: 'არაფრის', ru_meaning: 'Пожалуйста / Не за что', info_notes: [{ kind: 'grammar', text: 'Грамматика → дословно “ничего”.' }] },
    { type: 'word', ge_text: 'ბოდიში', ru_meaning: 'Извините / Простите', info_notes: [{ kind: 'grammar', text: 'Вежливо → нейтральная форма извинения.' }] },
    { type: 'word', ge_text: 'კი', ru_meaning: 'Да', info_notes: [{ kind: 'grammar', text: 'Неформально → обычное разговорное “да”.' }] },
    { type: 'word', ge_text: 'დიახ', ru_meaning: 'Да', info_notes: [{ kind: 'grammar', text: 'Вежливо → более формальное “да”.' }] },
    { type: 'word', ge_text: 'არა', ru_meaning: 'Нет', info_notes: [{ kind: 'grammar', text: 'Грамматика → базовое “нет”.' }] },
    { type: 'word', ge_text: 'კარგი', ru_meaning: 'Хорошо / Ладно', info_notes: [{ kind: 'grammar', text: 'Грамматика → мягкое согласие.' }] },
    { type: 'word', ge_text: 'როგორ ხარ?', ru_meaning: 'Как ты?', info_notes: [{ kind: 'grammar', text: 'Неформально → форма на ты.' }] },
    { type: 'word', ge_text: 'როგორ ხართ?', ru_meaning: 'Как вы?', info_notes: [{ kind: 'grammar', text: 'Вежливо → форма на вы.' }] },
    { type: 'word', ge_text: 'კარგად ვარ', ru_meaning: 'У меня всё хорошо', info_notes: [{ kind: 'grammar', text: 'Грамматика → дословно “я хорошо”.' }] },
    { type: 'word', ge_text: 'ასე რა', ru_meaning: 'Так себе', info_notes: [{ kind: 'grammar', text: 'Грамматика → разговорное “так себе”.' }] },
    { type: 'word', ge_text: 'მე მქვია ...', ru_meaning: 'Меня зовут ...', info_notes: [{ kind: 'grammar', text: 'Грамматика → естественная форма знакомства.' }] },
    { type: 'word', ge_text: 'მე ვარ ...', ru_meaning: 'Я ...', info_notes: [{ kind: 'grammar', text: 'Грамматика → говорим о себе или роли.' }] },
    { type: 'word', ge_text: 'სასიამოვნოა', ru_meaning: 'Приятно познакомиться', info_notes: [{ kind: 'grammar', text: 'Грамматика → дословно “приятно”.' }] },
    { type: 'word', ge_text: 'არ მესმის', ru_meaning: 'Я не понимаю', info_notes: [{ kind: 'grammar', text: 'Грамматика → дословно “мне не понимается”.' }] },
    { type: 'word', ge_text: 'გაიმეორეთ, თუ შეიძლება', ru_meaning: 'Повторите, пожалуйста', info_notes: [{ kind: 'grammar', text: 'Вежливо → окончание -ეთ это форма на вы.' }] },
    { type: 'word', ge_text: 'ნელა, თუ შეიძლება', ru_meaning: 'Помедленнее, пожалуйста', info_notes: [{ kind: 'grammar', text: 'Вежливо → თუ შეიძლება смягчает просьбу.' }] },
    { type: 'word', ge_text: 'რა ჰქვია ამას?', ru_meaning: 'Как это называется?', info_notes: [{ kind: 'grammar', text: 'Грамматика → вопрос про название.' }] },
    { type: 'word', ge_text: 'როგორ არის ქართულად?', ru_meaning: 'Как это по-грузински?', info_notes: [{ kind: 'grammar', text: 'Грамматика → ქართულად значит “по-грузински”.' }] },
    { type: 'word', ge_text: 'სად არის ... ?', ru_meaning: 'Где ... ?', info_notes: [{ kind: 'grammar', text: 'Грамматика → базовый вопрос о месте.' }] },
    { type: 'word', ge_text: 'რამდენი ღირს?', ru_meaning: 'Сколько стоит?', info_notes: [{ kind: 'grammar', text: 'Грамматика → вопрос о цене.' }] },
    { type: 'word', ge_text: 'მინდა ...', ru_meaning: 'Я хочу ...', info_notes: [{ kind: 'grammar', text: 'Грамматика → дословно “мне хочется”.' }] },
    { type: 'word', ge_text: 'მომეცით, თუ შეიძლება', ru_meaning: 'Дайте, пожалуйста', info_notes: [{ kind: 'grammar', text: 'Вежливо → -თ это форма на вы.' }] },
    { type: 'word', ge_text: 'წყალი მინდა', ru_meaning: 'Я хочу воду', info_notes: [{ kind: 'grammar', text: 'Грамматика → дословно “вода мне хочется”.' }] },
    { type: 'word', ge_text: 'დამეხმარეთ, თუ შეიძლება', ru_meaning: 'Помогите, пожалуйста', info_notes: [{ kind: 'grammar', text: 'Вежливо → форма просьбы на вы.' }] },
    { type: 'word', ge_text: 'მე არ ვლაპარაკობ კარგად ქართულად', ru_meaning: 'Я не очень хорошо говорю по-грузински', info_notes: [{ kind: 'grammar', text: 'Грамматика → ქართულად значит “по-грузински”.' }] },
    { type: 'word', ge_text: 'ცოტა ქართულად ვლაპარაკობ', ru_meaning: 'Я немного говорю по-грузински', info_notes: [{ kind: 'grammar', text: 'Грамматика → ცოტა значит “немного”.' }] },
  ],
};

export function normalizeGeorgianText(text: string): string {
  if (!text) return text;
  if (/[\u10D0-\u10FF]/.test(text)) {
    return text.replace(/и/g, 'ი').replace(/И/g, 'ი');
  }
  return text;
}

export function normalizeEpisode(episode: Episode): Episode {
  return {
    ...episode,
    cards: episode.cards.map((card) => ({
      ...card,
      ge_text: normalizeGeorgianText(card.ge_text),
    })),
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
