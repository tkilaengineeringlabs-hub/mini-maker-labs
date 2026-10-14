import { TRANSLATIONS as BASE } from './translationsEs'

export type Language = 'en' | 'id'
type Translations = Record<string, string>

// Keep the internal `id` key for compatibility with the original components,
// but it now represents Spanish throughout Mini Maker Labs.
export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    ...BASE.en,
    'landing.paths.blocks.title': 'Maker Lab',
    'landing.paths.blocks.desc': 'Build real projects with blocks, electronics and hardware. Start with micro:bit and grow into robotics.',
    'landing.paths.blocks.concepts': 'micro:bit · Electronics · Sensors · Servos · Robotics · Python',
    'landing.worlds.blocks.label': 'Maker Lab',
    'path.blocks.name': 'Maker Lab',
    'path.blocks.desc': 'Build with micro:bit, electronics, sensors, servos and visual programming.',
    'home.welcome': 'Welcome to Mini Maker Labs!',
    'home.subtitle': 'Choose a maker path and start building. ⚡',
  },
  id: {
    ...BASE.es,
    'landing.paths.blocks.title': 'Maker Lab',
    'landing.paths.blocks.desc': 'Construye proyectos reales con bloques, electrónica y hardware. Empieza con micro:bit y avanza hacia robótica.',
    'landing.paths.blocks.concepts': 'micro:bit · Electrónica · Sensores · Servos · Robótica · Python',
    'landing.worlds.blocks.label': 'Maker Lab',
    'path.blocks.name': 'Maker Lab',
    'path.blocks.desc': 'Construye con micro:bit, electrónica, sensores, servos y programación visual.',
    'home.welcome': '¡Bienvenido a Mini Maker Labs!',
    'home.subtitle': 'Elige una ruta maker y empieza a construir. ⚡',
  },
}
