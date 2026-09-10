import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GEORGIAN_ALPHABET,
  GEORGIAN_ALPHABET_ROWS,
  geLetterAudioMap,
  geLetterName,
} from '../lib/georgianAlphabet.ts';
import {
  COURSES,
  COURSE_IDS,
  HIDDEN_ACTIVE_COURSE_IDS,
  PRIMARY_ACTIVE_COURSE_IDS,
  getLetterKind,
  getLetterSpeechLang,
  getLetterSoundLabel,
  getLetterSpeechText,
} from '../lib/courses.ts';

test('Georgian alphabet metadata covers all letters', () => {
  assert.equal(GEORGIAN_ALPHABET.length, 33);
  assert.deepEqual(GEORGIAN_ALPHABET_ROWS.flat(), GEORGIAN_ALPHABET);
  assert.equal(Object.keys(geLetterName).length, GEORGIAN_ALPHABET.length);
  assert.equal(Object.keys(geLetterAudioMap).length, GEORGIAN_ALPHABET.length);
});

test('Georgian alphabet has known first and last letter metadata', () => {
  assert.equal(GEORGIAN_ALPHABET[0], 'ა');
  assert.equal(GEORGIAN_ALPHABET.at(-1), 'ჰ');
  assert.equal(geLetterName['ა'], 'ანი');
  assert.equal(geLetterAudioMap['ჰ'], '/audio/letters/33-hae.mp3');
});

test('course alphabet sections cover every course letter once', () => {
  for (const course of Object.values(COURSES)) {
    const alphabetLetterSet = new Set(course.alphabet);
    const sectionLetters = course.alphabetSections
      .flatMap(section => section.letters)
      .filter(letter => alphabetLetterSet.has(letter));

    assert.deepEqual(
      [...sectionLetters].sort(),
      [...course.alphabet].sort(),
      `${course.id} alphabet sections should cover all letters`,
    );
    assert.equal(
      new Set(sectionLetters).size,
      sectionLetters.length,
      `${course.id} alphabet sections should not duplicate letters`,
    );
  }
});

test('course letter names cover every course letter for audio fallback', () => {
  for (const course of Object.values(COURSES)) {
    for (const letter of course.alphabet) {
      assert.ok(course.letterNames[letter], `${course.id} should expose a spoken name for ${letter}`);
    }
  }
});

test('course alphabet sound labels cover every course letter', () => {
  for (const course of Object.values(COURSES)) {
    for (const letter of course.alphabet) {
      assert.ok(course.letterSoundLabels[letter], `${course.id} should expose an alphabet sound label for ${letter}`);
    }
  }

  assert.equal(getLetterSoundLabel('კ', 'ka'), 'къ');
  assert.equal(getLetterSoundLabel('ქ', 'ka'), 'к');
  assert.equal(getLetterSoundLabel('ყ', 'ka'), 'къ');
  assert.equal(getLetterSoundLabel('ჩ', 'ka'), 'ч');
  assert.equal(getLetterSoundLabel('ჭ', 'ka'), 'чъ');
  assert.equal(getLetterSoundLabel('ც', 'ka'), 'ц');
  assert.equal(getLetterSoundLabel('წ', 'ka'), 'цъ');
  assert.equal(getLetterSoundLabel('A', 'en'), 'эй');
  assert.equal(getLetterSoundLabel('B', 'en'), 'би');
  assert.equal(getLetterSoundLabel('C', 'en'), 'си');
});

test('course alphabets classify vowels and consonants', () => {
  for (const course of Object.values(COURSES)) {
    assert.ok(course.vowels.length > 0, `${course.id} should define vowels`);

    for (const vowel of course.vowels) {
      assert.ok(course.alphabet.includes(vowel), `${course.id}:${vowel} vowel should exist in alphabet`);
      assert.equal(getLetterKind(vowel, course.id), 'vowel');
    }

    const consonants = course.alphabet.filter(letter => !course.vowels.includes(letter));
    assert.ok(consonants.length > 0, `${course.id} should have consonants`);
    assert.equal(getLetterKind(consonants[0], course.id), 'consonant');
  }

  assert.equal(getLetterKind('ა', 'ka'), 'vowel');
  assert.equal(getLetterKind('ბ', 'ka'), 'consonant');
  assert.equal(getLetterKind('İ', 'tr'), 'vowel');
  assert.equal(getLetterKind('Ñ', 'es'), 'consonant');
  assert.equal(getLetterKind('Ä', 'de'), 'vowel');
});

test('non-Georgian TTS fallback speaks safe phonetic labels', () => {
  const forbiddenSpeechFragments = [
    'capital',
    'letter',
    'мягк',
    'нем',
    'долг',
    '/',
    '.',
  ];

  for (const courseId of ['sr', 'tr', 'es', 'en', 'de'] as const) {
    for (const letter of COURSES[courseId].alphabet) {
      const speechText = getLetterSpeechText(letter, courseId);
      assert.ok(
        speechText.length > 0,
        `${courseId}:${letter} should send a non-empty TTS label`,
      );
      for (const fragment of forbiddenSpeechFragments) {
        assert.ok(
          !speechText.toLowerCase().includes(fragment),
          `${courseId}:${letter} should not send "${speechText}" to TTS`,
        );
      }
    }

    assert.equal(getLetterSpeechLang(courseId), 'ru-RU');
  }

  assert.equal(getLetterSpeechText('А', 'sr'), 'а');
  assert.equal(getLetterSpeechText('Ğ', 'tr'), 'г');
  assert.equal(getLetterSpeechText('H', 'es'), 'не читается');
  assert.equal(getLetterSpeechText('W', 'en'), 'дабл ю');
  assert.equal(getLetterSpeechText('ẞ', 'de'), 'сс');
});

test('courses with teaching-specific signs expose a separate visual section', () => {
  assert.equal(COURSES.de.alphabetSections[0]?.title, 'Основные буквы');
  assert.ok(
    ['Запомни отдельно', 'Особые буквы немецкого'].includes(COURSES.de.alphabetSections.at(-1)?.title ?? ''),
    `de last alphabet section should be a teaching-specific letter section`,
  );
  assert.deepEqual(COURSES.de.alphabetSections.at(-1)?.letters, ['Ä', 'Ö', 'Ü', 'ẞ']);

  assert.equal(COURSES.sr.alphabetSections[0]?.title, 'Основные буквы');
  assert.deepEqual(COURSES.sr.alphabetSections[0]?.letters, COURSES.sr.alphabet);
  assert.equal(COURSES.sr.alphabetSections.length, 1);
  assert.deepEqual(COURSES.sr.alphabetHighlightedLetters, ['Ђ', 'Љ', 'Њ', 'Ћ', 'Џ']);

  assert.equal(COURSES.ka.alphabetSections[0]?.title, 'Основные буквы');
  assert.deepEqual(COURSES.ka.alphabetSections[0]?.letters, COURSES.ka.alphabet);
  assert.equal(COURSES.ka.alphabetSections.length, 1);
  assert.equal(COURSES.ka.alphabetHighlightedLetters, undefined);

  assert.equal(COURSES.es.alphabetSections[0]?.title, 'Основные буквы');
  assert.deepEqual(COURSES.es.alphabetSections[0]?.letters, COURSES.es.alphabet);
  assert.equal(COURSES.es.alphabetSections.length, 1);

  assert.equal(COURSES.tr.alphabetSections[0]?.title, 'Основные буквы');
  assert.deepEqual(COURSES.tr.alphabetSections[0]?.letters, COURSES.tr.alphabet);
  assert.equal(COURSES.tr.alphabetSections.length, 1);

  assert.equal(COURSES.en.alphabetSections[0]?.title, 'Основные буквы');
  assert.deepEqual(COURSES.en.alphabetSections[0]?.letters, COURSES.en.alphabet);
  assert.equal(COURSES.en.alphabetSections.length, 1);
});

test('course primary alphabets are displayed as one uninterrupted grid', () => {
  const primaryAlphabetByCourse = {
    ka: COURSES.ka.alphabet,
    sr: COURSES.sr.alphabet,
    tr: COURSES.tr.alphabet,
    en: COURSES.en.alphabet,
    es: COURSES.es.alphabet,
    de: COURSES.de.alphabet.filter(letter => !['Ä', 'Ö', 'Ü', 'ẞ'].includes(letter)),
    fr: COURSES.fr.alphabet.filter(letter => !['À', 'Â', 'Ç', 'É', 'È', 'Ê', 'Ë', 'Î', 'Ï', 'Ô', 'Œ', 'Ù', 'Û'].includes(letter)),
    it: COURSES.it.alphabet.filter(letter => !['J', 'K', 'W', 'X', 'Y'].includes(letter)),
  } as const;

  for (const courseId of COURSE_IDS) {
    const primary = primaryAlphabetByCourse[courseId];
    const matchingSections = COURSES[courseId].alphabetSections.filter((section) => (
      section.letters.length > 0 &&
      section.letters.every(letter => primary.includes(letter)) &&
      primary.every(letter => section.letters.includes(letter))
    ));

    assert.equal(matchingSections.length, 1, `${courseId} should render its primary alphabet in one section`);
    assert.deepEqual(matchingSections[0]?.letters, primary, `${courseId} primary alphabet order should stay intact`);
  }
});

test('course list order matches product language switcher order', () => {
  assert.deepEqual(COURSE_IDS, ['ka', 'en', 'es', 'de', 'fr', 'it', 'sr', 'tr']);
  assert.deepEqual(
    COURSE_IDS.map(courseId => COURSES[courseId].sourceLanguageLabel),
    ['🇬🇪', '🇬🇧', '🇪🇸', '🇩🇪', '🇫🇷', '🇮🇹', '🇷🇸', '🇹🇷'],
  );
});

test('landing language portfolio keeps only Georgian active in the main flow', () => {
  assert.deepEqual(PRIMARY_ACTIVE_COURSE_IDS, ['ka']);
  assert.deepEqual(HIDDEN_ACTIVE_COURSE_IDS, ['sr', 'tr', 'es', 'de', 'en', 'fr', 'it']);
});
