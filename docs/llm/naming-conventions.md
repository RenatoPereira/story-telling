# Naming Conventions

## Code Symbols
- React components: `PascalCase` (example: `ReaderScreen`)
- Hooks: `useCamelCase` (example: `useReaderScreenController`)
- Utilities and helpers: `camelCase` (example: `clampBlockIndex`)
- Types and aliases: `PascalCase` (example: `DialogueBlock`)
- Constants: `UPPER_SNAKE_CASE` for immutable globals

## File Names
- Component structure file: `ComponentName.tsx`
- Component logic file: `ComponentName.logic.ts`
- Styling approach: Tailwind utility classes in component JSX
- Test files: `ComponentName.test.tsx` or `moduleName.test.ts`
- Preferred folder format: `component-name/ComponentName.tsx`

## Story Content JSON
- Keys: `camelCase`
- IDs: `kebab-case`
- Block types: lowercase discriminators (`context`, `dialogue`)

## Asset Names
- Character portraits: `characterId-emotion.svg` (example: `kvothe-neutral.svg`)
- Backgrounds: `scene-key.svg` (example: `estalagem.svg`)

## Directory Names
- Use `kebab-case` for content and docs folders.
- Keep domain layers grouped by concern: `components`, `lib`, `content`, `app`.
- For Atomic Design:
  - `design-system/atoms`
  - `design-system/molecules`
  - `design-system/organisms`
