import bugsnagJS from '@bugsnag/js'
import bugsnagReact from '@bugsnag/plugin-react'
import _ from 'lodash'
import React from 'react'

import { constants } from '@devhub/core'
import { BugnsagCrossPlatform } from './'
import { hideTokenFromString } from './index.shared'
// import { overrideConsoleError } from './index.shared'

const client = bugsnagJS({
  apiKey: '231f337f6090422c611017d3dab3d32e',
  appVersion: constants.APP_VERSION,
  autoBreadcrumbs: true,
  notifyReleaseStages: ['production'],
})

client.use(bugsnagReact, React)

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
        if (r.request.url) {
          r.request.url = hideTokenFromString(r.request.url)
        }

        r.metaData = Object.assign(r.metaData || {}, metadata, {
          error: _.omit(
            _.pick(error, Object.getOwnPropertyNames(error)),
            'stack',
          ),
        })

        try {
          const safeMetadata = JSON.parse(
            hideTokenFromString(JSON.stringify(r.metaData)),
          )
          if (safeMetadata) r.metaData = safeMetadata
        } catch (e) {
          //
        }
      },
    })
  },

  setUser(id, name, email) {
    client.user = { id: id || '', name: name || '', email: email || undefined }
  },
}

// overrideConsoleError(bugsnag)

export const ErrorBoundary = client.getPlugin('react')
