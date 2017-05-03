// @flow
/* eslint-env browser */
/* eslint-disable no-alert */

import { mapValues, toArray } from 'lodash'

const getPromptText = (
  title: ?string,
  message: ?string,
  callbackOrButtons?: (text: string) => Object,
) => {
  let text = title && message ? `${title}\n${message}` : message

  if (typeof callbackOrButtons === 'object') {
    const buttonsText = toArray(
      mapValues(callbackOrButtons, (button, key) => `${key}: ${button.text}`),
    ).join('\n')

    if (buttonsText) {
      if (text) text += '\n'
      text += buttonsText
    }
  }

  return text
}

// TODO: Implement this for the web
export default function prompt(
  title: ?string,
  message?: ?string,
  callbackOrButtons?: (text: string) => Object,
): void {
  const userInput =
    window.prompt(getPromptText(title, message, callbackOrButtons)) || ''
  if (!userInput) return

  if (typeof callbackOrButtons === 'function') {
    callbackOrButtons(userInput)
    return
  }

  const buttonsWithCallback = (callbackOrButtons || [])
    .filter(button => typeof button.onPress === 'function')

  const buttons = Array.isArray(callbackOrButtons) ? callbackOrButtons : []
  const userInputNumber = Number.parseInt(userInput, 10)
  const callback = userInputNumber >= 0 && userInputNumber < buttons.length
    ? (buttons[userInputNumber] || {}).onPress
    : (buttonsWithCallback[0] || {}).onPress

  if (typeof callback !== 'function') {
    return
  }

  callback(userInput)
}
