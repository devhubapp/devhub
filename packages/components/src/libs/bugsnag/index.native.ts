import { Client } from 'bugsnag-react-native'
import _ from 'lodash'

import React from 'react'
import { appVersion } from '../../components/common/AppVersion'
import { BugnsagCrossPlatform } from './'
import { hideTokenFromString } from './index.shared'
// import { overrideConsoleError } from './index.shared'

const client = new Client('231f337f6090422c611017d3dab3d32e')
client.config.appVersion = appVersion
client.config.automaticallyCollectBreadcrumbs = true
client.config.notifyReleaseStages = ['production']

export const bugsnag: BugnsagCrossPlatform = {
  clearUser() {
    client.clearUser()
  },

  leaveBreadcrumb(name, metadata) {
    client.leaveBreadcrumb(name, metadata)
  },

  notify(error, metadata) {
    client.notify(error, r => {
      r.metadata = Object.assign(r.metadata || {}, metadata, {
        error: _.omit(
          _.pick(error, Object.getOwnPropertyNames(error)),
          'stack',
        ),
      })

      try {
        const safeMetadata = JSON.parse(
          hideTokenFromString(JSON.stringify(r.metadata)),
        )
        if (safeMetadata) r.metadata = safeMetadata
      } catch (e) {
        //
      }
    })
  },

  setUser(id, name, email) {
    client.setUser(id || '', name || '', email || '')
  },
}

// overrideConsoleError(bugsnag)

export class ErrorBoundary extends React.Component {
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  state = {
    hasError: false,
  }

  componentDidCatch(error: any) {
    bugsnag.notify(error)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
