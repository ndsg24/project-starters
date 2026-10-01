import type { ReactNode } from 'react'
import type { PreferencesStorePort } from '../domain/preferences-store.port'

export interface PreferencesProviderProps {
  children: ReactNode
  store: PreferencesStorePort
}
