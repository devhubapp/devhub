/* tslint:disable no-empty */

import { Analytics } from '.'

if (__DEV__) {
  // tslint:disable-next-line no-console
  console.warn(
    'Firebase Analytics is not supported on this platform and has been disabled.',
  )
}

export const analytics: Analytics = {
  setUser() {},
  setDimensions() {},
  trackEvent() {},
  trackModalView() {},
  trackScreenView() {},
}
