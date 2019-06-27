import _ from 'lodash'
import React, { useCallback } from 'react'

import { constants } from '@devhub/core'
import { useEmitter } from '../../hooks/use-emitter'
import { useReduxAction } from '../../hooks/use-redux-action'
import { analytics } from '../../libs/analytics'
import * as actions from '../../redux/actions'
import { useReduxStore } from '../../redux/context/ReduxStoreContext'

export interface DeepLinkProviderProps {
  children?: React.ReactNode
}

export type DeepLinkProviderState = undefined

export const DeepLinkContext = React.createContext<DeepLinkProviderState>(
  undefined,
)
DeepLinkContext.displayName = 'DeepLinkContext'

export function DeepLinkProvider(props: DeepLinkProviderProps) {
  const store = useReduxStore()
  const pushModal = useReduxAction(actions.pushModal)

  useEmitter(
    'DEEP_LINK',
    useCallback(payload => {
      if (!(payload && payload.url && typeof payload.url === 'string')) return

      const { url } = payload

      analytics.trackEvent('deep_link', 'open_url', url)

      const isDeepLink =
        url && url.startsWith(`${constants.APP_DEEP_LINK_SCHEMA}://`)
      if (!isDeepLink) return

      const suffixes = url
        .replace(`${constants.APP_DEEP_LINK_SCHEMA}://`, '')
        .split('/')

      const suffixMap = _.mapValues(
        constants.APP_DEEP_LINK_URLS,
        _url =>
          _url
            .replace(`${constants.APP_DEEP_LINK_SCHEMA}://`, '')
            .split('/')[0],
      ) as Record<keyof typeof constants.APP_DEEP_LINK_URLS, string>

      switch (suffixes[0]) {
        case suffixMap.redux_action: {
          if (suffixes[1]) {
            store.dispatch({ type: suffixes[1] })
            break
          }
        }

        case suffixMap.preferences: {
          pushModal({ name: 'SETTINGS' })
          break
        }

        default: {
          console.error(`Unhandled deep link url: "${url}"`)
        }
      }
    }, []),
  )

  return (
    <DeepLinkContext.Provider value={undefined}>
      {props.children}
    </DeepLinkContext.Provider>
  )
}

export const DeepLinkConsumer = DeepLinkContext.Consumer
;(DeepLinkConsumer as any).displayName = 'DeepLinkConsumer'
