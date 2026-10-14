import { TRANSLATIONS as BASE } from './translationsEs'

export type Language = 'en' | 'id'
type Translations = Record<string, string>

// Keep the internal `id` key for compatibility with the original components,
// but it now represents Spanish throughout Mini Maker Labs.
export const TRANSLATIONS: Record<Language, Translations> = {
  en: BASE.en,
  id: BASE.es,
}
