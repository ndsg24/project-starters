import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { ThemeToggle } from '@/features/appearance'
import { LanguageSelect } from '@/features/language'
import { usePreferences } from '@/shared/preferences'
import { themes, spacing, sizes } from '@/shared/theme'

export function PreferencesPanel() {
  const { t } = useTranslation()
  const { preferences } = usePreferences()
  const theme = themes[preferences.theme]

  return (
    <View style={[styles.panel, { borderColor: theme.line }]}>
      <Text accessibilityRole="header" style={[styles.label, { color: theme.accent }]}>
        {t('preferences')}
      </Text>
      <Text style={[styles.body, { color: theme.muted }]}>{t('persistence')}</Text>
      <Text style={[styles.label, { color: theme.muted }]}>{t('language')}</Text>
      <LanguageSelect />
      <Text style={[styles.label, { color: theme.muted }]}>{t('appearance')}</Text>
      <View style={styles.theme}>
        <ThemeToggle />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  panel: { borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: spacing.xl, gap: spacing.md },
  label: { fontFamily: 'Manrope_600SemiBold', fontSize: sizes.label },
  body: { fontFamily: 'Manrope_400Regular', fontSize: sizes.body },
  theme: { alignItems: 'flex-start' },
})
