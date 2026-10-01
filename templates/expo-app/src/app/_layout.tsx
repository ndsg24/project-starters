import { useEffect } from 'react'
import { Platform } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts, Manrope_400Regular, Manrope_600SemiBold } from '@expo-google-fonts/manrope'

import { PreferencesProvider, nativePreferencesStore, usePreferences } from '@/shared/preferences'
import { themes } from '@/shared/theme'

function Navigation() {
  const { preferences } = usePreferences()
  const theme = themes[preferences.theme]

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.lang = preferences.language
    }
  }, [preferences.language])

  return (
    <>
      <StatusBar style={preferences.theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.canvas } }}
      />
    </>
  )
}

export default function RootLayout() {
  const [loaded, error] = useFonts({ Manrope_400Regular, Manrope_600SemiBold })

  if (!loaded && !error) {
    return null
  }

  return (
    <PreferencesProvider store={nativePreferencesStore}>
      <Navigation />
    </PreferencesProvider>
  )
}
