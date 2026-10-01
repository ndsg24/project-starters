import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { PreferencesPanel } from '@/widgets/preferences'
import { usePreferences } from '@/shared/preferences'
import { themes, spacing, sizes } from '@/shared/theme'

export function HomeScreen() {
  const { t } = useTranslation()
  const { preferences } = usePreferences()
  const theme = themes[preferences.theme]

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.canvas }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.wordmark, { color: theme.text }]}>
            Project Starters<Text style={{ color: theme.accent }}>.</Text>
          </Text>
          <View style={styles.hero}>
            <Text style={[styles.eyebrow, { color: theme.accent }]}>{t('ready')}</Text>
            <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>
              {t('title')}
            </Text>
            <Text style={[styles.body, { color: theme.muted }]}>{t('description')}</Text>
          </View>
          <PreferencesPanel />
          <View style={styles.note}>
            <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>
              {t('architecture')}
            </Text>
            <Text style={[styles.body, { color: theme.muted }]}>
              {t('architectureDescription')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: spacing.xl, alignItems: 'center' },
  content: { width: '100%', maxWidth: sizes.contentWidth },
  wordmark: { fontFamily: 'Manrope_600SemiBold', fontSize: sizes.heading },
  hero: { paddingVertical: spacing.xxl * 2, gap: spacing.lg },
  eyebrow: { fontFamily: 'Manrope_600SemiBold', fontSize: sizes.label, textTransform: 'uppercase' },
  title: { fontFamily: 'Manrope_600SemiBold', fontSize: sizes.title },
  body: { fontFamily: 'Manrope_400Regular', fontSize: sizes.body, lineHeight: sizes.body * 1.6 },
  note: { paddingVertical: spacing.xxl, gap: spacing.md },
  heading: { fontFamily: 'Manrope_600SemiBold', fontSize: sizes.heading },
})
