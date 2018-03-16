/* eslint-disable import/no-unresolved,import/extensions,import/no-extraneous-dependencies */
// TODO: Fix eslint for web imports

import bugsnag from 'bugsnag-js'

export default apiKey => {
  const bugsnagClient = bugsnag(apiKey)

  bugsnagClient.apiKey = apiKey
  bugsnagClient.autoBreadcrumbs = false

  bugsnagClient.clearUser = () => {
    bugsnagClient.user = null
  }

  bugsnagClient.setUser = (id, name, email, other = {}) => {
    bugsnagClient.user = { id, name, email, ...other }
  }

  return bugsnagClient
}

export * from 'bugsnag-js'
