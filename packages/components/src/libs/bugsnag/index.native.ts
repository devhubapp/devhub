import { Client } from 'bugsnag-react-native'
import _ from 'lodash'

import React from 'react'
import { BugnsagCrossPlatform } from './'

const client = new Client('231f337f6090422c611017d3dab3d32e')
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
      r.metadata = Object.assign(r.metadata, metadata, {
        error: _.omit(
          _.pick(error, Object.getOwnPropertyNames(error)),
          'stack',
        ),
      })
    })
  },

  setUser(id, name, email) {
    client.setUser(id, name || '', email || '')
  },
}

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
