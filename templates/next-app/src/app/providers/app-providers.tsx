'use client'

import { useEffect } from 'react'

import type { ReactNode } from 'react'

import { PreferencesProvider, browserPreferencesStore, usePreferences } from '@/shared/preferences'

function DocumentPreferences() {
  const { preferences, ready } = usePreferences()

  useEffect(() => {
    if (!ready) {
      return
    }

    document.documentElement.dataset.theme = preferences.theme
    document.documentElement.lang = preferences.language
  }, [preferences, ready])

  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider store={browserPreferencesStore}>
      <DocumentPreferences />
      {children}
    </PreferencesProvider>
  )
}
