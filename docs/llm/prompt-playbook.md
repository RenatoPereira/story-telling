# Prompt Playbook

## New Feature Prompt
```
Implement <feature> in this codebase.
Context files:
- docs/llm/project-context.md
- docs/llm/architecture.md
- docs/llm/coding-standards.md
- docs/llm/testing-strategy.md
Requirements:
- Keep API stable
- Add tests
- Explain trade-offs briefly
```

## Bugfix Prompt
```
Fix <bug_description>.
Steps:
1) Reproduce and explain root cause.
2) Implement minimal fix.
3) Add or update tests proving the fix.
4) Provide risk notes.
```

## Refactor Prompt
```
Refactor <module_path> for readability and maintainability.
Do not change external behavior.
Add tests to lock current behavior before refactor if missing.
```
