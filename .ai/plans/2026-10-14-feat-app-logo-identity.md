# Plan: App hub logo identity
**Slug:** feat-app-logo-identity
**Date:** 2026-10-14
**Status:** done

## Request
Redesign only /app with supplied logo identity, cyan #10AEC2, white cards, pixel titles and small handwritten detail. Preserve progress, XP/stars, ES/EN, navigation and responsive. Do not touch landing, MakerLabHome, Blockly, IDE or global CSS.

## Decision
Reuse existing logo/font assets without changing them. Add a hub-only CSS module with unique font names. Update light Header/XPBar styles only (light is passed exclusively on /app), exact hub shell colors, and PathSelector cards/headings. Keep progress detection, calculations, routes, stats modal behavior and language logic intact. Existing StatsModal overlay remains unchanged (shared details view outside screen styling scope).

## Alternatives considered
Global branding overrides rejected because they affect lessons. Importing landing CSS rejected because it couples screen styling; reference same asset URLs with separate font names instead.

## Invariants check
Affected C1/C3: run gates; C2/I1: use existing bilingual keys; I2: titles/buttons wrap at mobile widths; C5: existing lucide icons. P1–P4, PR1–PR4, L1–L3, G1–G4, C4, Q1–Q5 unaffected: no new network, storage, auth, scoring, unlock, engine or lessons. Fonts self-hosted and already licensed.

## Files to change
- src/screens/PathSelector.tsx: cyan white cards, pixel h1/h2, tiny Labs signature, existing route labels.
- src/screens/PathSelector.module.css: uniquely named font-face declarations and scoped hub title/signature classes; existing font assets referenced.
- src/App.tsx: colors only in isHub branches.
- src/components/Header.tsx: logo image and cyan styling exclusively in light branches; dark defaults unchanged.
- src/components/XPBar.tsx: light-only compact cyan track/fill.
- This plan and decision record.

## Spec changes
None: existing contracts and data unchanged.

## Implementation steps
1. Independent plan review before source edits.
2. Update hub-only shell, Header, XPBar and cards, preserving state/callbacks/translations.
3. Pixel font regular weight, flexible wrapping; signature only Labs. Keep ≥44px language controls and stats button. Use dark teal for white button labels and small text contrast.
4. Run biome ci, type-check, build, diff check; dual code/kid source reviews. Browser availability must be checked, limitations stated.

## Rollback
Revert listed files; no migration.

## Review notes
Plan review PASS (2026-10-14): scope is bounded to the hub and existing light-only branches. Confirmed Header light mode is selected exclusively by the /app shell and XPBar receives that variant from Header. Decision record is present; no spec/data contract changes or dependencies are required. Keep the small Labs signature derived from the existing hub.brand translation, retain Maker Lab route text, and leave shared StatsModal unchanged. Verify ES/EN title wrapping and ≥44px controls during implementation review; preserve all dark defaults and route/state calculations.

## Implementation notes
Pre-existing untracked package-lock.json untouched.

Implemented approved scope using existing assets. First biome/type-check/build gates pass, including prerender. Browser inventory empty, so responsive source simulation only. No forbidden files changed.

Final quality gates: bunx biome ci, bun run type-check, bun run build and git diff --check pass. Code reviewer PASS; kid reviewer Fun/PASS via source simulation at 320/375px. Dark shared defaults, all route/state/calculation callbacks unchanged; light theme used only on hub. Browser inventory empty; no rendered/touch test claimed. Shared StatsModal and Footer unchanged as scoped. No new dependencies or runtime external calls.
