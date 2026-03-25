# Naming Conventions

## Code Symbols
- React components: `PascalCase` (example: `ReaderScreen`)
- Hooks: `useCamelCase` (example: `useReaderScreenController`)
- Utilities and helpers: `camelCase` (example: `clampBlockIndex`)
- Types and aliases: `PascalCase` (example: `DialogueBlock`)
- Constants: `UPPER_SNAKE_CASE` for immutable globals

## File Names
- Component structure file: `ComponentName.tsx`
- Component hooks file: `ComponentName.hooks.ts`
- Component logic file: `ComponentName.logic.ts`
- Styling approach: Tailwind utility classes in component JSX
- Test files: `ComponentName.test.tsx` or `moduleName.test.ts`
- Preferred folder format: `component-name/ComponentName.tsx`
- Screen files: `src/screens/<screen-name>/ScreenName.tsx`, `ScreenName.hooks.ts`, and `ScreenName.logic.ts`
- Baseline structure for screens/components: presentation file + style file + hooks file

## Story Content JSON
- Keys: `camelCase`
- IDs: `kebab-case`
- Block types: lowercase discriminators (`context`, `dialogue`)
- Hierarchy:
  - `content/<book-id>/book.json`
  - `content/<book-id>/characters/<character-id>.json`
  - `content/<book-id>/chapters/<chapter-id>/chapter.json`
  - `content/<book-id>/chapters/<chapter-id>/scenes/<scene-id>.json`

## Global Stores
- Store folder: `src/stores/<domain>/`
- Zustand entrypoint: `src/stores/<domain>/store.ts`
- Domain types/sanitization: `src/stores/<domain>/settings.ts`
- Public exports: `src/stores/<domain>/index.ts`

## Asset Names
- Character portraits: `characterId-emotion.svg` (example: `kvothe-neutral.svg`)
- Backgrounds: `scene-key.svg` (example: `estalagem.svg`)

## Directory Names
- Use `kebab-case` for content and docs folders.
- Keep domain layers grouped by concern: `components`, `lib`, `content`, `app`.
- Keep route-level screens under `screens` and reusable parts under `components`.
- For Atomic Design:
  - `design-system/atoms`
  - `design-system/molecules`
  - `design-system/organisms`
