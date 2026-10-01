import { Pressable, StyleSheet, Text } from 'react-native'
import { usePreferences } from '../../preferences'
import { themes, spacing, sizes } from '../../theme'
import type { ButtonProps } from './button.types'

export function Button({ label, accessibilityLabel, disabled, selected, onPress }: ButtonProps) {
  const { preferences } = usePreferences()
  const theme = themes[preferences.theme]

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.control,
        {
          backgroundColor: theme.surface,
          borderColor: selected ? theme.accent : theme.line,
          opacity: pressed || disabled ? 0.6 : 1,
        },
      ]}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  control: {
    minHeight: sizes.control,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: sizes.radius,
    justifyContent: 'center',
  },
  label: { fontFamily: 'Manrope_400Regular', fontSize: sizes.body },
})
