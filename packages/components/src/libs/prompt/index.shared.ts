export { PromptOptions } from 'react-native-prompt-android'

export interface PromptButton {
  text?: string
  onPress?: (message: string) => void

  /** @platform ios */
  style?: 'default' | 'cancel' | 'destructive'
}
