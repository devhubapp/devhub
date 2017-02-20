// @flow
/* eslint-env browser */

// TODO: Implement this for the web
export default function prompt(
  title: ?string,
  message?: ?string,
  callbackOrButtons?: (text: string) => Object,
): void {
  // eslint-disable-next-line no-alert
  const userInput = window.prompt(
    title && message ? `${title}\n${message}` : message,
  );

  if (!userInput) return null;

  if (typeof callbackOrButtons === 'function') {
    return callbackOrButtons(userInput);
  }

  const buttonsWithCallback = (callbackOrButtons || [])
    .filter(button => typeof button.onPress === 'function')
    .splice(0, 1);

  const callback = buttonsWithCallback[0].onPress;

  return callback(userInput);
}
