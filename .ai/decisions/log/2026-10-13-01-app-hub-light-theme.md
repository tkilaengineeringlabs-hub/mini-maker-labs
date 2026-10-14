# App hub light theme

Date: 2026-10-13

Use an exact /app shell check and opt-in component variants. Global CSS replacement would unintentionally change Blockly, lesson screens and other routes. Keep the existing rounded title font fallback rather than adding a runtime font dependency. Shared components retain dark defaults.
