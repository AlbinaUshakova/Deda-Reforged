import type { CourseId } from './courses.ts';

type TravelCard = {
  type: 'word';
  intent_id: string;
  ge_text: string;
  ru_meaning: string;
  accepted_ru?: string[];
  translit?: string;
  transcription_ru?: string;
};

export type TravelPracticeEpisode = {
  id: string;
  title: 'Транспорт' | 'Отель';
  letters: [];
  cards: TravelCard[];
};

const TRAVEL_INTENTS = [
  ['taxi_stand', 'Где стоянка такси?', []],
  ['go_to_address', 'Можете отвезти по этому адресу?', ['Можете поехать по этому адресу?']],
  ['go_to_airport', 'Я хочу поехать в аэропорт', ['Мне нужно в аэропорт']],
  ['turn_on_meter', 'Можете включить счётчик?', ['Включите счетчик', 'Включите счётчик']],
  ['how_long', 'Сколько времени займёт?', ['Сколько это займет?', 'Сколько времени займёт']],
  ['bus_stop', 'Где автобусная остановка?', []],
  ['stop_here', 'Остановите здесь, пожалуйста', ['Остановите здесь']],
  ['have_reservation', 'У меня есть бронь', ['У меня бронь', 'У меня есть бронирование']],
  ['room_ready', 'Номер готов?', ['Комната готова?']],
  ['breakfast_included', 'Завтрак включён?', ['Завтрак включен?']],
  ['wifi_password', 'Какой пароль от Wi-Fi?', ['Пароль от вайфая', 'Какой пароль от вайфая?']],
  ['checkout_time', 'Во сколько выезд?', ['Во сколько нужно освободить номер?']],
  ['ask_towel', 'Можно мне полотенце?', ['Можно полотенце?']],
  ['call_taxi', 'Можете вызвать такси?', ['Вызовите такси, пожалуйста']],
] as const;

export const TRAVEL_INTENT_IDS = TRAVEL_INTENTS.map(([intentId]) => intentId);

const TRAVEL_TEXTS: Record<CourseId, readonly string[]> = {
  ka: [
    'სად არის ტაქსის გაჩერება?',
    'ამ მისამართზე წამიყვანეთ, გთხოვთ',
    'აეროპორტში მინდა წასვლა',
    'შეგიძლიათ მრიცხველი ჩართოთ?',
    'რამდენ ხანს გასტანს?',
    'სად არის ავტობუსის გაჩერება?',
    'აქ გააჩერეთ, გთხოვთ',
    'ჯავშანი მაქვს',
    'ოთახი მზად არის?',
    'საუზმე შედის?',
    'Wi-Fi-ის პაროლი რა არის?',
    'გასვლა რომელ საათზეა?',
    'შეიძლება ერთი პირსახოცი?',
    'შეგიძლიათ ტაქსი გამომიძახოთ?',
  ],
  ru: TRAVEL_INTENTS.map(([, meaning]) => meaning),
  sr: [
    'Где је такси станица?',
    'Можете ли ме одвести на ову адресу?',
    'Желим да идем на аеродром',
    'Можете ли да укључите таксиметар?',
    'Колико ће трајати?',
    'Где је аутобуска станица?',
    'Станите овде, молим вас',
    'Имам резервацију',
    'Да ли је соба спремна?',
    'Да ли је доручак укључен?',
    'Која је лозинка за Wi-Fi?',
    'У колико сати је одјава?',
    'Могу ли добити пешкир?',
    'Можете ли позвати такси?',
  ],
  tr: [
    'Taksi durağı nerede?',
    'Bu adrese gidebilir misiniz?',
    'Havaalanına gitmek istiyorum',
    'Taksimetreyi açabilir misiniz?',
    'Ne kadar sürer?',
    'Otobüs durağı nerede?',
    'Burada durun, lütfen',
    'Rezervasyonum var',
    'Oda hazır mı?',
    'Kahvaltı dahil mi?',
    'Wi-Fi şifresi nedir?',
    'Çıkış saat kaçta?',
    'Bir havlu alabilir miyim?',
    'Bir taksi çağırabilir misiniz?',
  ],
  es: [
    '¿Dónde está la parada de taxis?',
    '¿Puede llevarme a esta dirección?',
    'Quiero ir al aeropuerto',
    '¿Puede poner el taxímetro?',
    '¿Cuánto tarda?',
    '¿Dónde está la parada de autobús?',
    'Pare aquí, por favor',
    'Tengo una reserva',
    '¿Está lista la habitación?',
    '¿Está incluido el desayuno?',
    '¿Cuál es la contraseña del Wi-Fi?',
    '¿A qué hora es la salida?',
    '¿Me puede traer una toalla?',
    '¿Puede llamar a un taxi?',
  ],
  de: [
    'Wo ist der Taxistand?',
    'Können Sie mich zu dieser Adresse fahren?',
    'Ich möchte zum Flughafen fahren',
    'Können Sie das Taxameter einschalten?',
    'Wie lange dauert es?',
    'Wo ist die Bushaltestelle?',
    'Halten Sie bitte hier',
    'Ich habe eine Reservierung',
    'Ist das Zimmer fertig?',
    'Ist das Frühstück inbegriffen?',
    'Wie lautet das WLAN-Passwort?',
    'Um wie viel Uhr ist der Check-out?',
    'Kann ich ein Handtuch bekommen?',
    'Können Sie ein Taxi rufen?',
  ],
  en: [
    'Where is the taxi stand?',
    'Can you take me to this address?',
    'I want to go to the airport',
    'Can you turn on the meter?',
    'How long will it take?',
    'Where is the bus stop?',
    'Please stop here',
    'I have a reservation',
    'Is the room ready?',
    'Is breakfast included?',
    'What is the Wi-Fi password?',
    'What time is check-out?',
    'Can I have a towel?',
    'Can you call a taxi?',
  ],
  fr: [
    'Où est la station de taxis ?',
    "Pouvez-vous m'emmener à cette adresse ?",
    "Je voudrais aller à l'aéroport",
    'Pouvez-vous mettre le compteur ?',
    'Combien de temps cela prend ?',
    "Où est l'arrêt de bus ?",
    "Arrêtez-vous ici, s'il vous plaît",
    "J'ai une réservation",
    'La chambre est-elle prête ?',
    'Le petit-déjeuner est-il compris ?',
    'Quel est le mot de passe du Wi-Fi ?',
    'À quelle heure est le départ ?',
    'Puis-je avoir une serviette ?',
    'Pouvez-vous appeler un taxi ?',
  ],
  it: [
    "Dov'è il posteggio dei taxi?",
    'Può portarmi a questo indirizzo?',
    "Vorrei andare all'aeroporto",
    'Può accendere il tassametro?',
    'Quanto tempo ci vuole?',
    "Dov'è la fermata dell'autobus?",
    'Si fermi qui, per favore',
    'Ho una prenotazione',
    'La camera è pronta?',
    'La colazione è inclusa?',
    'Qual è la password del Wi-Fi?',
    "A che ora è il check-out?",
    'Posso avere un asciugamano?',
    'Può chiamare un taxi?',
  ],
};

const ENGLISH_TRANSCRIPTIONS_RU = [
  'уэр из зэ такси стэнд',
  'кэн ю тэйк ми ту зис эдрэс',
  'ай уонт ту гоу ту зи эйрпорт',
  'кэн ю тёрн он зэ митэр',
  'хау лонг уил ит тэйк',
  'уэр из зэ бас стоп',
  'плиз стоп хир',
  'ай хэв э рэзэрвэйшн',
  'из зэ рум рэди',
  'из брэкфэст инклудид',
  'уот из зэ уай-фай пасуорд',
  'уот тайм из чек-аут',
  'кэн ай хэв э тауэл',
  'кэн ю кол э такси',
] as const;

const SECTION_PREFIX: Record<CourseId, string> = {
  ka: 'ep10',
  ru: 'ep8',
  sr: 'ep9',
  tr: 'ep10',
  es: 'ep11',
  de: 'ep7',
  en: 'ep9',
  fr: 'ep8',
  it: 'ep10',
};

export function getTravelPracticeEpisodes(courseId: CourseId): TravelPracticeEpisode[] {
  const texts = TRAVEL_TEXTS[courseId];
  const cards = TRAVEL_INTENTS.map(([intentId, meaning, acceptedRu], index): TravelCard => ({
    type: 'word',
    intent_id: intentId,
    ge_text: texts[index],
    ru_meaning: meaning,
    ...(acceptedRu.length ? { accepted_ru: [...acceptedRu] } : {}),
    ...(courseId === 'en'
      ? {
          translit: ENGLISH_TRANSCRIPTIONS_RU[index],
          transcription_ru: ENGLISH_TRANSCRIPTIONS_RU[index],
        }
      : {}),
  }));
  const prefix = SECTION_PREFIX[courseId];

  return [
    { id: `${prefix}l`, title: 'Транспорт', letters: [], cards: cards.slice(0, 7) },
    { id: `${prefix}m`, title: 'Отель', letters: [], cards: cards.slice(7) },
  ];
}
