import bugsnagJS from 'bugsnag-js'
import createReactPlugin from 'bugsnag-react'
import _ from 'lodash'
import React from 'react'

import { BugnsagCrossPlatform } from './'

const client = bugsnagJS({
  apiKey: '231f337f6090422c611017d3dab3d32e',
  autoBreadcrumbs: true,
  notifyReleaseStages: ['production'],
})

export const bugsnag: BugnsagCrossPlatform = {
  clearUser() {
    client.user = {}
  },

  leaveBreadcrumb(name, metadata) {
    client.leaveBreadcrumb(name, metadata)
  },

  notify(error, metadata) {
    client.notify(error, {
      beforeSend: r => {
        r.metaData = Object.assign(r.metaData, metadata, {
          error: _.omit(
            _.pick(error, Object.getOwnPropertyNames(error)),
            'stack',
          ),
        })
      },
    })
  },

  setUser(id, name, email) {
    client.user = { id, name, email }
  },
}

export const ErrorBoundary = client.use(createReactPlugin(React))
