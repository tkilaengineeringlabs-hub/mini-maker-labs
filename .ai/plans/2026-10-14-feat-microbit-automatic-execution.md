# Plan: Automatic micro:bit simulation
**Slug:** feat-microbit-automatic-execution
**Date:** 2026-10-14
**Status:** done

## Request
Activate the simulator automatically. Button A/B event bodies run only on their event; plain sequences run at startup. Reset returns to boot state. Preserve LEDs, pins, servo, Python/JS generation, Blockly and design. Execution changes confined to MakerMicrobitLesson.tsx and MicrobitBoard.tsx.

## Decision
Replace whole-code last-icon guessing with a restricted parser for existing generated Python/JS syntax, an immutable state reducer and cancellable sequential scheduler. No eval or arbitrary code execution. Parse Python indentation and JS braces while respecting quoted strings and comments; event bodies excluded from boot actions. Actual display/clear, digital pins, servo and bounded wait commands execute in order. Unsupported statements are ignored, unsupported scopes never flattened into startup actions.

## Alternatives considered
Evaluating Python/JS or introducing an interpreter rejected: unnecessary dependency and exposure of browser APIs. Reusing whole-code substring guesses rejected: triggers events at startup and ignores waits/ordering.

## Invariants check
Affected C1/C3: passed type/build; C2/I1: existing localized UI unchanged, status uses existing ES/EN text. G4 conceptual sandbox preserved: simulator never evaluates source code; no callable browser globals exposed. P1–P4, PR1–PR4, L1–L3, G1–G3, C4/C5, I2, Q1–Q5 unaffected: no network, persistence, route, progress, unlock, lesson, visual/icon changes. Work limited to existing two execution components, meaningful tests and harness documentation.

## Files to change
- src/screens/MakerMicrobitLesson.tsx: always-active simulator, restart key for replay/reset/mode switch, consume real pin state; ignore guessed workspace preview; keep copy/generators/JSX styles intact.
- src/components/MicrobitBoard.tsx: limited parser, event selection, state reducer, cancellable jobs and automatic mount/code/module/restart execution; geometry/style unchanged.
- tests/microbitAutomaticExecution.test.ts: 14 regression cases for events, nesting, comment/string isolation, waits, cancellation, pins/servo and unchanged-source restart.
- This plan and decision record. Original proposal/review was in /tmp/microbit-auto-plan.md; copied into tracked harness record after completion.

## Spec changes
None: generator/API/routes/storage/lesson contracts unchanged.

## Implementation steps
1. Independent plan review before implementation.
2. Implement limited parser/state/scheduler and parent activation/reset wiring.
3. Separate event jobs by button; cancel all pending jobs on code/module/reset/unmount; restart even when switching Blocks to Python with identical source.
4. Run regression tests, biome ci, type-check, build and diff checks.
5. Dual code/kid reviews, fix/re-review issues, close plan.

## Rollback
Revert this change; no storage migration.

## Review notes
Plan reviewer approved before source changes. Code review initially caught unchanged-source Blocks-to-Python mode not restarting; fixed by advancing restartKey on actual mode changes and added lifecycle regression. Final code review PASS. Kid review Fun/PASS: event-only boot is blank, direct A/B feedback persists, waits and Reset work; existing optional Start/Run retained as replay to preserve design.

## Implementation notes
14 regression tests pass (36 assertions). bunx biome ci, bun run type-check, bun run build/full prerender and git diff --check pass. Tests verify parser/reducer/scheduler; no DOM integration/browser playback claimed. Existing module-six hardware rendering retained. Blockly workspace/generators, all designs and forbidden screens unchanged. Pre-existing package-lock.json excluded. Source parser supports existing generated instruction subset rather than arbitrary Python/JS.
