# Deda release QA checklist

Use this checklist before every public release. Mark an item complete only after checking the release candidate, not an older local build.

## 1. Automated checks

- [x] `npm run typecheck` passes.
- [x] `npm run lint -- --quiet` passes.
- [x] `npm test` passes.
- [x] `npm run check:lesson-letters` passes.
- [x] `npm run build` passes.

## 2. Landing

- [x] The page loads without an error overlay or console error.
- [x] The interface language can be changed between English and Russian.
- [x] Georgian and Serbian can be selected; hidden courses stay outside the main flow.
- [x] Serbian script selection appears only on the landing page and persists after selection.
- [x] The main CTA opens Lessons, where the correct recommended lesson is shown first.
- [x] Footer links open Help, Privacy, and Support the project.
- [x] Support the project opens the PayPal page with a customer-entered amount.

## 3. Lessons

- [x] The recommended lesson and its action match saved progress.
- [x] Lesson cards show the correct letters, card counts, and state.
- [x] The next lesson opens at 5 practice points; later lessons remain locked.
- [x] Lesson numbering and status icons are not duplicated.
- [x] Saved words and review counts match the visible decks.
- [x] Review includes only cards from opened lessons.
- [x] Extra practice sections open the correct decks.

## 4. Study

- [x] The first card and its main action are visible without unnecessary scrolling.
- [x] Previous and Next work at both ends of the deck.
- [x] Card flipping, audio, hints, and favorites work.
- [x] Adding or removing a favorite updates the saved deck after navigation or reload.
- [x] Transliteration is visible by default only in the configured early lessons.
- [x] Stronger lessons and special decks keep transliteration hidden by default.
- [x] Progress copy is short, accurate, and does not promise a nonexistent next lesson.
- [x] Home and Practice navigation open the expected screens.

## 5. Play

- [x] Correct answers are accepted by the button and Enter key.
- [x] Incorrect answers keep the field usable and show clear feedback.
- [x] The board is not cleared unexpectedly after answer feedback.
- [ ] Awarded pieces can be placed and points update correctly.
- [ ] The lesson unlock message appears only when useful moves remain.
- [ ] Game-over and success messages remain visible above the cat and board.
- [x] The cat sits on the board boundary without covering feedback or controls.
- [x] Header actions appear once and match the Study screen.

## 6. Support modes

- [x] Empty favorites show an intentional empty state, never `Episode not found`.
- [x] Non-empty favorites show the exact visible card count.
- [x] Review is locked before the first lesson threshold and grows by opened lesson.
- [x] Favorites, review, and phrase decks do not inherit lesson unlock behavior.
- [x] Special decks explain their purpose in one short sentence.

## 7. Mobile

Check at 320 px, 375 px, and 430 px widths.

- [x] The header stays on one line without overlap.
- [x] Deda returns to the landing page; the alphabet and menu remain reachable.
- [x] Lesson title and action buttons do not wrap unexpectedly.
- [x] Study keeps the word and flip action visible first.
- [x] Play keeps the prompt, input, and game board visually dominant.
- [x] Back, Next, progress, and support controls do not cover core content.
- [x] There is no horizontal page overflow.

## 8. English

- [x] Landing, Lessons, Study, Play, Help, Privacy, and Support use English UI copy.
- [x] Lesson words have correct English meanings and natural answer variants.
- [x] Georgian and Serbian labels do not fall back to Russian.
- [x] Long English labels fit mobile controls without clipping.

## 9. Persistence and release smoke test

- [x] Course, script, interface language, favorites, and progress survive reload.
- [x] Direct links to Landing, Lessons, Study, Play, Help, Privacy, and Support load.
- [x] The public production URL uses HTTPS.
- [x] The production environment contains `NEXT_PUBLIC_DONATION_URL`.
- [ ] One low-value real PayPal payment is completed and recorded correctly.

## Release result

- Date: 2026-09-10
- Build or commit: `d6d4610`
- Desktop checked: 1280 × 720
- Mobile checked: 320 × 844, 375 × 844, 430 × 844
- Languages checked: Georgian and Serbian; Russian and English interface
- Blocking issues: Fixed direct access to locked Study and Play lessons; fixed mobile alphabet overlap.
- Non-blocking issues: Manual piece placement, game-over overlays, and one real PayPal transaction remain owner checks.
- Release decision: Go; complete the low-value PayPal transaction separately.
