import type { LocalizedString } from '../types'
import type { Language } from './translationsMx'

const SPANISH_LOCALIZED: Record<string, string> = {
  'Jungle Adventure': 'Aventura en la selva',
  'Help Bingo the Monkey find bananas!': '¡Ayuda a Bingo el mono a encontrar bananas!',
  'Sequences': 'Secuencias',
  'Space Station': 'Estación espacial',
  'Help Astro collect stars in space!': '¡Ayuda a Astro a recoger estrellas en el espacio!',
  'Loops': 'Bucles',
  'Loop Land': 'Tierra de bucles',
  'Help Dash race through the track efficiently!': '¡Ayuda a Dash a recorrer la pista de forma eficiente!',
  'Loop Efficiency': 'Eficiencia de bucles',
  'Ocean Deep': 'Océano profundo',
  'Help Finn the Diver explore the ocean!': '¡Ayuda a Finn a explorar el océano!',
  'Variables': 'Variables',
  'Crystal Caves': 'Cuevas de cristal',
  'Help Zara find crystals in magic caves!': '¡Ayuda a Zara a encontrar cristales en cuevas mágicas!',
  'Conditions': 'Condiciones',
  'Robot Factory': 'Fábrica de robots',
  'Help Bolt build robots with functions!': '¡Ayuda a Bolt a construir robots usando funciones!',
  'Functions': 'Funciones',
  'Time Portal': 'Portal del tiempo',
  'Help Nova travel through time with arrays!': '¡Ayuda a Nova a viajar en el tiempo usando arreglos!',
  'Arrays & Lists': 'Arreglos y listas',
  'Jurassic Park': 'Parque jurásico',
  'Rescue dino eggs before they hatch!': '¡Rescata huevos de dinosaurio antes de que eclosionen!',
  'Real-World Pathfinding': 'Búsqueda de rutas',
  'City Parking': 'Estacionamiento urbano',
  'Sort and park cars in the busy city!': '¡Ordena y estaciona autos en la ciudad!',
  'Sorting & Routing': 'Ordenamiento y rutas',
  'Space Sorting': 'Clasificación espacial',
  'Organize packages in the space warehouse!': '¡Organiza paquetes en el almacén espacial!',
  'Algorithms & Data': 'Algoritmos y datos',
}

export function localize(field: LocalizedString, language: Language): string {
  if (language === 'en') return field.en
  // The original project only shipped EN/ID data objects. Mini Maker Labs no longer
  // exposes Indonesian; known labels are translated here and everything else falls
  // back to English until the lesson datasets are migrated to native ES fields.
  return SPANISH_LOCALIZED[field.en] ?? field.en
}
