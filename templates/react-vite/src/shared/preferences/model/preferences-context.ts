import { createContext, useContext } from 'react'

import type { Language, Preferences, ThemeName } from '../domain/preferences'

export interface PreferencesContextValue {
  preferences: Preferences
  ready: boolean
  setTheme(theme: ThemeName): void
  setLanguage(language: Language): void
}
export const PreferencesContext = createContext<PreferencesContextValue | null>(null)
export function usePreferences(): PreferencesContextValue {
  const value = useContext(PreferencesContext)

  if (!value) {
    throw new Error('PreferencesProvider is required')
  }

  return value
}
