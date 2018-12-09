import createReactPlugin from 'bugsnag-react'
import { Client as Bugsnag } from 'bugsnag-react-native'
import React from 'react'

import { Omit } from '@devhub/core'

export * from 'bugsnag-react-native'

export let ErrorBoundary: React.ComponentType<any> = React.Fragment

let bugsnagClient: Omit<InstanceType<typeof Bugsnag>, 'notify'> & {
  notify: (error: Error, metadata?: Record<string, Record<string, any>>) => void
}
export function initBugsnag(apiKey: string) {
  const client = new Bugsnag(apiKey)
  client.config.notifyReleaseStages = ['production']

  const _notify = client.notify
  ;(client as any).notify = (
    error: Error,
    metadata?: Record<string, Record<string, any>>,
  ) => {
    _notify(error, r => {
      if (metadata) r.metadata = metadata
    })
  }

  try {
    if ('use' in client) {
      ErrorBoundary = (client as any).use(createReactPlugin(React))
      if (!ErrorBoundary) throw new Error()
    } else {
      // console.log('[Bugsnag] ErrorBoundary not support4ed.')
      ErrorBoundary = FallbackErrorBoundary
    }
  } catch (e) {
    console.error('[Bugsnag] Failed to create ErrorBoundary.', e)
    ErrorBoundary = FallbackErrorBoundary
  }

  bugsnagClient = client as any

  return bugsnagClient
}

class FallbackErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  state = {
    hasError: false,
  }

  componentDidCatch(error: any) {
    bugsnagClient.notify(error)
  }

  render() {
    if (this.state.hasError) return null

    return this.props.children
  }
}
