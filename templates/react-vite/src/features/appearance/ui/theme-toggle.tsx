'use client'

import { useTranslation } from 'react-i18next'
import { usePreferences } from '@/shared/preferences'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { preferences, ready, setTheme } = usePreferences()

  return (
    <button
      type="button"
      className="control"
      disabled={!ready}
      aria-label={t('switchTheme')}
      aria-pressed={preferences.theme === 'light'}
      onClick={() => setTheme(preferences.theme === 'dark' ? 'light' : 'dark')}>
      {t(preferences.theme)}
    </button>
  )
}
