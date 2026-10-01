export const languages = ['es', 'en', 'pt'] as const
export type Language = (typeof languages)[number]
export type ThemeName = 'dark' | 'light'
export interface Preferences {
  theme: ThemeName
  language: Language
}
export const defaultPreferences: Preferences = { theme: 'dark', language: 'es' }

export function parsePreferences(value: unknown): Preferences {
  if (typeof value !== 'object' || value === null) return { ...defaultPreferences }
  const stored = value as Record<string, unknown>
  return {
    theme: stored.theme === 'light' ? 'light' : 'dark',
    language: languages.find((language) => language === stored.language) ?? 'es',
  }
}
