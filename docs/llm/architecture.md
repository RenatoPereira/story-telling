# Architecture

## Stack
- Next.js App Router + TypeScript
- TailwindCSS + Framer Motion
- Zod for content schema validation
- Cloud TTS via API route

## Main Modules
- `src/content/o-nome-do-vento/scenes.json`: source-of-truth scene data
- `src/lib/story/schema.ts`: runtime validation
- `src/lib/story/readerEngine.ts`: pure reading helpers
- `src/components/reader/*`: visual rendering blocks and playback orchestration
- `src/lib/config/readerSettings.ts`: settings persistence contract
- `src/lib/theme/colorPalettes.ts`: global palette configuration
- `src/design-system/atoms/*`: shared UI primitives (atomic design base)
- `src/app/api/tts/route.ts`: TTS provider integration

## Data Flow
1. Parse and validate scene JSON at app startup.
2. Keep UI state for active scene and active dialogue line.
3. Apply color palette and accessibility settings from `localStorage` to CSS variables.
4. Render scene layers: background -> narration -> dialogue -> controls.
5. Sync current block ID with URL query for deep link opening (`blockId`).
6. Send aggregated text to TTS endpoint when user requests narration.
7. Play returned audio in browser.

## Guardrails
- Keep domain logic in pure functions when possible.
- Keep rendering components focused on display concerns.
- Never trust raw JSON without schema validation.
