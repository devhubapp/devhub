import bugsnag from 'bugsnag-js'
import Report from 'bugsnag-js/types/report'
import createReactPlugin from 'bugsnag-react'
import React from 'react'

export * from 'bugsnag-js'

export let ErrorBoundary: React.ComponentType<any> = React.Fragment

let bugsnagClient: ReturnType<typeof bugsnag>
export function initBugsnag(apiKey: string) {
  const client = bugsnag({
    apiKey,
    autoBreadcrumbs: false,
    // notifyReleaseStages: ['production'],
  })

  bugsnagClient = Object.assign({}, client, {
    clearUser() {
      bugsnagClient.user = {}
    },
    setUser(id: string, name: string, email: string, other = {}) {
      bugsnagClient.user = { id, name, email, ...other }
    },

    notify(error: Error, metadata?: Record<string, Record<string, any>>) {
      client.notify(error, {
        beforeSend: r => {
          if (metadata) r.metaData = metadata
        },
      })
    },

    use: client.use,
  })

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
