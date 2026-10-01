export interface ButtonProps {
  label: string
  accessibilityLabel?: string
  disabled?: boolean
  selected?: boolean
  onPress(): void
}
