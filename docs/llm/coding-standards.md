# Coding Standards

## General
- Use strict TypeScript types; avoid `any`.
- Prefer small, composable components and pure helper functions.
- Keep file names and exports consistent and predictable.

## React and Next.js
- Prefer Server Components by default.
- Use client components only when browser APIs, animations, or local state are required.
- Keep API routes focused and explicit in error handling.
- Avoid hidden side effects in render paths.

## Separation Of Concerns
- Every feature must live in its own folder to improve decoupling:
  - `feature-name/ComponentName.tsx` (structure)
  - `feature-name/ComponentName.logic.ts` (logic)
  - styles should be composed with Tailwind utility classes directly in JSX
- Avoid flat component files directly under `components/` for new work.
- Keep orchestration and state transitions in logic files, not directly in JSX trees.
- Avoid CSS Modules and keep styling in Tailwind for consistency.

## Design System And Atomic Design
- Use design-system primitives for shared UI behavior and visual consistency.
- Follow Atomic Design folder hierarchy when possible:
  - atoms: primitive controls and text
  - molecules: small combinations of atoms
  - organisms: composed sections/screens
- Build feature UIs by composing atoms -> molecules -> organisms.
- Do not duplicate core button/modal/input implementations across features.
- Keep shared visual tokens driven by theme CSS variables consumed by Tailwind classes.

## Styling and UX
- Prioritize readability on top of dynamic backgrounds.
- Use high-opacity surfaces plus blur for readability over complex backgrounds.
- Ensure controls have clear disabled/loading states.
- Keep animation subtle and non-blocking.
- Use palette variables (`--app-*`) for colors instead of hardcoded hex values.
- Follow the official visual tokens in `docs/llm/style-system.md`.

## Error Handling
- Return actionable messages from API routes.
- In UI, surface user-friendly messages and preserve current reading context.

## Performance
- Avoid unnecessary re-renders by memoizing derived values.
- Load only required scene assets for current flow.
