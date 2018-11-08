import bugsnag from 'bugsnag-js'
import createReactPlugin from 'bugsnag-react'
import React from 'react'

export * from 'bugsnag-js'

export let bugsnagClient: ReturnType<typeof bugsnag>
export let ErrorBoundary: React.ComponentType<any>

export function initBugsnag(apiKey: string) {
  bugsnagClient = bugsnag(apiKey)
  ;(bugsnagClient as any).apiKey = apiKey
  ;(bugsnagClient as any).autoBreadcrumbs = false
  ;(bugsnagClient as any).clearUser = () => {
    bugsnagClient.user = {}
  }
  ;(bugsnagClient as any).setUser = (
    id: string,
    name: string,
    email: string,
    other = {},
  ) => {
    bugsnagClient.user = { id, name, email, ...other }
  }

  try {
    ErrorBoundary = bugsnagClient.use(createReactPlugin(React))
    if (!ErrorBoundary) throw new Error()
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

  componentDidCatch(error: any, info: any) {
    bugsnagClient.notify(error, { context: 'react', metaData: info })
  }

  render() {
    if (this.state.hasError) return null

    return this.props.children
  }
}
