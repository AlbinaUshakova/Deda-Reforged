import type { Episode, EpisodeCard, EpisodesListItem } from './contentData.ts';

function intentPhrase(
  intent_id: string,
  ge_text: string,
  ru_meaning: string,
  note?: string,
  accepted_ru?: string[],
): EpisodeCard {
  return {
    type: 'word',
    intent_id,
    ge_text,
    ru_meaning,
    ...(accepted_ru?.length ? { accepted_ru } : {}),
    ...(note ? { info_notes: [{ kind: 'grammar' as const, text: note }] } : {}),
  };
}

export const ITALIAN_INTENT_SECTION_IDS = [
  'ep10a',
  'ep10b',
  'ep10c',
  'ep10d',
  'ep10e',
  'ep10f',
  'ep10g',
  'ep10h',
  'ep10i',
  'ep10j',
] as const;

export const ITALIAN_NUMBERS_ID = 'ep10k';

export const ITALIAN_INTENT_SECTION_EPISODES: Episode[] = [
  {
    id: 'ep10a',
    title: 'Приветствия и прощания',
    cards: [
      intentPhrase('hello_formal', 'Salve', 'Здравствуйте', undefined, ['Добрый день']),
      intentPhrase('hello_informal', 'Ciao', 'Привет'),
      intentPhrase('good_morning', 'Buongiorno', 'Доброе утро'),
      intentPhrase('good_day', 'Buon pomeriggio', 'Добрый день'),
      intentPhrase('good_evening', 'Buonasera', 'Добрый вечер'),
      intentPhrase('goodbye', 'Arrivederci', 'До свидания', undefined, ['Пока']),
    ],
  },
  {
    id: 'ep10b',
    title: 'Вежливость',
    cards: [
      intentPhrase('thanks', 'Grazie', 'Спасибо'),
      intentPhrase('thanks_very_much', 'Grazie mille', 'Большое спасибо', undefined, ['Спасибо большое']),
      intentPhrase('please_request', 'Per favore', 'Пожалуйста', 'В просьбе: “пожалуйста”.'),
      intentPhrase('you_are_welcome', 'Prego', 'Не за что', undefined, ['Пожалуйста']),
      intentPhrase('excuse_me_attention', 'Mi scusi', 'Извините', 'Чтобы обратиться к человеку или привлечь внимание.', ['Простите']),
      intentPhrase('sorry_fault', 'Mi dispiace', 'Мне жаль', undefined, ['Простите']),
      intentPhrase('no_problem', 'Non fa niente', 'Ничего страшного', undefined, ['Все в порядке', 'Всё в порядке']),
      intentPhrase('bless_you', 'Salute', 'Будьте здоровы'),
    ],
  },
  {
    id: 'ep10c',
    title: 'Знакомство',
    cards: [
      intentPhrase('my_name_is', 'Mi chiamo Anna', 'Меня зовут Анна'),
      intentPhrase('ask_name', 'Come si chiama?', 'Как вас зовут?'),
      intentPhrase('nice_to_meet_you', 'Piacere', 'Очень приятно', undefined, ['Приятно познакомиться']),
      intentPhrase('where_are_you_from', "Di dov'è?", 'Откуда вы?'),
      intentPhrase('i_am_from', 'Sono della Russia', 'Я из России'),
      intentPhrase('where_do_you_live', 'Dove abita?', 'Где вы живёте?', undefined, ['Где вы живете?']),
      intentPhrase('i_live_in', 'Abito a Roma', 'Я живу в Риме'),
    ],
  },
  {
    id: 'ep10d',
    title: 'Простые ответы',
    cards: [
      intentPhrase('yes', 'Sì', 'Да'),
      intentPhrase('no', 'No', 'Нет'),
      intentPhrase('maybe', 'Forse', 'Может быть'),
      intentPhrase('okay', 'Va bene', 'Хорошо', undefined, ['Ладно', 'Ок', 'Окей']),
      intentPhrase('of_course', 'Certo', 'Конечно'),
      intentPhrase('i_dont_know', 'Non lo so', 'Я не знаю', undefined, ['Не знаю']),
    ],
  },
  {
    id: 'ep10e',
    title: 'Понимание языка',
    cards: [
      intentPhrase('i_dont_understand', 'Non capisco', 'Я не понимаю', undefined, ['Не понимаю']),
      intentPhrase('i_understand', 'Capisco', 'Я понимаю', undefined, ['Понимаю']),
      intentPhrase('ask_repeat', 'Ripeta, per favore', 'Повторите, пожалуйста'),
      intentPhrase('what_does_it_mean', 'Cosa significa?', 'Что это значит?'),
      intentPhrase('how_to_say', 'Come si dice questo in italiano?', 'Как это сказать по-итальянски?'),
      intentPhrase('do_you_speak_english', 'Parla inglese?', 'Вы говорите по-английски?'),
      intentPhrase('i_speak_a_little', "Parlo un po' d'italiano", 'Я немного говорю по-итальянски'),
    ],
  },
  {
    id: 'ep10f',
    title: 'Основные вопросы',
    cards: [
      intentPhrase('what_is_this', "Cos'è questo?", 'Что это?'),
      intentPhrase('where_is_it', "Dov'è?", 'Где это?'),
      intentPhrase('what_time_is_it', 'Che ore sono?', 'Который час?', undefined, ['Сколько времени?']),
      intentPhrase('what_happened', "Cos'è successo?", 'Что случилось?'),
      intentPhrase('is_everything_ok', 'Tutto bene?', 'Всё в порядке?', undefined, ['Все в порядке?']),
      intentPhrase('can_i', 'Posso avere questo?', 'Можно мне это?'),
    ],
  },
  {
    id: 'ep10g',
    title: 'Магазин и оплата',
    cards: [
      intentPhrase('ask_price', 'Quanto costa?', 'Сколько это стоит?', undefined, ['Сколько стоит?']),
      intentPhrase('i_want_this', 'Voglio questo', 'Я хочу это', undefined, ['Хочу это']),
      intentPhrase('ask_availability', "Ha dell'acqua?", 'У вас есть вода?'),
      intentPhrase('thats_all', 'È tutto, grazie', 'Это всё, спасибо', undefined, ['Это все, спасибо']),
      intentPhrase('pay_by_card', 'Posso pagare con la carta?', 'Можно оплатить картой?', undefined, ['Можно картой?']),
      intentPhrase('receipt_please', 'Lo scontrino, per favore', 'Чек, пожалуйста', undefined, ['Дайте чек']),
      intentPhrase('bag_please', 'Un sacchetto, per favore', 'Пакет, пожалуйста', undefined, ['Пакет']),
    ],
  },
  {
    id: 'ep10h',
    title: 'Кафе и еда',
    cards: [
      intentPhrase('menu_please', 'Il menù, per favore', 'Меню, пожалуйста'),
      intentPhrase('i_would_like', "Vorrei dell'acqua", 'Я бы хотел воды', undefined, ['Я бы хотела воды']),
      intentPhrase('for_here', 'Qui, per favore', 'Здесь, пожалуйста'),
      intentPhrase('to_go', 'Da asporto, per favore', 'С собой, пожалуйста'),
      intentPhrase('bill_please', 'Il conto, per favore', 'Счёт, пожалуйста', undefined, ['Счет, пожалуйста']),
      intentPhrase('no_thanks', 'No, grazie', 'Нет, спасибо'),
    ],
  },
  {
    id: 'ep10i',
    title: 'Общественные места',
    cards: [
      intentPhrase('let_me_pass', 'Permesso, per favore', 'Разрешите пройти'),
      intentPhrase('go_ahead', 'Passi pure, per favore', 'Проходите, пожалуйста'),
      intentPhrase('where_is_toilet', "Dov'è il bagno?", 'Где туалет?'),
      intentPhrase('is_this_seat_free', 'È libero questo posto?', 'Это место свободно?'),
    ],
  },
  {
    id: 'ep10j',
    title: 'Помощь и самочувствие',
    cards: [
      intentPhrase('i_need_help', 'Ho bisogno di aiuto', 'Мне нужна помощь', undefined, ['Нужна помощь']),
      intentPhrase('i_feel_unwell', 'Mi sento male', 'Мне плохо'),
      intentPhrase('call_ambulance', "Chiami un'ambulanza", 'Вызовите скорую помощь', undefined, ['Вызовите скорую']),
    ],
  },
];

export function getItalianIntentEpisode(id: string): Episode | null {
  if (id === 'phrases') return ITALIAN_INTENT_SECTION_EPISODES[0] ?? null;
  return ITALIAN_INTENT_SECTION_EPISODES.find(episode => episode.id === id) ?? null;
}

export function listItalianIntentItems(): EpisodesListItem[] {
  return ITALIAN_INTENT_SECTION_EPISODES.map(episode => ({
    id: episode.id,
    title: episode.title,
    cardCount: episode.cards.length,
  }));
}
