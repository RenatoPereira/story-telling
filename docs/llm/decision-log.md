# Decision Log

## 2026-03-25 - Initial MVP architecture
- Context: Need animated reading experience with narration and scene context.
- Decision: Use Next.js + scene JSON + Zod + cloud TTS via API route.
- Impact: Fast local iteration, clear separation between content and rendering.
- Rollback: Replace API route with browser TTS fallback if cloud latency/cost is high.
