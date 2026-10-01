import { defaultPreferences, parsePreferences } from '../domain/preferences'
import type { Preferences } from '../domain/preferences'
import type { PreferencesStorePort } from '../domain/preferences-store.port'

const KEY = 'starter-preferences'

export const browserPreferencesStore: PreferencesStorePort = {
  async load() {
    try {
      return parsePreferences(JSON.parse(localStorage.getItem(KEY) ?? 'null'))
    } catch {
      return { ...defaultPreferences }
    }
  },
  async save(preferences: Preferences) {
    try {
      localStorage.setItem(KEY, JSON.stringify(preferences))
    } catch {
      /* Storage may be unavailable in private sessions. */
    }
  },
}
