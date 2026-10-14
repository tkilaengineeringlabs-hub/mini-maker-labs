# micro:bit IDE visual isolation
Date: 2026-10-14
Use direct JSX styling, native Blockly theme/color configuration, and native Blockly selectors scoped under an IDE workspace CSS-module class. Existing global backgrounds use !important; local scoped background overrides are needed to keep this workspace white without changing other Blockly lessons. Actual block text remains readable Nunito while titles use existing local pixel font assets. Servo skin changes only; LEDs, contacts and wire roles remain recognizable. No generator or simulation behavior changes.
