import { constants } from '@devhub/core'
import _ from 'lodash'
import qs from 'qs'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useEmitter } from '../../hooks/use-emitter'
import { analytics } from '../../libs/analytics'
import { emitter } from '../../libs/emitter'
import { Linking } from '../../libs/linking'
import * as actions from '../../redux/actions'

export interface DeepLinkProviderProps {
  children?: React.ReactNode
}

export type DeepLinkProviderState = undefined

export const DeepLinkContext = React.createContext<DeepLinkProviderState>(
  undefined,
)
DeepLinkContext.displayName = 'DeepLinkContext'

export function DeepLinkProvider(props: DeepLinkProviderProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    Linking.addEventListener('url', (payload) => {
      if (!(payload && payload.url && typeof payload.url === 'string')) return

      const { url } = payload

      const isDeepLink =
        url && url.startsWith(`${constants.APP_DEEP_LINK_SCHEMA}://`)
      if (!isDeepLink) return

      emitter.emit('DEEP_LINK', { url })
    })
  }, [])

  useEmitter(
    'DEEP_LINK',
    ({ url }) => {
      const isDeepLink =
        url && url.startsWith(`${constants.APP_DEEP_LINK_SCHEMA}://`)
      if (!isDeepLink) return

      analytics.trackEvent('deep_link', 'open_url', url)

      const [urlWithoutQueryString, querystring] = url
        .replace(`${constants.APP_DEEP_LINK_SCHEMA}://`, '')
        .split('?')

      const partials = (urlWithoutQueryString || '').split('/')

      const suffixMap = _.mapValues(
        constants.APP_DEEP_LINK_URLS,
        (_url) =>
          _url
            .replace(`${constants.APP_DEEP_LINK_SCHEMA}://`, '')
            .split('/')[0]
            .split('?')[0],
      ) as Record<keyof typeof constants.APP_DEEP_LINK_URLS, string>

      switch (partials[0]) {
        case suffixMap.github_oauth: {
          // current this is being handled at the login component
          // might change this in the future
          break
        }

        case suffixMap.redux: {
          const { type, payload } = getQueryParams(querystring)

          if (type) {
            dispatch({
              type,
              payload: payload ? JSON.parse(payload) : undefined,
            })
            break
          }
        }

        case suffixMap.preferences: {
          dispatch(actions.pushModal({ name: 'SETTINGS' }))
          break
        }

        case suffixMap.pricing: {
          const { initialSelectedPlanId, highlightFeature } = getQueryParams(
            querystring,
          )

          dispatch(
            actions.pushModal({
              name: 'PRICING',
              params: { initialSelectedPlanId, highlightFeature },
            }),
          )
          break
        }

        case suffixMap.subscribe: {
          const { planId } = getQueryParams(querystring)
          dispatch(actions.pushModal({ name: 'SUBSCRIBE', params: { planId } }))
          break
        }

        default: {
          console.error(`Unhandled deep link url: "${url}"`)
        }
      }
    },
    [],
  )

  return (
    <DeepLinkContext.Provider value={undefined}>
      {props.children}
    </DeepLinkContext.Provider>
  )
}

export const DeepLinkConsumer = DeepLinkContext.Consumer

function getQueryParams(url: string) {
  if (!(url && typeof url === 'string')) return {}

  if (!url.includes('?') || url[0] === '?') return qs.parse(url)

  const matches = url.match(/[^\?]+\??(.+)/)
  if (!(matches && matches[1])) return {}

  return qs.parse(matches[1])
}
