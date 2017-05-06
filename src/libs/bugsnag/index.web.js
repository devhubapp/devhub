/* eslint-disable import/no-unresolved,import/extensions,import/no-extraneous-dependencies */
// TODO: Fix eslint for web imports

import Bugsnag from 'bugsnag-js'

export default apiKey => {
  Bugsnag.apiKey = apiKey

  Bugsnag.clearUser = () => (Bugsnag.user = null)

  Bugsnag.setUser = (id, name, email, other = {}) =>
    (Bugsnag.user = { id, name, email, ...other })

  Bugsnag.notify = Bugsnag.notifyException
  delete Bugsnag.notifyException

  return Bugsnag
}

export * from 'bugsnag-js'
