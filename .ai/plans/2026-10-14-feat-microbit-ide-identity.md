# Plan: micro:bit IDE logo identity
**Slug:** feat-microbit-ide-identity
**Date:** 2026-10-14
**Status:** done

## Request
Redesign only /app/blocks/microbit/:moduleNumber to white/cyan/navy with pixel headings and tiny handwritten detail. Preserve simulator, servo/buttons/pins, Blockly categories, Python/JS, copy, navigation and responsive. No logic/generator changes, landing/hub/MakerLabHome/global CSS edits.

## Decision
Use a new IDE-only CSS module with local font registrations referencing existing licensed assets and logo. Update direct JSX colors in MakerMicrobitLesson and Blockly's native theme/category/block color setters in MicrobitBlocklyWorkspace. Apply scoped native Blockly background overrides under this workspace only, because existing global Blockly CSS uses !important. Preserve every block field/type/toolbox contents and all generation/change/resize/disposal logic. MicrobitBoard receives visual color updates for servo only; physical LED/red power and gold contacts remain recognizable.

## Alternatives considered
Global Blockly CSS edits rejected because they affect other lessons. Tailwind class recoloring selectors rejected; use direct component utilities and Blockly-native scoped selectors. No new dependencies.

## Files to change
- src/screens/MakerMicrobitLesson.tsx: palette, logo, pixel headings/important labels, small handwritten Lab detail; visual responsive wrapping, expose existing mode buttons on phones, improve 44px controls; preserve callbacks/content.
- src/components/MicrobitBlocklyWorkspace.tsx: theme/components, block/category colors and grid color only; attach scoped workspace module class.
- src/components/MicrobitBoard.tsx: servo and wire/status styling only, no calculations/LED or button logic changed.
- src/screens/MakerMicrobitLesson.module.css: IDE/heading/signature/fonts and scoped workspace native selectors; no global Tailwind overrides.
- This plan and decision record.

## Invariants check
C1/C3: quality gates before/after. C2/I1: no new lesson or user-visible copy, use existing brand key for logo. I2: wrap controls and stack narrow workspace headings. C5: existing lucide icons. P1–P4, PR1–PR4, L1–L3, G1–G4, C4 and Q1–Q5 unaffected. No route/storage/data/state/generator changes; block style colors only. Preserve module parameters, drag/drop, zoom, callbacks and generated output byte-for-byte.

## Spec changes
None: purely visual, no contract/schema/dependency change.

## Implementation steps
1. Independent plan review before source edits.
2. Add scoped IDE styles/fonts and direct JSX palette; keep state and handlers byte-identical.
3. Update Blockly theme/color setters/category colors and native scoped backgrounds. Keep Nunito on actual block text and pixel only labels/headings.
4. Update servo styling, keep electronics behavior and recognizable hardware colors.
5. Check generator/helper source against HEAD; type/build/biome and diff checks; dual code/kid source review. Check browser availability and disclose if unavailable.

## Rollback
Revert listed source/style files, no migration.

## Review notes
Plan review: PASS. Scope is limited to the micro:bit IDE and its exclusively used workspace/board components (verified import references). The existing global Blockly !important backgrounds justify narrowly scoped native selectors. Decision record is present; no spec changes are needed. Keep category/block distinctions and readable contrast when changing colors; do not alter block fields, generators, simulation, callbacks, or navigation. Before completion verify scoped backgrounds, responsive editor controls, and unchanged generator/helper source, then run all quality gates and dual review.

## Implementation notes
Untracked package-lock.json pre-existing, untouched. Existing placeholder toolbar controls are not repaired (visual-only scope).

First gates all pass. Generator and simulation helper/data/handler sections compared byte-for-byte with HEAD; block registration, toolbox and injection/event/disposal compared with hex colors normalized and match. Browser inventory empty; source-only responsive review pending. No forbidden screens/global CSS changed.

## User steering: module-specific hardware
User additionally authorized module-dependent hardware rendering: modules 1–5 hide servo, cables and angle; module 6 retains them. Parent passes module.number through a required moduleNumber prop; board uses it solely in render conditions. All LED/button/pin/run calculations remain unchanged. Board scene height shrinks for non-servo modules. Kid source review flagged narrow simulator overflow and five cramped tool labels: scale physical scene to 0.84 below 310px container width (physical button still >44px) and stack tools three per row on phones. These visual-only corrections stay inside IDE files. No other requested screen or routing changes.

Final kid review PASS after narrow board/control fixes. Also condition the existing P1 display label on module 6 so modules 1–5 do not advertise a servo in the status card; no pin or run calculations changed. SSR test: 24 render cases covering six modules, two languages, idle/running passed for cables/servo/angle visibility and button retention.

Final: biome ci, type-check, full build/prerender and diff check pass. Code reviewer PASS for design and all module-specific hardware follow-ups. Kid reviewer PASS after scoped small-screen fixes; source simulation only. 24 SSR simulator cases pass. No browser available, so no live drag/drop, zoom, clipboard or touch validation claimed. Placeholder toolbar controls retain their existing behavior. Scope finished without forbidden file edits; package-lock.json left untouched.
