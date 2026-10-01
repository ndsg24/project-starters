import { StyleSheet, View } from 'react-native'
import { languages, usePreferences } from '@/shared/preferences'
import { Button } from '@/shared/ui'
import { spacing } from '@/shared/theme'

const labels = { es: 'Español', en: 'English', pt: 'Português' }

export function LanguageSelect() {
  const { preferences, ready, setLanguage } = usePreferences()

  return (
    <View style={styles.row}>
      {languages.map((language) => (
        <Button
          key={language}
          label={labels[language]}
          selected={preferences.language === language}
          disabled={!ready}
          onPress={() => setLanguage(language)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
})
