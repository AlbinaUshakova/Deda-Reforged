export type PhraseIntent = {
  id: string;
  meaning: string;
};

export type PhraseIntentSection = {
  title: string;
  intents: PhraseIntent[];
};

export const PHRASE_INTENT_SECTIONS: PhraseIntentSection[] = [
  {
    title: 'Приветствия и прощания',
    intents: [
      { id: 'hello_formal', meaning: 'Здравствуйте' },
      { id: 'hello_informal', meaning: 'Привет' },
      { id: 'good_morning', meaning: 'Доброе утро' },
      { id: 'good_day', meaning: 'Добрый день' },
      { id: 'good_evening', meaning: 'Добрый вечер' },
      { id: 'goodbye', meaning: 'До свидания / Пока' },
    ],
  },
  {
    title: 'Вежливость',
    intents: [
      { id: 'thanks', meaning: 'Спасибо' },
      { id: 'thanks_very_much', meaning: 'Большое спасибо' },
      { id: 'please_request', meaning: 'Пожалуйста — в просьбе' },
      { id: 'you_are_welcome', meaning: 'Пожалуйста / Не за что — ответ на благодарность' },
      { id: 'excuse_me_attention', meaning: 'Извините — чтобы обратиться к человеку' },
      { id: 'sorry_fault', meaning: 'Простите / Мне жаль — если сделал что-то не так' },
      { id: 'no_problem', meaning: 'Ничего страшного / Всё в порядке' },
      { id: 'bless_you', meaning: 'Будьте здоровы' },
    ],
  },
  {
    title: 'Знакомство',
    intents: [
      { id: 'my_name_is', meaning: 'Меня зовут…' },
      { id: 'ask_name', meaning: 'Как вас зовут?' },
      { id: 'nice_to_meet_you', meaning: 'Очень приятно' },
      { id: 'where_are_you_from', meaning: 'Откуда вы?' },
      { id: 'i_am_from', meaning: 'Я из…' },
      { id: 'where_do_you_live', meaning: 'Где вы живёте?' },
      { id: 'i_live_in', meaning: 'Я живу в…' },
    ],
  },
  {
    title: 'Простые ответы',
    intents: [
      { id: 'yes', meaning: 'Да' },
      { id: 'no', meaning: 'Нет' },
      { id: 'maybe', meaning: 'Может быть' },
      { id: 'okay', meaning: 'Хорошо / Ладно' },
      { id: 'of_course', meaning: 'Конечно' },
      { id: 'i_dont_know', meaning: 'Я не знаю' },
    ],
  },
  {
    title: 'Понимание языка',
    intents: [
      { id: 'i_dont_understand', meaning: 'Я не понимаю' },
      { id: 'i_understand', meaning: 'Я понимаю' },
      { id: 'ask_repeat', meaning: 'Повторите, пожалуйста' },
      { id: 'what_does_it_mean', meaning: 'Что это значит?' },
      { id: 'how_to_say', meaning: 'Как сказать … на этом языке?' },
      { id: 'do_you_speak_english', meaning: 'Вы говорите по-английски?' },
      { id: 'i_speak_a_little', meaning: 'Я немного говорю на этом языке' },
    ],
  },
  {
    title: 'Основные вопросы',
    intents: [
      { id: 'what_is_this', meaning: 'Что это?' },
      { id: 'where_is_it', meaning: 'Где это?' },
      { id: 'what_time_is_it', meaning: 'Который час?' },
      { id: 'what_happened', meaning: 'Что случилось?' },
      { id: 'is_everything_ok', meaning: 'Всё в порядке?' },
      { id: 'can_i', meaning: 'Можно мне…?' },
    ],
  },
  {
    title: 'Магазин и оплата',
    intents: [
      { id: 'ask_price', meaning: 'Сколько это стоит?' },
      { id: 'i_want_this', meaning: 'Я хочу это' },
      { id: 'ask_availability', meaning: 'У вас есть…?' },
      { id: 'thats_all', meaning: 'Это всё, спасибо' },
      { id: 'pay_by_card', meaning: 'Можно оплатить картой?' },
      { id: 'receipt_please', meaning: 'Чек, пожалуйста' },
      { id: 'bag_please', meaning: 'Пакет, пожалуйста' },
    ],
  },
  {
    title: 'Кафе и еда',
    intents: [
      { id: 'menu_please', meaning: 'Меню, пожалуйста' },
      { id: 'i_would_like', meaning: 'Я бы хотел / хотела…' },
      { id: 'for_here', meaning: 'Здесь, пожалуйста' },
      { id: 'to_go', meaning: 'С собой, пожалуйста' },
      { id: 'bill_please', meaning: 'Счёт, пожалуйста' },
      { id: 'no_thanks', meaning: 'Нет, спасибо' },
    ],
  },
  {
    title: 'Общественные места',
    intents: [
      { id: 'let_me_pass', meaning: 'Разрешите пройти' },
      { id: 'go_ahead', meaning: 'Проходите, пожалуйста' },
      { id: 'where_is_toilet', meaning: 'Где туалет?' },
      { id: 'is_this_seat_free', meaning: 'Это место свободно?' },
    ],
  },
  {
    title: 'Помощь и самочувствие',
    intents: [
      { id: 'i_need_help', meaning: 'Мне нужна помощь' },
      { id: 'i_feel_unwell', meaning: 'Мне плохо' },
      { id: 'call_ambulance', meaning: 'Вызовите скорую помощь' },
    ],
  },
];

export const PHRASE_INTENT_IDS = PHRASE_INTENT_SECTIONS.flatMap(section =>
  section.intents.map(intent => intent.id),
);
