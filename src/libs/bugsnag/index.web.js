/* eslint-disable */
// TODO: Fix eslint for web imports

import Bugsnag from 'bugsnag-js'

export default apiKey => {
  Bugsnag.apiKey = apiKey
  return Bugsnag
}

export * from 'bugsnag-js'
