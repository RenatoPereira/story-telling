# Decision Log

## 2026-03-25 - Initial MVP architecture
- Context: Need animated reading experience with narration and scene context.
- Decision: Use Next.js + scene JSON + Zod + cloud TTS via API route.
- Impact: Fast local iteration, clear separation between content and rendering.
- Rollback: Replace API route with browser TTS fallback if cloud latency/cost is high.

## 2026-03-25 - Reader settings with Zustand + sessionStorage
- Context: Reader settings state was handled by manual subscription code and browser storage events.
- Decision: Migrate reader settings to a Zustand store using `persist` with `sessionStorage`.
- Impact: Simpler state updates in UI, centralized settings management, and per-session persistence.
- Rollback: Restore the previous `useSyncExternalStore` implementation if this introduces hydration issues.

## 2026-03-25 - Story content modularized by hierarchy
- Context: Story data was concentrated in a single `scenes.json`, making maintenance and lookup patterns harder to scale.
- Decision: Split content into `book.json`, character files, chapter metadata files, and scene files by hierarchy.
- Impact: Better maintainability, easier authoring workflow, and explicit ordering by identifiers.
- Rollback: Recompose all modules into a single source file if tooling or import ergonomics become a blocker.

## 2026-03-25 - Story identifier lookup manager
- Context: Character and block resolution depended on repeated nested traversal logic.
- Decision: Introduce `storyContentManager` with indexed lookup methods by identifiers.
- Impact: Simpler and reusable access pattern for character and scene block resolution.
- Rollback: Keep only utility functions in `readerEngine` if a manager abstraction becomes unnecessary.

## 2026-03-25 - Dedicated screen layer
- Context: Route-level screen files were mixed with reusable UI components under `components`.
- Decision: Move screen files to `src/screens/<screen-name>/` and define this as an architecture rule.
- Impact: Clearer separation between route orchestration and reusable component building blocks.
- Rollback: Revert imports and move screens back to feature folders in `components` if this layer adds unnecessary complexity.
