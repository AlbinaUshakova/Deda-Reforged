# Serbian Full Track Audit

Date: 2026-09-04

## Scope

This audit covers the full Serbian path:

- `ep1`
- `ep2`
- `ep3`
- `ep4`
- `ep5`
- `ep6`
- `ep7`
- `ep8`

## Overall finding

The Serbian course is structurally solid and production-usable.
Its main weakness is not broken sequencing, but a slightly less rewarding tone in a few places compared with the Georgian benchmark.

## Strong lessons

- `ep2` is concrete and readable: `рука`, `уста`, `сок`, `нос`, `лист`, `стена`.
- `ep3` stays strong with family and everyday words: `мама`, `тата`, `вода`, `вино`, `брат`.
- `ep4` is one of the cleaner mid-path lessons: `град`, `здраво`, `хлеб`, `храна`, `хотел`, `гора`.
- `ep5` remains vivid and memorable: `цена`, `цвет`, `црква`, `школа`, `чај`, `чаша`, `човек`.
- `ep6` is also strong: `живот`, `жена`, `нож`, `кафа`, `филм`, `флаша`, `шеф`.
- `ep8` handles hard letters reasonably well and still gives real reading wins: `ђак`, `кућа`, `ноћ`, `џеп`, `џем`, `џемпер`.

## Lessons adjusted in this pass

### `ep1`

- The lesson was still too dominated by pronoun permutations.
- Replaced several repetitive pattern cards with readable names and simpler combinations:
  - `не он` -> `Ана`
  - `не она` -> `Нина`
  - `не они` -> `Нена`
  - `она и он` -> `Ина`
  - `он и они` -> `Ана и Нина`
  - `они и она` -> `она и Ана`
  - `и она` -> `Нина и она`
  - `он и она` -> `не Ана`

Result:

- The opening lesson still works within a narrow letter set, but now feels less like grammar drilling and more like readable first wins.

### `ep7`

- The lesson stayed structurally valid, but had duplicated abstract comparatives and too much possessive repetition.
- Replaced weaker cards with more concrete nouns and a simple object phrase:
  - `бољи` -> `књига`
  - `боље` -> `кухиња`
  - `њено уље` -> `књига је ту`

Result:

- `ep7` now feels more object-based and less repetitive while still reinforcing `Љ` and `Њ`.

## Production status

- Serbian is consistent enough to stay as the second active script-first course after Georgian.
- Georgian is still the stronger benchmark for emotional reward and lesson sharpness.
- Serbian no longer has any obvious lesson that feels broken or clearly off-direction.

## Verification

- `npm run check:lesson-letters` passed on 2026-09-04.
- `npm run typecheck` passed on 2026-09-04.
