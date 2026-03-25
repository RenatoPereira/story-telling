# Project Context

## Goal
Build a local MVP reading experience for the book "O Nome do Vento" with:
- progressive text reveal
- contextual background transitions
- dialogue-focused character cards
- optional cloud TTS narration

## MVP Scope
- Support at least 3 scenes from structured content files organized as chapter and scene hierarchy.
- Render narration and dialogue in sequence.
- Allow user-driven navigation between scenes and dialogue lines.
- Trigger cloud TTS for current scene text.
- Support configurable reading accessibility (font size, reduced motion, contrast mode).
- Support 5 user-selectable color systems across the whole app.
- Keep reader settings in a global client store with per-session persistence.

## Non-Goals (MVP)
- Full book ingestion and chapter management.
- User accounts, persistence, analytics.
- Multi-language support.

## Product Principles
- Reading comfort first (legibility, pacing, atmosphere).
- Errors should fail gracefully and remain understandable.
- Keep all content and rendering deterministic and testable.
- Keep theming centralized and token-based to avoid visual drift.
- Keep story content split by domain boundaries (`characters`, `chapters`, `scenes`) for scalable authoring.
