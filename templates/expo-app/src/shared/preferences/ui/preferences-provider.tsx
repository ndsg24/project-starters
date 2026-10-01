'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '../../i18n'
import { defaultPreferences } from '../domain/preferences'
import type { Language, Preferences, ThemeName } from '../domain/preferences'
import { PreferencesContext } from '../model/preferences-context'
import type { PreferencesProviderProps } from './preferences-provider.types'

export function PreferencesProvider({ children, store }: PreferencesProviderProps) {
  const [instance] = useState(() => createI18n())
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
  const [ready, setReady] = useState(false)
  const current = useRef<Preferences>(defaultPreferences)
  const persistence = useRef(Promise.resolve())

  useEffect(() => {
    let active = true
    void store
      .load()
      .catch(() => ({ ...defaultPreferences }))
      .then(async (stored) => {
        if (!active) return
        await instance.changeLanguage(stored.language)
        if (!active) return
        current.current = stored
        setPreferences(stored)
        setReady(true)
      })
    return () => {
      active = false
    }
  }, [instance, store])

  const update = useCallback(
    (patch: Partial<Preferences>) => {
      const next = { ...current.current, ...patch }
      current.current = next
      setPreferences(next)
      void instance.changeLanguage(next.language)
      persistence.current = persistence.current.then(() => store.save(next)).catch(() => {})
    },
    [instance, store],
  )
  const setTheme = useCallback((theme: ThemeName) => update({ theme }), [update])
  const setLanguage = useCallback((language: Language) => update({ language }), [update])
  const value = useMemo(
    () => ({ preferences, ready, setTheme, setLanguage }),
    [preferences, ready, setTheme, setLanguage],
  )

  return (
    <I18nextProvider i18n={instance}>
      <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
    </I18nextProvider>
  )
}
