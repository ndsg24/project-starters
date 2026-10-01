import type { Preferences } from './preferences'

export interface PreferencesStorePort {
  load(): Promise<Preferences>
  save(preferences: Preferences): Promise<void>
}
