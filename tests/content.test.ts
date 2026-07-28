import test from 'node:test';
import assert from 'node:assert/strict';

import { listEpisodes, loadEpisode, loadNewLettersPerEpisode } from '../lib/content.ts';
import { COURSES, isCourseLetter } from '../lib/courses.ts';
import { PHRASE_INTENT_IDS, PHRASE_INTENT_SECTIONS } from '../lib/phraseIntents.ts';

test('canonical beginner phrase intent list contains 60 distinct intents', () => {
  assert.equal(PHRASE_INTENT_IDS.length, 60);
  assert.equal(new Set(PHRASE_INTENT_IDS).size, 60);
  assert.equal(PHRASE_INTENT_SECTIONS.length, 10);

  for (const intentId of [
    'please_request',
    'you_are_welcome',
    'go_ahead',
    'excuse_me_attention',
    'sorry_fault',
    'let_me_pass',
    'thanks',
    'thanks_very_much',
  ]) {
    assert.ok(PHRASE_INTENT_IDS.includes(intentId));
  }
});

test('listEpisodes returns lessons plus special sections', async () => {
  const episodes = await listEpisodes();
  const ids = episodes.map((episode) => episode.id);

  assert.equal(episodes[0]?.id, 'ep1');
  assert.equal(episodes[9]?.id, 'ep9');
  assert.equal(episodes[10]?.id, 'ep10');
  assert.equal(episodes[10]?.title, 'Приветствия и прощания');
  assert.equal(episodes[20]?.id, 'ep10k');
  assert.equal(episodes[20]?.title, 'Числа');
  assert.equal(episodes[21]?.id, 'favorites');
  assert.ok(ids.includes('favorites'));
  assert.ok(ids.includes('all'));
  assert.ok(!ids.includes('phrases'));
  assert.ok(!episodes.some((episode) => episode.title === 'Покупки и числа'));
});

test('loadEpisode returns normalized phrases episode', async () => {
  const episode = await loadEpisode('phrases');

  assert.ok(episode);
  assert.equal(episode.id, 'ep10');
  assert.ok(episode.cards.length > 0);
  assert.ok(episode.cards.every((card) => !card.ge_text.includes('и')));
});

test('loadEpisode returns the first Georgian thematic phrase section', async () => {
  const episode = await loadEpisode('ep10');

  assert.ok(episode);
  assert.equal(episode.id, 'ep10');
  assert.equal(episode.title, 'Приветствия и прощания');
  assert.equal(episode.cards.length, 6);
  assert.ok(episode.cards.every((card) => card.type === 'word'));
  assert.ok(episode.cards.every((card) => /[\u10D0-\u10FF]/.test(card.ge_text)));
  assert.ok(episode.cards.every((card) => card.ru_meaning.trim().length > 0));
  assert.ok(episode.cards.some((card) => card.ru_meaning === 'Здравствуйте'));
  assert.ok(episode.cards.some((card) => card.ru_meaning === 'Доброе утро'));
  assert.ok(episode.cards.every((card) => card.intent_id));
});

test('compact conversational minimum does not include fill-in templates', async () => {
  const episode = await loadEpisode('ep10');

  assert.ok(episode);
  const templates = episode.cards.filter((card) => card.ru_meaning.includes('...'));
  assert.equal(templates.length, 0);
});

test('loadEpisode generates short Russian variants for у меня есть answers', async () => {
  const episode = await loadEpisode('ep7');

  assert.ok(episode);
  const tea = episode.cards.find((card) => card.ge_text === 'მე მაქვს ჩაი');
  assert.ok(tea);
  assert.ok(tea.accepted_ru?.includes('есть чай'));
});

test('loadEpisode generates short Russian variants for хочу and нужен answers', async () => {
  const lessonWithWant = await loadEpisode('ep8');
  const phrases = await loadEpisode('ep10j');

  assert.ok(lessonWithWant);
  assert.ok(phrases);

  const water = lessonWithWant.cards.find((card) => card.ge_text === 'მე მინდა წყალი');
  assert.ok(water);
  assert.ok(water.accepted_ru?.includes('хочу воду'));

  const help = phrases.cards.find((card) => card.ge_text === 'დახმარება მჭირდება');
  assert.ok(help);
  assert.ok(help.accepted_ru?.some((answer) => answer.toLowerCase() === 'нужна помощь'));
});

test('loadEpisode favorites includes conversational phrases', async () => {
  const episode = await loadEpisode('favorites');

  assert.ok(episode);
  assert.equal(episode.id, 'favorites');
  assert.ok(episode.cards.some((card) => card.ge_text === 'გამარჯობა'));
});

test('loadNewLettersPerEpisode returns letters for each numbered lesson', async () => {
  const lettersByEpisode = await loadNewLettersPerEpisode();

  assert.ok(Array.isArray(lettersByEpisode.ep1));
  assert.ok(Array.isArray(lettersByEpisode.ep9));
});

test('course alphabets and special letters are covered by lessons', async () => {
  for (const courseId of ['ka', 'sr', 'tr', 'es', 'de', 'en'] as const) {
    const course = COURSES[courseId];
    const lettersByEpisode = await loadNewLettersPerEpisode(courseId);
    const taughtLetters = new Set(Object.values(lettersByEpisode).flat());
    const missingLetters = course.alphabet.filter((letter) => !taughtLetters.has(letter));

    assert.deepEqual(missingLetters, [], `${courseId} should teach every alphabet letter`);

    for (const section of course.alphabetSections) {
      const missingSectionLetters = section.letters
        .filter((letter) => course.alphabet.includes(letter))
        .filter((letter) => !taughtLetters.has(letter));
      assert.deepEqual(
        missingSectionLetters,
        [],
        `${courseId}:${section.title} should be covered by lessons`,
      );
    }
  }
});

test('course cards are real words or phrases, not standalone letter drills', async () => {
  for (const courseId of ['ka', 'sr', 'tr', 'es', 'de', 'en'] as const) {
    const episodes = await listEpisodes(courseId);

    for (const { id } of episodes) {
      if (id === 'favorites' || id === 'all') continue;

      const episode = await loadEpisode(id, courseId);
      assert.ok(episode);
      assert.ok(
        episode.cards.every((card) => card.type !== 'letter'),
        `${courseId}:${id} should not include letter-only drill cards`,
      );
    }
  }
});

test('non-Georgian courses load conversational lessons without shopping section', async () => {
  for (const courseId of ['sr', 'tr', 'es', 'de', 'en'] as const) {
    const episodes = await listEpisodes(courseId);
    const ids = episodes.map((episode) => episode.id);

    assert.ok(ids.includes('ep1'), `${courseId} should include ep1`);
    assert.ok(ids.includes('all'), `${courseId} should include all lessons`);
    assert.ok(ids.includes('favorites'), `${courseId} should include favorites`);
    if (courseId === 'de' || courseId === 'en' || courseId === 'es' || courseId === 'sr' || courseId === 'tr') {
      assert.ok(episodes.some((episode) => episode.title === 'Вежливость'), `${courseId} should include thematic politeness lesson`);
      assert.ok(!episodes.some((episode) => episode.title === 'Вежливые фразы'), `${courseId} should not include the old combined phrases lesson`);
      assert.ok(episodes.some((episode) => episode.title === 'Приветствия и прощания'), `${courseId} should include greeting lesson`);
      assert.ok(episodes.some((episode) => episode.title === 'Основные вопросы'), `${courseId} should include question lesson`);
      assert.ok(episodes.some((episode) => episode.title === 'Понимание языка'), `${courseId} should include language lesson`);
    } else {
      assert.ok(episodes.some((episode) => episode.title === 'Вежливые фразы'), `${courseId} should include conversational lesson`);
    }
    assert.ok(!episodes.some((episode) => episode.title === 'Покупки и числа'), `${courseId} should not include shopping lesson`);
    assert.ok(!ids.includes('phrases'), `${courseId} should not list phrases as a special section`);
  }
});

test('all thematic conversational lessons use the 10 canonical beginner sections', async () => {
  const georgianSections = [
    ['ep10', 'Приветствия и прощания', 'გამარჯობა'],
    ['ep10b', 'Вежливость', 'მადლობა'],
    ['ep10c', 'Знакомство', 'რა გქვია?'],
    ['ep10d', 'Простые ответы', 'კი'],
    ['ep10e', 'Понимание языка', 'არ მესმის'],
    ['ep10f', 'Основные вопросы', 'ეს რა არის?'],
    ['ep10g', 'Магазин и оплата', 'რამდენი ღირს?'],
    ['ep10h', 'Кафе и еда', 'მენიუ, თუ შეიძლება'],
    ['ep10i', 'Общественные места', 'ტუალეტი სად არის?'],
    ['ep10j', 'Помощь и самочувствие', 'დახმარება მჭირდება'],
  ] as const;
  const germanSections = [
    ['ep7a', 'Приветствия и прощания', 'Hallo'],
    ['ep7b', 'Вежливость', 'Danke'],
    ['ep7c', 'Знакомство', 'Wie heißen Sie?'],
    ['ep7d', 'Простые ответы', 'Ja'],
    ['ep7e', 'Понимание языка', 'Ich verstehe nicht'],
    ['ep7f', 'Основные вопросы', 'Was ist das?'],
    ['ep7g', 'Магазин и оплата', 'Wie viel kostet das?'],
    ['ep7h', 'Кафе и еда', 'Die Speisekarte, bitte'],
    ['ep7i', 'Общественные места', 'Wo ist die Toilette?'],
    ['ep7j', 'Помощь и самочувствие', 'Ich brauche Hilfe'],
  ] as const;
  const serbianSections = [
    ['ep9a', 'Приветствия и прощания', 'Здраво'],
    ['ep9b', 'Вежливость', 'Хвала'],
    ['ep9c', 'Знакомство', 'Како се зовете?'],
    ['ep9d', 'Простые ответы', 'Да'],
    ['ep9e', 'Понимание языка', 'Не разумем'],
    ['ep9f', 'Основные вопросы', 'Шта је ово?'],
    ['ep9g', 'Магазин и оплата', 'Колико кошта?'],
    ['ep9h', 'Кафе и еда', 'Мени, молим'],
    ['ep9i', 'Общественные места', 'Где је тоалет?'],
    ['ep9j', 'Помощь и самочувствие', 'Треба ми помоћ'],
  ] as const;
  const turkishSections = [
    ['ep10a', 'Приветствия и прощания', 'Merhaba'],
    ['ep10b', 'Вежливость', 'Teşekkür ederim'],
    ['ep10c', 'Знакомство', 'Adınız ne?'],
    ['ep10d', 'Простые ответы', 'Evet'],
    ['ep10e', 'Понимание языка', 'Anlamıyorum'],
    ['ep10f', 'Основные вопросы', 'Bu ne?'],
    ['ep10g', 'Магазин и оплата', 'Ne kadar?'],
    ['ep10h', 'Кафе и еда', 'Menü, lütfen'],
    ['ep10i', 'Общественные места', 'Tuvalet nerede?'],
    ['ep10j', 'Помощь и самочувствие', 'Yardıma ihtiyacım var'],
  ] as const;
  const spanishSections = [
    ['ep11a', 'Приветствия и прощания', 'Hola'],
    ['ep11b', 'Вежливость', 'Gracias'],
    ['ep11c', 'Знакомство', '¿Cómo se llama?'],
    ['ep11d', 'Простые ответы', 'Sí'],
    ['ep11e', 'Понимание языка', 'No entiendo'],
    ['ep11f', 'Основные вопросы', '¿Qué es esto?'],
    ['ep11g', 'Магазин и оплата', '¿Cuánto cuesta?'],
    ['ep11h', 'Кафе и еда', 'El menú, por favor'],
    ['ep11i', 'Общественные места', '¿Dónde está el baño?'],
    ['ep11j', 'Помощь и самочувствие', 'Necesito ayuda'],
  ] as const;
  const englishSections = [
    ['ep9a', 'Приветствия и прощания', 'Hello'],
    ['ep9b', 'Вежливость', 'Thank you'],
    ['ep9c', 'Знакомство', 'What is your name?'],
    ['ep9d', 'Простые ответы', 'Yes'],
    ['ep9e', 'Понимание языка', 'I do not understand'],
    ['ep9f', 'Основные вопросы', 'What is this?'],
    ['ep9g', 'Магазин и оплата', 'How much is it?'],
    ['ep9h', 'Кафе и еда', 'The menu, please'],
    ['ep9i', 'Общественные места', 'Where is the toilet?'],
    ['ep9j', 'Помощь и самочувствие', 'I need help'],
  ] as const;

  for (const [episodeId, title, samplePhrase] of georgianSections) {
    const episode = await loadEpisode(episodeId, 'ka');

    assert.ok(episode);
    assert.equal(episode.title, title);
    assert.ok(episode.cards.some((card) => card.ge_text === samplePhrase));
  }

  for (const [episodeId, title, samplePhrase] of germanSections) {
    const episode = await loadEpisode(episodeId, 'de');

    assert.ok(episode);
    assert.equal(episode.title, title);
    assert.ok(episode.cards.some((card) => card.ge_text === samplePhrase));
  }

  for (const [episodeId, title, samplePhrase] of serbianSections) {
    const episode = await loadEpisode(episodeId, 'sr');

    assert.ok(episode);
    assert.equal(episode.title, title);
    assert.ok(episode.cards.some((card) => card.ge_text === samplePhrase));
  }

  for (const [episodeId, title, samplePhrase] of turkishSections) {
    const episode = await loadEpisode(episodeId, 'tr');

    assert.ok(episode);
    assert.equal(episode.title, title);
    assert.ok(episode.cards.some((card) => card.ge_text === samplePhrase));
  }

  for (const [episodeId, title, samplePhrase] of spanishSections) {
    const episode = await loadEpisode(episodeId, 'es');

    assert.ok(episode);
    assert.equal(episode.title, title);
    assert.ok(episode.cards.some((card) => card.ge_text === samplePhrase));
  }

  for (const [episodeId, title, samplePhrase] of englishSections) {
    const episode = await loadEpisode(episodeId, 'en');

    assert.ok(episode);
    assert.equal(episode.title, title);
    assert.ok(episode.cards.some((card) => card.ge_text === samplePhrase));
  }
});

test('Georgian beginner phrase sections cover all 60 canonical intents', async () => {
  const sectionIds = ['ep10', 'ep10b', 'ep10c', 'ep10d', 'ep10e', 'ep10f', 'ep10g', 'ep10h', 'ep10i', 'ep10j'];
  const episodes = await Promise.all(sectionIds.map(id => loadEpisode(id, 'ka')));
  const cards = episodes.flatMap(episode => episode?.cards ?? []);
  const intentIds = cards.map(card => card.intent_id).filter((id): id is string => Boolean(id));

  assert.equal(cards.length, 60);
  assert.deepEqual(new Set(intentIds), new Set(PHRASE_INTENT_IDS));
  assert.ok(cards.every(card => card.ge_text.trim().length > 0));
  assert.ok(cards.every(card => card.ru_meaning.trim().length > 0));
});

test('Turkish beginner phrase sections cover all 60 canonical intents', async () => {
  const sectionIds = ['ep10a', 'ep10b', 'ep10c', 'ep10d', 'ep10e', 'ep10f', 'ep10g', 'ep10h', 'ep10i', 'ep10j'];
  const episodes = await Promise.all(sectionIds.map(id => loadEpisode(id, 'tr')));
  const cards = episodes.flatMap(episode => episode?.cards ?? []);
  const intentIds = cards.map(card => card.intent_id).filter((id): id is string => Boolean(id));

  assert.equal(cards.length, 60);
  assert.deepEqual(new Set(intentIds), new Set(PHRASE_INTENT_IDS));
  assert.ok(cards.every(card => card.ge_text.trim().length > 0));
  assert.ok(cards.every(card => card.ru_meaning.trim().length > 0));
});

test('Serbian beginner phrase sections cover all 60 canonical intents', async () => {
  const sectionIds = ['ep9a', 'ep9b', 'ep9c', 'ep9d', 'ep9e', 'ep9f', 'ep9g', 'ep9h', 'ep9i', 'ep9j'];
  const episodes = await Promise.all(sectionIds.map(id => loadEpisode(id, 'sr')));
  const cards = episodes.flatMap(episode => episode?.cards ?? []);
  const intentIds = cards.map(card => card.intent_id).filter((id): id is string => Boolean(id));

  assert.equal(cards.length, 60);
  assert.deepEqual(new Set(intentIds), new Set(PHRASE_INTENT_IDS));
  assert.ok(cards.every(card => card.ge_text.trim().length > 0));
  assert.ok(cards.every(card => card.ru_meaning.trim().length > 0));
});

test('Spanish beginner phrase sections cover all 60 canonical intents', async () => {
  const sectionIds = ['ep11a', 'ep11b', 'ep11c', 'ep11d', 'ep11e', 'ep11f', 'ep11g', 'ep11h', 'ep11i', 'ep11j'];
  const episodes = await Promise.all(sectionIds.map(id => loadEpisode(id, 'es')));
  const cards = episodes.flatMap(episode => episode?.cards ?? []);
  const intentIds = cards.map(card => card.intent_id).filter((id): id is string => Boolean(id));

  assert.equal(cards.length, 60);
  assert.deepEqual(new Set(intentIds), new Set(PHRASE_INTENT_IDS));
  assert.ok(cards.every(card => card.ge_text.trim().length > 0));
  assert.ok(cards.every(card => card.ru_meaning.trim().length > 0));
});

test('German beginner phrase sections cover all 60 canonical intents', async () => {
  const sectionIds = ['ep7a', 'ep7b', 'ep7c', 'ep7d', 'ep7e', 'ep7f', 'ep7g', 'ep7h', 'ep7i', 'ep7j'];
  const episodes = await Promise.all(sectionIds.map(id => loadEpisode(id, 'de')));
  const cards = episodes.flatMap(episode => episode?.cards ?? []);
  const intentIds = cards.map(card => card.intent_id).filter((id): id is string => Boolean(id));

  assert.equal(cards.length, 60);
  assert.deepEqual(new Set(intentIds), new Set(PHRASE_INTENT_IDS));
  assert.ok(cards.every(card => card.ge_text.trim().length > 0));
  assert.ok(cards.every(card => card.ru_meaning.trim().length > 0));
});

test('English beginner phrase sections cover all 60 canonical intents', async () => {
  const sectionIds = ['ep9a', 'ep9b', 'ep9c', 'ep9d', 'ep9e', 'ep9f', 'ep9g', 'ep9h', 'ep9i', 'ep9j'];
  const episodes = await Promise.all(sectionIds.map(id => loadEpisode(id, 'en')));
  const cards = episodes.flatMap(episode => episode?.cards ?? []);
  const intentIds = cards.map(card => card.intent_id).filter((id): id is string => Boolean(id));

  assert.equal(cards.length, 60);
  assert.deepEqual(new Set(intentIds), new Set(PHRASE_INTENT_IDS));
  assert.ok(cards.every(card => card.ge_text.trim().length > 0));
  assert.ok(cards.every(card => card.ru_meaning.trim().length > 0));
  assert.ok(cards.every(card => card.translit?.trim()));
});

test('special lesson list items expose phrase counts', async () => {
  const episodes = await listEpisodes('de');
  const politeness = episodes.find(episode => episode.id === 'ep7b');
  const loadedPoliteness = await loadEpisode('ep7b', 'de');

  assert.ok(politeness);
  assert.ok(loadedPoliteness);
  assert.equal(politeness.cardCount, loadedPoliteness.cards.length);
  assert.equal(politeness.cardCount, 8);
});

test('non-Georgian favorites include conversational phrases', async () => {
  const serbianFavorites = await loadEpisode('favorites', 'sr');
  const turkishFavorites = await loadEpisode('favorites', 'tr');
  const spanishFavorites = await loadEpisode('favorites', 'es');
  const germanFavorites = await loadEpisode('favorites', 'de');
  const englishFavorites = await loadEpisode('favorites', 'en');

  assert.ok(serbianFavorites);
  assert.ok(turkishFavorites);
  assert.ok(spanishFavorites);
  assert.ok(germanFavorites);
  assert.ok(englishFavorites);
  assert.ok(serbianFavorites.cards.some((card) => card.ge_text === 'Здраво'));
  assert.ok(turkishFavorites.cards.some((card) => card.ge_text === 'Merhaba'));
  assert.ok(spanishFavorites.cards.some((card) => card.ge_text === 'Hola'));
  assert.ok(germanFavorites.cards.some((card) => card.ge_text === 'Hallo'));
  assert.ok(englishFavorites.cards.some((card) => card.ge_text === 'Hello'));
});

function isReadingLesson(episode: { id: string; title: string }) {
  return /^ep\d+[a-z]*$/i.test(episode.id) && /^Урок /.test(episode.title);
}

function expectedReadingLessonCardRange(index: number) {
  if (index < 2) return { min: 8, max: 14 };
  if (index < 5) return { min: 10, max: 16 };
  return { min: 12, max: 18 };
}

test('reading lessons stay compact for decoding practice', async () => {
  for (const courseId of ['ka', 'sr', 'tr', 'es', 'de', 'en'] as const) {
    const episodes = await listEpisodes(courseId);
    const lessons = episodes.filter(isReadingLesson);

    assert.ok(lessons.length > 0);

    for (const [index, episode] of lessons.entries()) {
      const content = await loadEpisode(episode.id, courseId);
      const { min, max } = expectedReadingLessonCardRange(index);

      assert.ok(content);
      assert.ok(
        content.cards.length >= min && content.cards.length <= max,
        `${courseId}:${episode.id} should contain ${min}-${max} focused cards, got ${content.cards.length}`,
      );
    }
  }
});

test('reading lessons include the target number of short phrases', async () => {
  for (const courseId of ['ka', 'sr', 'tr', 'es', 'de', 'en'] as const) {
    const episodes = await listEpisodes(courseId);
    const readingLessons = episodes.filter(isReadingLesson);

    for (const [index, lesson] of readingLessons.entries()) {
      const raw = await loadEpisode(lesson.id, courseId);
      assert.ok(raw);

      const phraseCount = raw.cards.filter((card) => /\s/.test(card.ge_text.trim())).length;
      const maxPhrases = index < 2 ? 6 : index < 5 ? 7 : 8;
      assert.ok(
        phraseCount >= 2,
        `${courseId}:${lesson.id} should include at least 2 phrases, got ${phraseCount}`,
      );
      assert.ok(
        phraseCount <= maxPhrases,
        `${courseId}:${lesson.id} should include at most ${maxPhrases} phrases, got ${phraseCount}`,
      );
    }
  }
});

test('english reading lesson cards provide manual pronunciation hints', async () => {
  const episodes = await listEpisodes('en');
  const readingLessons = episodes.filter(isReadingLesson);

  for (const { id: episodeId } of readingLessons) {
    const episode = await loadEpisode(episodeId, 'en');
    assert.ok(episode);

    for (const card of episode.cards) {
      assert.ok(
        card.translit?.trim(),
        `en:${episodeId}:${card.ge_text} should use manual pronunciation hint`,
      );
    }
  }

  const firstLesson = await loadEpisode('ep1', 'en');
  assert.ok(firstLesson?.cards.every((card) => card.translit));
});

test('english course cards provide manual pronunciation hints', async () => {
  const episodes = await listEpisodes('en');

  for (const { id: episodeId } of episodes) {
    if (episodeId === 'favorites' || episodeId === 'all') continue;

    const episode = await loadEpisode(episodeId, 'en');
    assert.ok(episode);

    for (const card of episode.cards) {
      assert.ok(
        card.translit?.trim(),
        `en:${episodeId}:${card.ge_text} should not fall back to letter-by-letter hints`,
      );
    }
  }
});

test('course lessons do not repeat the same card inside one lesson', async () => {
  for (const courseId of ['ka', 'sr', 'tr', 'es', 'de', 'en'] as const) {
    const episodes = await listEpisodes(courseId);

    for (const episode of episodes) {
      if (episode.id === 'favorites' || episode.id === 'all') continue;

      const content = await loadEpisode(episode.id, courseId);
      assert.ok(content);

      const seenCards = new Set<string>();
      for (const card of content.cards) {
        const text = card.ge_text.trim().toLocaleLowerCase(courseId);
        assert.ok(!seenCards.has(text), `${courseId}:${episode.id} repeats card "${card.ge_text}"`);
        seenCards.add(text);
      }
    }
  }
});

test('reading lessons avoid rare dictionary-only starter words', async () => {
  const bannedMeanings = [
    'Иверия',
    'Ана',
    'Нина',
    'Нена',
    'осёл',
    'осел',
    'народ',
    'смешивание',
    'смешивается',
    'горный хребет',
    'логово',
    'солдат',
    'зрелый',
    'внезапный',
    'судьба',
    'основа',
    'фаза',
    'гражданин',
    'лидер',
    'лингвистика',
    'источник',
    'поперёк',
    'поперек',
    'сеть',
    'железо',
    'лечение',
    'наслаждаться',
    'присоединиться',
    'дополнительно',
    'отдельно',
    'обычай',
    'умеренный',
  ].map((meaning) => meaning.toLocaleLowerCase('ru'));

  for (const courseId of ['ka', 'sr', 'tr', 'es', 'de', 'en'] as const) {
    const episodes = await listEpisodes(courseId);

    for (const episode of episodes.filter(isReadingLesson)) {
      const content = await loadEpisode(episode.id, courseId);
      assert.ok(content);

      for (const card of content.cards) {
        assert.ok(
          !bannedMeanings.includes(card.ru_meaning.toLocaleLowerCase('ru')),
          `${courseId}:${episode.id} has non-conversational starter card "${card.ge_text}" — "${card.ru_meaning}"`,
        );
      }
    }
  }
});

test('reading lessons avoid standalone one-letter or one-symbol cards', async () => {
  for (const courseId of ['ka', 'sr', 'tr', 'es', 'de', 'en'] as const) {
    const episodes = await listEpisodes(courseId);

    for (const episode of episodes.filter(isReadingLesson)) {
      const content = await loadEpisode(episode.id, courseId);
      assert.ok(content);

      for (const card of content.cards) {
        const sourceChars = Array.from(card.ge_text.replace(/[\s?.!,¿¡-]/g, ''));
        assert.ok(
          sourceChars.length > 1,
          `${courseId}:${episode.id} has standalone symbol card "${card.ge_text}"`,
        );
      }
    }
  }
});

test('reading lesson cards use only current and previous lesson letters', async () => {
  for (const courseId of ['ka', 'sr', 'tr', 'es', 'de', 'en'] as const) {
    const episodes = await listEpisodes(courseId);
    const lettersByEpisode = await loadNewLettersPerEpisode(courseId);
    const seen = new Set<string>();

    for (const { id: episodeId, title } of episodes) {
      if (!isReadingLesson({ id: episodeId, title })) continue;

      for (const letter of lettersByEpisode[episodeId]) {
        seen.add(letter);
        seen.add(letter.toLocaleLowerCase(courseId));
      }

      const episode = await loadEpisode(episodeId, courseId);
      assert.ok(episode);

      for (const card of episode.cards) {
        for (const character of card.ge_text.replace(/\s|-/g, '')) {
          assert.ok(
            !isCourseLetter(character.toLocaleUpperCase(courseId), courseId) || seen.has(character),
            `${courseId}:${episodeId}: ${card.ge_text} uses unopened letter ${character}`,
          );
        }
      }
    }
  }
});
