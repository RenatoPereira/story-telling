# Testing Strategy

## Test Pyramid
- Unit tests for story engine helpers and schema behavior.
- Integration tests for component behavior with representative scene data.
- E2E test for primary reading flow and controls.

## Minimum Coverage Targets
- `readerEngine` helpers: all branches.
- Scene rendering: narration and dialogue states.
- TTS request handling: success and failure paths.

## Acceptance Criteria Per Feature
- Feature has at least one happy-path automated test.
- Feature has one error-path assertion when applicable.
- Manual smoke check on `npm run dev` confirms expected UX.

## Regression Checklist
- Scene navigation does not break text rendering.
- Dialogue controls remain bounded and stable.
- Audio controls show loading and handle failure.
