import { Platform } from '../platform'
import { PromptButton, PromptOptions } from './index.shared'

export function isSupported() {
  return !!(Platform.OS === 'web' && !Platform.isElectron)
}

export function prompt(
  title?: string,
  message?: string,
  callbackOrButtons?: ((value: string) => void) | PromptButton[],
  options?: PromptOptions,
) {
  if (!isSupported()) {
    console.error('[prompt] Not supported.')
    if (__DEV__) alert('Prompt not supported.')
    return
  }

  const result = window.prompt(
    [title, message].filter(Boolean).join('\n'),
    options && options.defaultValue,
  )

  if (callbackOrButtons && typeof callbackOrButtons === 'function') {
    callbackOrButtons(result || '')
    return
  }

  if (callbackOrButtons) {
    callbackOrButtons.forEach(button => {
      if (!button.style || button.style === 'default') {
        if (button.onPress) button.onPress(result || '')
      }
    })
  }
}
