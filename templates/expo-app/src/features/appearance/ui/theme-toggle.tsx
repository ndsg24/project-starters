import { useTranslation } from 'react-i18next'

import { usePreferences } from '@/shared/preferences'
import { Button } from '@/shared/ui'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { preferences, ready, setTheme } = usePreferences()

  return (
    <Button
      label={t(preferences.theme)}
      accessibilityLabel={t('switchTheme')}
      selected={preferences.theme === 'light'}
      disabled={!ready}
      onPress={() => setTheme(preferences.theme === 'dark' ? 'light' : 'dark')}
    />
  )
}
