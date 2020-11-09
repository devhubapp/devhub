import { Client } from 'bugsnag-react-native'
import _ from 'lodash'
import React from 'react'

import { constants } from '@devhub/core'
import { BugnsagCrossPlatform, ErrorBoundaryProps, ErrorBoundaryState } from '.'
import { hideTokenFromString } from './index.shared'
// import { overrideConsoleError } from './index.shared'

const client = new Client('231f337f6090422c611017d3dab3d32e')
client.config.appVersion = constants.APP_VERSION
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
    if (__DEV__) console.debug('[BUGSNAG]', error, metadata) // eslint-disable-line no-console

    client.notify(error, (r) => {
      r.metadata = Object.assign(r.metadata || {}, metadata, {
        error: _.omit(
          _.pick(error, Object.getOwnPropertyNames(error)),
          'stack',
        ),
      })

      try {
        const safeMetadata = JSON.parse(
          hideTokenFromString(JSON.stringify(r.metadata))!,
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

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error?: Error) {
    return {
      error,
      info: { componentStack: error && error.stack },
    }
  }

  state = {
    error: undefined,
    info: undefined,
  }

  componentDidCatch(error?: Error) {
    if (error) bugsnag.notify(error)
  }

  render() {
    const { FallbackComponent, children } = this.props
    const { error, info } = this.state

    if (error) {
      if (FallbackComponent)
        return <FallbackComponent error={error} info={info} />

      return null
    }

    return children
  }
}
