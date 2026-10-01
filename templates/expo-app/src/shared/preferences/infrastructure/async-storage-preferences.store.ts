import AsyncStorage from '@react-native-async-storage/async-storage'
import { defaultPreferences, parsePreferences } from '../domain/preferences'
import type { Preferences } from '../domain/preferences'
import type { PreferencesStorePort } from '../domain/preferences-store.port'

const KEY = 'starter-preferences'
export const nativePreferencesStore: PreferencesStorePort = {
  async load() {
    try {
      return parsePreferences(JSON.parse((await AsyncStorage.getItem(KEY)) ?? 'null'))
    } catch {
      return { ...defaultPreferences }
    }
  },
  async save(preferences: Preferences) {
    await AsyncStorage.setItem(KEY, JSON.stringify(preferences))
  },
}
