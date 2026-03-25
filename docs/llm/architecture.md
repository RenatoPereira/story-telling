# Architecture

## Stack
- Next.js App Router + TypeScript
- TailwindCSS + Framer Motion
- Zod for content schema validation
- Zustand for global reader settings state
- Cloud TTS via API route

## Main Modules
- `src/content/o-nome-do-vento/book.json`: book metadata and ordering (`characterIds`, `chapterIds`)
- `src/content/o-nome-do-vento/characters/*.json`: one file per character
- `src/content/o-nome-do-vento/chapters/<chapter-id>/chapter.json`: chapter metadata and scene ordering
- `src/content/o-nome-do-vento/chapters/<chapter-id>/scenes/<scene-id>.json`: one file per scene
- `src/content/o-nome-do-vento/index.ts`: story composition entrypoint from split files
- `src/lib/story/schema.ts`: runtime validation
- `src/lib/story/readerEngine.ts`: pure reading helpers
- `src/lib/story/storyContentManager.ts`: indexed lookup manager by identifiers
- `src/screens/*`: route-level screens and screen orchestration
- `src/components/reader/*`: reusable reader UI blocks
- `src/stores/reader-settings/*`: Zustand store, settings sanitization, and persistence
- `src/lib/theme/colorPalettes.ts`: global palette configuration
- `src/design-system/atoms/*`: shared UI primitives (atomic design base)
- `src/app/api/tts/route.ts`: TTS provider integration

## Data Flow
1. Compose story data from `book.json`, character files, chapter files, and scene files.
2. Parse and validate the composed story object at app startup.
3. Keep UI playback state for active scene and active dialogue line.
4. Keep reader preferences in a global Zustand store persisted in `sessionStorage`.
5. Apply color palette and accessibility settings from global store to CSS variables.
6. Render scene layers: background -> narration -> dialogue -> controls.
7. Sync current block ID with URL query for deep link opening (`blockId`).
8. Send aggregated text to TTS endpoint when user requests narration.
9. Play returned audio in browser.

## Guardrails
- Keep domain logic in pure functions when possible.
- Keep rendering components focused on display concerns.
- Never trust raw JSON without schema validation.
