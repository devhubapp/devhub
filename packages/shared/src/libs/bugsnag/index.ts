import createReactPlugin from 'bugsnag-react'
import { Client as Bugsnag } from 'bugsnag-react-native'
import React from 'react'

export * from 'bugsnag-react-native'

export let ErrorBoundary: React.ComponentType<any> = React.Fragment

let bugsnagClient: InstanceType<typeof Bugsnag>
export function initBugsnag(apiKey: string) {
  bugsnagClient = new Bugsnag(apiKey)

  try {
    if ('use' in bugsnagClient) {
      ErrorBoundary = (bugsnagClient as any).use(createReactPlugin(React))
      if (!ErrorBoundary) throw new Error()
    } else {
      // console.log('[Bugsnag] ErrorBoundary not support4ed.')
      ErrorBoundary = FallbackErrorBoundary
    }
  } catch (e) {
    console.error('[Bugsnag] Failed to create ErrorBoundary.', e)
    ErrorBoundary = FallbackErrorBoundary
  }

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
