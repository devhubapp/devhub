import { PromptButton, PromptOptions } from './index.shared'

export function isSupported() {
  return false
}

export function prompt(
  _title: string | undefined,
  _message?: string | undefined,
  _callbackOrButtons?: ((value: string) => void) | PromptButton[],
  _options?: PromptOptions,
) {
  console.error('[prompt] Not supported.')
  if (__DEV__) alert('Prompt not supported.')
}
