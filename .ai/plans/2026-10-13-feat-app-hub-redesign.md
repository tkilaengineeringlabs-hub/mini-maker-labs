# Plan: Phase 1 app hub redesign

**Slug:** `feat-app-hub-redesign`
**Date:** 2026-10-13
**Status:** done

## Request
Redesign only /app with white, navy and light blue; preserve navigation, progress, ES/EN and responsiveness. Do not edit MakerLabHome, micro:bit IDE, Blockly, lessons or global CSS. Review dependent components first; run type-check/build.

## Decision
Use an exact /app pathname check in GameLayout to select a light shell and an opt-in light Header/compact XPBar variant. Keep all descendant screens on their existing defaults. Use existing rounded title font fallback without adding a remote font. Scope new copy to hub translation keys.

## Alternatives considered
Global palette replacement rejected because it affects lessons. Separate duplicated header rejected because it duplicates navigation and stats logic.

## Invariants check
Affected: INV-C1/C3 (type/build checks), INV-C2/I1 (new bilingual keys), INV-I2 (wrapping responsive layout), INV-C5 (lucide icons only). P1–P4, PR1–PR4, L1–L3, G1–G4, C4 and Q1–Q5 unaffected: no runtime network, persistence, scoring, unlock, engine or lesson changes.

## Files to change
- src/App.tsx: exact hub light shell, no ambient stars at hub; retain existing footer in navy container.
- src/components/Header.tsx: optional light variant, defaults unchanged; accessible language pressed state.
- src/components/XPBar.tsx: opt-in compact light colors, same XP calculation.
- src/screens/PathSelector.tsx: whitespace, white cards, navy actions, light blue accents, translated copy, focus rings and 44px targets.
- src/i18n/translationsMx.ts: hub-only title/subtitle/brand keys in EN and Spanish.
- This plan and new decision record.

## Spec changes
None: no schema, route, language contract or lessons changed.

## Implementation steps
1. Review plan independently before source edits.
2. Apply exact-path light shell and opt-in header/XP colors.
3. Refine hub cards and scoped bilingual copy; preserve destination and progress detection logic.
4. Run biome ci, type-check, build; inspect responsive hub and route interactions.
5. Obtain parallel code and kid reviews, resolve findings, close plan.

## Rollback
Revert listed source changes; no data migration needed.

## Review notes
Plan review — Pass. Scope is restricted to the /app hub and opt-in shared component variants; existing route destinations and progress calculations remain unchanged. The decision record documents the isolation strategy and no spec changes are required. Preserve existing defaults for every descendant screen, translate all new hub copy through the active ES/EN dictionary, and verify a narrow mobile viewport including the XP, stats and language controls. The planned biome, type-check, build and dual review gates are required before closing the plan.

Approved baseline repair within PathSelector: replace the unavailable lucide-react Blocks3 export with Blocks. This is required to restore type-check and preserves the functional route icon using the existing icon library.

## Implementation notes
Pre-existing untracked package-lock.json will be left untouched.

Implemented listed source changes. Type-check passed. Build passed; one simultaneous build attempt collided with another prerender, so final gates run sequentially. No browser is available through CUA; responsive behavior reviewed from source only. Existing package-lock.json untouched.

Final verification: bunx biome ci, bun run type-check, bun run build and git diff --check pass. Code reviewer: pass after hub-only back aria label. Kid reviewer: Fun / Pass after 44x44 ES/EN targets, source simulation only. No connected browser, so visual/touch validation remains unperformed. Phase 2 not started.
