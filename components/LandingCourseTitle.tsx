'use client';

import { type KeyboardEvent, useEffect, useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import { COURSES, COURSE_IDS, type CourseId } from '@/lib/courses';
import { getAlphabetDisplayTitle, getCourseName } from '@/lib/interfaceText';
import { getDisplayText } from '@/lib/transliteration';
import { getActiveTransliterationMode } from '@/lib/settings';

const courseAdverb: Record<CourseId, string> = {
  ka: 'по-грузински',
  en: 'по-английски',
  es: 'по-испански',
  de: 'по-немецки',
  sr: 'по-сербски',
  tr: 'по-турецки',
  fr: 'по-французски',
  it: 'по-итальянски',
};

type RestaurantBill = {
  label: string;
  place: string;
  date: string;
  table: string;
  items: Array<{ qty: string; name: string; price: string }>;
  subtotal: string;
  service: string;
  total: string;
  payment: string;
};

const restaurantBills: Record<CourseId, RestaurantBill> = {
  ka: {
    label: 'ანგარიში',
    place: 'კაფე Deda',
    date: '23.07.2026',
    table: 'მაგიდა 4',
    items: [
      { qty: '10x', name: 'ხინკალი', price: '20.00 ₾' },
      { qty: '1x', name: 'ხაჭაპური', price: '14.00 ₾' },
      { qty: '1x', name: 'ლიმონათი', price: '5.00 ₾' },
    ],
    subtotal: '39.00 ₾',
    service: '3.90 ₾',
    total: '42.90 ₾',
    payment: 'ბარათი',
  },
  en: {
    label: 'Bill',
    place: 'Deda Cafe',
    date: '23/07/2026',
    table: 'Table 4',
    items: [
      { qty: '1x', name: 'Fish and chips', price: '£12.00' },
      { qty: '1x', name: 'Scone', price: '£4.00' },
      { qty: '1x', name: 'Tea', price: '£3.00' },
    ],
    subtotal: '£19.00',
    service: '£1.90',
    total: '£20.90',
    payment: 'Card',
  },
  es: {
    label: 'Cuenta',
    place: 'Café Deda',
    date: '23/07/2026',
    table: 'Mesa 4',
    items: [
      { qty: '1x', name: 'Tortilla', price: '6,00 €' },
      { qty: '1x', name: 'Gazpacho', price: '5,00 €' },
      { qty: '1x', name: 'Churros', price: '4,00 €' },
    ],
    subtotal: '15,00 €',
    service: '1,50 €',
    total: '16,50 €',
    payment: 'Tarjeta',
  },
  de: {
    label: 'Rechnung',
    place: 'Deda Café',
    date: '23.07.2026',
    table: 'Tisch 4',
    items: [
      { qty: '1x', name: 'Bratwurst', price: '6,00 €' },
      { qty: '1x', name: 'Brezel', price: '3,00 €' },
      { qty: '1x', name: 'Apfelsaft', price: '4,00 €' },
    ],
    subtotal: '13,00 €',
    service: '1,30 €',
    total: '14,30 €',
    payment: 'Karte',
  },
  sr: {
    label: 'Рачун',
    place: 'Deda кафе',
    date: '23.07.2026',
    table: 'Сто 4',
    items: [
      { qty: '1x', name: 'Ћевапи', price: '650 дин' },
      { qty: '1x', name: 'Бурек', price: '280 дин' },
      { qty: '1x', name: 'Јогурт', price: '160 дин' },
    ],
    subtotal: '1090 дин',
    service: '109 дин',
    total: '1199 дин',
    payment: 'Картица',
  },
  tr: {
    label: 'Hesap',
    place: 'Deda Kafe',
    date: '23.07.2026',
    table: 'Masa 4',
    items: [
      { qty: '1x', name: 'Simit', price: '35 ₺' },
      { qty: '1x', name: 'Baklava', price: '90 ₺' },
      { qty: '1x', name: 'Ayran', price: '25 ₺' },
    ],
    subtotal: '150 ₺',
    service: '15 ₺',
    total: '165 ₺',
    payment: 'Kart',
  },
  fr: {
    label: 'Addition',
    place: 'Café Deda',
    date: '23/07/2026',
    table: 'Table 4',
    items: [
      { qty: '1x', name: 'Croissant', price: '2,00 €' },
      { qty: '1x', name: 'Quiche', price: '7,00 €' },
      { qty: '1x', name: 'Café', price: '3,00 €' },
    ],
    subtotal: '12,00 €',
    service: '1,20 €',
    total: '13,20 €',
    payment: 'Carte',
  },
  it: {
    label: 'Conto',
    place: 'Caffè Deda',
    date: '23/07/2026',
    table: 'Tavolo 4',
    items: [
      { qty: '1x', name: 'Pizza', price: '8,00 €' },
      { qty: '1x', name: 'Pasta', price: '9,00 €' },
      { qty: '1x', name: 'Caffè', price: '2,00 €' },
    ],
    subtotal: '19,00 €',
    service: '1,90 €',
    total: '20,90 €',
    payment: 'Carta',
  },
};

const BILL_LABELS: Record<CourseId, { subtotal: string; service: string; total: string }> = {
  ka: { subtotal: 'ჯამი', service: 'სერვისი', total: 'სულ' },
  en: { subtotal: 'Subtotal', service: 'Service', total: 'Total' },
  es: { subtotal: 'Subtotal', service: 'Servicio', total: 'Total' },
  de: { subtotal: 'Zwischensumme', service: 'Service', total: 'Gesamt' },
  sr: { subtotal: 'Међузбир', service: 'Сервис', total: 'Укупно' },
  tr: { subtotal: 'Ara toplam', service: 'Servis', total: 'Toplam' },
  fr: { subtotal: 'Sous-total', service: 'Service', total: 'Total' },
  it: { subtotal: 'Subtotale', service: 'Servizio', total: 'Totale' },
};

const restaurantBillTranslations: Record<CourseId, RestaurantBill> = {
  ka: {
    label: 'Счёт',
    place: 'Кафе Deda',
    date: '23.07.2026',
    table: 'Стол 4',
    items: [
      { qty: '10x', name: 'Хинкали', price: '20.00 ₾' },
      { qty: '1x', name: 'Хачапури', price: '14.00 ₾' },
      { qty: '1x', name: 'Лимонад', price: '5.00 ₾' },
    ],
    subtotal: '39.00 ₾',
    service: '3.90 ₾',
    total: '42.90 ₾',
    payment: 'Карта',
  },
  en: {
    label: 'Счёт',
    place: 'Кафе Deda',
    date: '23/07/2026',
    table: 'Стол 4',
    items: [
      { qty: '1x', name: 'Рыба с картофелем', price: '£12.00' },
      { qty: '1x', name: 'Скон', price: '£4.00' },
      { qty: '1x', name: 'Чай', price: '£3.00' },
    ],
    subtotal: '£19.00',
    service: '£1.90',
    total: '£20.90',
    payment: 'Карта',
  },
  es: {
    label: 'Счёт',
    place: 'Кафе Deda',
    date: '23/07/2026',
    table: 'Стол 4',
    items: [
      { qty: '1x', name: 'Тортилья', price: '6,00 €' },
      { qty: '1x', name: 'Гаспачо', price: '5,00 €' },
      { qty: '1x', name: 'Чуррос', price: '4,00 €' },
    ],
    subtotal: '15,00 €',
    service: '1,50 €',
    total: '16,50 €',
    payment: 'Карта',
  },
  de: {
    label: 'Счёт',
    place: 'Кафе Deda',
    date: '23.07.2026',
    table: 'Стол 4',
    items: [
      { qty: '1x', name: 'Братвурст', price: '6,00 €' },
      { qty: '1x', name: 'Брецель', price: '3,00 €' },
      { qty: '1x', name: 'Яблочный сок', price: '4,00 €' },
    ],
    subtotal: '13,00 €',
    service: '1,30 €',
    total: '14,30 €',
    payment: 'Карта',
  },
  sr: {
    label: 'Счёт',
    place: 'Кафе Deda',
    date: '23.07.2026',
    table: 'Стол 4',
    items: [
      { qty: '1x', name: 'Чевапи', price: '650 дин' },
      { qty: '1x', name: 'Бурек', price: '280 дин' },
      { qty: '1x', name: 'Йогурт', price: '160 дин' },
    ],
    subtotal: '1090 дин',
    service: '109 дин',
    total: '1199 дин',
    payment: 'Карта',
  },
  tr: {
    label: 'Счёт',
    place: 'Кафе Deda',
    date: '23.07.2026',
    table: 'Стол 4',
    items: [
      { qty: '1x', name: 'Симит', price: '35 ₺' },
      { qty: '1x', name: 'Баклава', price: '90 ₺' },
      { qty: '1x', name: 'Айран', price: '25 ₺' },
    ],
    subtotal: '150 ₺',
    service: '15 ₺',
    total: '165 ₺',
    payment: 'Карта',
  },
  fr: {
    label: 'Счёт',
    place: 'Кафе Deda',
    date: '23/07/2026',
    table: 'Стол 4',
    items: [
      { qty: '1x', name: 'Круассан', price: '2,00 €' },
      { qty: '1x', name: 'Киш', price: '7,00 €' },
      { qty: '1x', name: 'Кофе', price: '3,00 €' },
    ],
    subtotal: '12,00 €',
    service: '1,20 €',
    total: '13,20 €',
    payment: 'Карта',
  },
  it: {
    label: 'Счёт',
    place: 'Кафе Deda',
    date: '23/07/2026',
    table: 'Стол 4',
    items: [
      { qty: '1x', name: 'Пицца', price: '8,00 €' },
      { qty: '1x', name: 'Паста', price: '9,00 €' },
      { qty: '1x', name: 'Кофе', price: '2,00 €' },
    ],
    subtotal: '19,00 €',
    service: '1,90 €',
    total: '20,90 €',
    payment: 'Карта',
  },
};

const readingReasons: Record<CourseId, {
  title: string;
  subtitle: string;
  items: Array<{ title: string; text: string }>;
}> = {
  ka: {
    title: 'Грузинский: главное для чтения',
    subtitle: 'Алфавит не похож ни на латиницу, ни на кириллицу — но читается честнее их всех.',
    items: [
      { title: 'Буква = звук, без исключений', text: '33 буквы мхедрули, ни заглавных, ни строчных. Выучил букву — читаешь любое слово с ней.' },
      { title: 'Есть звуки “с выстрелом”', text: 'ტ, პ, კ произносятся резким толчком воздуха. Таких звуков нет в русском, к ним просто нужно привыкнуть.' },
      { title: 'Слово может быть предложением', text: 'Грузинский глагол умеет упаковать действие, кто делает и на кого направлено. Длинное слово часто просто компактное.' },
    ],
  },
  en: {
    title: 'Английский: главное для чтения',
    subtitle: 'Английские буквы — это не инструкция, а память о том, как язык звучал 500 лет назад.',
    items: [
      { title: 'Буквы врут, и это нормально', text: 'Одна и та же a звучит по-разному: cat, car, cake, about. Это не ты плохо учишь — английский давно перестал слушаться букв.' },
      { title: 'Ударение меняет смысл', text: 'record может быть существительным или глаголом. Переставил ударение — поменялась роль слова.' },
      { title: 'Есть надёжные острова', text: 'th, sh, ch, ee, oo лучше учить как готовые кусочки. Так хаоса в английском чтении становится меньше.' },
    ],
  },
  es: {
    title: 'Испанский: главное для чтения',
    subtitle: 'Испанский — редкий случай, когда алфавит держит слово: что написано, то и звучит.',
    items: [
      { title: '27 букв — почти без обмана', text: 'Часто можно впервые увидеть слово и сразу произнести его правильно. Это большая редкость для европейских языков.' },
      { title: 'Ударение по правилу', text: 'Нет значка — работает простое правило по последней букве. Есть ´ — язык сам показывает исключение.' },
      { title: 'Глагол говорит, кто действует', text: 'Hablo уже значит “я говорю”. Местоимение часто не нужно: оно зашито в окончании.' },
    ],
  },
  de: {
    title: 'Немецкий: главное для чтения',
    subtitle: 'Немецкий выглядит строгим, но за этой строгостью скрывается очень честный алфавит.',
    items: [
      { title: 'Буква почти никогда не врёт', text: '26 основных букв плюс Ä, Ö, Ü и ß. Умлауты лучше сразу услышать отдельно: точки над буквой на письме дают другой звук на слух.' },
      { title: 'Три буквы обманывают глаз', text: 'W звучит как “в”, V — как “ф”, Z — как “ц”. Мозг по привычке хочет читать по-английски — и ошибается.' },
      { title: 'Читай не буквами, а блоками', text: 'sch = “ш”, ch = “х”, ei = “ай”, ie = долгий “и”. Это рабочие связки: выучил один раз — узнаёшь в любом слове.' },
    ],
  },
  sr: {
    title: 'Сербский: главное для чтения',
    subtitle: 'Сербский почти как конструктор: одна буква обычно даёт один звук — и почти никогда не подводит.',
    items: [
      { title: 'Не ищи подвох там, где его нет', text: '30 букв: 5 гласных и 25 согласных. Работает главное правило: как написано, так и читается, без скрытых правил.' },
      { title: 'Смотри на знак целиком', text: 'Љ, Њ, Ђ, Ћ, Џ — это не две буквы подряд, а самостоятельные знаки. Каждый даёт ровно один звук.' },
      { title: 'Похоже на русский, но звучит по-своему', text: 'Знакомая форма слова может обмануть. Произносить всё равно нужно по-сербски, буква за буквой.' },
    ],
  },
  tr: {
    title: 'Турецкий: главное для чтения',
    subtitle: 'Этот алфавит спроектировали с нуля в 1928 году — специально под звуки турецкого языка.',
    items: [
      { title: 'Буква = звук, инженерная точность', text: '29 букв почти без исключений. Алфавит подстроили под язык, а не язык под чужие буквы.' },
      { title: 'Гласные договариваются', text: 'Суффиксы меняют гласную под корень. Это гармония гласных: не зубри окончания, слушай рифму слова.' },
      { title: 'Слова растут как поезд', text: 'К корню цепляются суффиксы, каждый со своим смыслом: evlerimden = ev + ler + im + den.' },
    ],
  },
  fr: {
    title: 'Французский: главное для чтения',
    subtitle: 'Во французском много немых букв, но правила чтения на удивление стабильны.',
    items: [
      { title: 'Конечные буквы часто немые', text: 'e, s, t, d на конце обычно не читаются: petit звучит как «пёти». Это регулярно — к этому быстро привыкаешь.' },
      { title: 'Буквы объединяются в звуки', text: 'ou, on, an, ai, eau читаются как единое целое. Выучил сочетание — узнаёшь его в сотнях слов.' },
      { title: 'Значки над буквами помогают', text: 'é, è, ê, ç меняют звук предсказуемо. Диакритика — подсказка, а не помеха.' },
    ],
  },
  it: {
    title: 'Итальянский: главное для чтения',
    subtitle: 'Итальянский выглядит музыкальным не случайно: буквы и слоги в нём обычно читаются очень последовательно.',
    items: [
      { title: 'Гласные почти не спорят с письмом', text: 'A, E, I, O, U обычно звучат стабильно. Это делает чтение заметно проще, чем во французском или английском.' },
      { title: 'C и G меняют звук по соседям', text: 'Перед e и i они мягче: cena, gelato. Перед a, o и u остаются твёрдыми: casa, gatto.' },
      { title: 'Двойные согласные реально слышны', text: 'В словах вроде palla или nonna удвоение не декоративное: оно меняет ритм и помогает различать слова.' },
    ],
  },
};

export function LandingCourseTitle() {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const hydrate = useAppStore(state => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <>
      {interfaceLanguage === 'en' ? 'Learn to read.' : 'Научись читать.'}{' '}
      <br />
      <span className="landing-title-accent">
        {interfaceLanguage === 'en' ? 'Start speaking.' : 'Начни общаться.'}
      </span>
    </>
  );
}

export function LandingLanguagePicker() {
  const courseId = useAppStore(state => state.settings.courseId);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const hydrate = useAppStore(state => state.hydrate);
  const updateSettings = useAppStore(state => state.updateSettings);
  const availableCourseIds = COURSE_IDS.filter(id => !(interfaceLanguage === 'en' && id === 'en'));

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <div className="landing-course-buttons" aria-label={interfaceLanguage === 'en' ? 'Choose course language' : 'Выбрать язык курса'}>
      {availableCourseIds.map(id => {
        const course = COURSES[id];
        const courseName = getCourseName(course.id, interfaceLanguage);
        return (
          <button
            key={course.id}
            type="button"
            className={`landing-course-button ${courseId === course.id ? 'landing-course-button--active' : ''}`}
            onClick={() => updateSettings({ courseId: course.id })}
            aria-label={interfaceLanguage === 'en' ? `Choose ${courseName}` : `Выбрать ${courseName}`}
            aria-pressed={courseId === course.id}
            title={courseName}
          >
            <span>{courseName}</span>
          </button>
        );
      })}
    </div>
  );
}

export function LandingRestaurantBill() {
  const courseId = useAppStore(state => state.settings.courseId);
  const hydrate = useAppStore(state => state.hydrate);
  const [flipped, setFlipped] = useState(false);
  const bill = restaurantBills[courseId];
  const translation = restaurantBillTranslations[courseId];

  useEffect(() => {
    void hydrate();
    setFlipped(false);
  }, [courseId, hydrate]);

  const toggleBill = () => setFlipped(current => !current);
  const handleBillKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleBill();
    }
  };

  const renderBill = (
    currentBill: RestaurantBill,
    options: { translated?: boolean } = {},
  ) => {
    const labels = options.translated
      ? { subtotal: 'Сумма', service: 'Сервис', total: 'Итого' }
      : BILL_LABELS[courseId];

    return (
      <>
        <div className="landing-bill-edge" aria-hidden="true" />
        <div className="landing-bill-top">
          <strong>{currentBill.place}</strong>
          <span>{currentBill.label}</span>
        </div>
        <div className="landing-bill-meta">
          <span>{currentBill.date}</span>
          <span>{currentBill.table}</span>
        </div>
        <div className="landing-bill-lines">
          {currentBill.items.map(item => (
            <div key={`${courseId}-${options.translated ? 'ru' : 'source'}-${item.name}`} className="landing-bill-line">
              <span className="landing-bill-qty">{item.qty}</span>
              <span>
                <strong>{item.name}</strong>
              </span>
              <span>{item.price}</span>
            </div>
          ))}
        </div>
        <div className="landing-bill-summary">
          <span>{labels.subtotal}</span>
          <span>{currentBill.subtotal}</span>
          <span>{labels.service}</span>
          <span>{currentBill.service}</span>
        </div>
        <div className="landing-bill-total">
          <span>{labels.total}</span>
          <strong>{currentBill.total}</strong>
        </div>
        <div className="landing-bill-payment">
          <span>•••• 0426</span>
          <span>{currentBill.payment}</span>
        </div>
        <div className="landing-bill-edge landing-bill-edge--bottom" aria-hidden="true" />
      </>
    );
  };

  return (
    <div
      className={`landing-bill-frame ${flipped ? 'landing-bill-frame--flipped' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? 'Показать чек на языке курса' : 'Показать перевод чека на русский'}
      onClick={toggleBill}
      onKeyDown={handleBillKeyDown}
    >
      <div className="landing-bill-flip">
        <div className="landing-bill landing-bill-face" aria-hidden={flipped}>
          {renderBill(bill)}
        </div>
        <div className="landing-bill landing-bill-face landing-bill-face--back" aria-hidden={!flipped}>
          {renderBill(translation, { translated: true })}
        </div>
      </div>
    </div>
  );
}

export function LandingReadingReasons() {
  const courseId = useAppStore(state => state.settings.courseId);
  const hydrate = useAppStore(state => state.hydrate);
  const reason = readingReasons[courseId];

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <section className="landing-reasons-card" aria-labelledby="landing-reasons-title">
      <div className="landing-reasons-kicker">Перед первым уроком</div>
      <h2 id="landing-reasons-title" className="landing-preview-title">{reason.title}</h2>
      <p className="landing-reasons-subtitle">{reason.subtitle}</p>
      <div className="landing-reasons-list">
        {reason.items.map((item, index) => (
          <div key={item.title} className="landing-reason">
            <span className="landing-reason-index">{index + 1}</span>
            <span className="landing-reason-copy">
              <span className="landing-reason-title">{item.title}</span>
              <span className="landing-reason-text">{item.text}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LandingFinalCtaTitle() {
  const courseId = useAppStore(state => state.settings.courseId);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const hydrate = useAppStore(state => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <>
      {interfaceLanguage === 'en'
        ? `Ready to start reading ${getCourseName(courseId, 'en').toLowerCase()}?`
        : `Готов начать читать ${courseAdverb[courseId]}?`}
    </>
  );
}

export function LandingAlphabetTitle() {
  const courseId = useAppStore(state => state.settings.courseId);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const storedTransliterationMode = useAppStore(state => state.settings.transliterationMode);
  const transliterationMode = getActiveTransliterationMode(interfaceLanguage, courseId, storedTransliterationMode);
  const hydrate = useAppStore(state => state.hydrate);
  const course = COURSES[courseId];

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{getAlphabetDisplayTitle(courseId, transliterationMode) ?? getDisplayText(course.scriptTitleNative, transliterationMode, courseId)}</>;
}
