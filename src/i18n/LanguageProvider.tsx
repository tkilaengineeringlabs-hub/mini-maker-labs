import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { TRANSLATIONS, type Language } from './translationsMx'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const LANG_KEY = 'mini_maker_labs_language'
export const LANG_PARAM = 'lang'

function getLangFromSearch(): Language | null {
  if (typeof window === 'undefined') return null
  const fromSearch = new URLSearchParams(window.location.search).get(LANG_PARAM)
  if (fromSearch === 'en') return 'en'
  if (fromSearch === 'es' || fromSearch === 'id') return 'id'
  return null
}

function getInitialLanguage(): Language {
  const fromSearch = getLangFromSearch()
  if (fromSearch) return fromSearch
  const stored = localStorage.getItem(LANG_KEY)
  if (stored === 'en' || stored === 'id') return stored
  // Mini Maker Labs is Spanish-first. English remains available from the selector.
  return 'id'
}

interface LanguageProviderProps {
  children: ReactNode
  forcedInitialLanguage?: Language
}

export function LanguageProvider({ children, forcedInitialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    () => forcedInitialLanguage ?? getInitialLanguage(),
  )

  useEffect(() => {
    if (forcedInitialLanguage === undefined) return
    const detected = getInitialLanguage()
    setLanguageState(prev => (detected !== prev ? detected : prev))
  }, [forcedInitialLanguage])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANG_KEY, lang)
  }, [])

  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language]
    let text = dict[key] ?? TRANSLATIONS.en[key] ?? key
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be within LanguageProvider')
  return ctx
}
