// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

import _ from 'lodash'

let hiddenFieldName: string | undefined
let eventName: string | undefined
if (typeof document.hidden !== 'undefined') {
  hiddenFieldName = 'hidden'
  eventName = 'visibilitychange'
} else if (typeof (document as any).msHidden !== 'undefined') {
  hiddenFieldName = 'msHidden'
  eventName = 'msvisibilitychange'
} else if (typeof (document as any).webkitHidden !== 'undefined') {
  hiddenFieldName = 'webkitHidden'
  eventName = 'webkitvisibilitychange'
}

export function isSupported() {
  return typeof document.addEventListener === 'function' && !!hiddenFieldName
}

export function isVisible() {
  if (!isSupported()) return null
  return (document as any)[hiddenFieldName!] === false
}

const memoizedCallback = _.memoize(
  (callback: (isVisible: boolean | null) => void) => () => {
    callback(isVisible())
  },
)

export function addEventListener(
  callback: (isVisible: boolean | null) => void,
) {
  if (!isSupported()) return
  document.addEventListener(eventName!, memoizedCallback(callback), false)
}

export function removeEventListener(
  callback: (isVisible: boolean | null) => void,
) {
  if (!isSupported()) return
  document.removeEventListener(eventName!, memoizedCallback(callback), false)
}

if (!isSupported()) {
  // tslint:disable-next-line no-console
  console.log(
    "This browser doesn't support the Page Visibility API." +
      ' Please use a modern browser for a better experience, like Google Chrome or similar.',
  )
}
