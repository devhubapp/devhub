import immer from 'immer'
import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'

import {
  ActivitySubscription,
  ColumnSubscription,
  EnhancedGitHubEvent,
  EnhancedGitHubNotification,
  NotificationSubscription,
} from '@devhub/core'
import * as selectors from '../selectors'
import { Reducer } from '../types'

export interface State {
  allIds: string[]
  byId: Record<string, ColumnSubscription>
}

const initialState: State = {
  allIds: [],
  byId: {},
}

export const subscriptionsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case REHYDRATE as any: {
      const subscriptions =
        action.payload && ((action.payload as any).subscriptions as State)
      if (!subscriptions) return subscriptions || state

      return immer(subscriptions, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        const keys = Object.keys(draft.byId)
        if (!(keys && keys.length && draft.byId)) return

        keys.forEach(id => {
          const subscription = draft.byId[id]
          if (!subscription) return

          subscription.data = subscription.data || {}
          subscription.data.canFetchMore = true
          subscription.data.items = subscription.data.items || []
          delete subscription.data.errorMessage
          delete subscription.data.loadState

          // remove old items from the cache
          // unless they were marked as Save for Later
          if (subscription.data.items.length) {
            const sevenDays = 1000 * 60 * 60 * 24 * 7

            subscription.data.items = (subscription.data.items as any[]).filter(
              item => {
                if (!item) return false
                if (!item.updated_at) return true
                if (item.saved) return true

                return (
                  new Date(item.updated_at).valueOf() >= Date.now() - sevenDays
                )
              },
            )
          }
        })
      })
    }

    case 'ADD_COLUMN':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []

        draft.byId = draft.byId || {}
        const subscriptionIds = action.payload.subscriptions.map(s => {
          draft.byId[s.id] = {
            ...(s as any), // TODO: fix any
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...draft.byId[s.id],
          }

          draft.byId[s.id].data = draft.byId[s.id].data || {}

          return s.id
        })

        draft.allIds = _.uniq(draft.allIds.concat(subscriptionIds)).filter(
          Boolean,
        )
      })

    case 'DELETE_COLUMN_SUBSCRIPTIONS':
      return immer(state, draft => {
        if (draft.allIds)
          draft.allIds = draft.allIds.filter(id => !action.payload.includes(id))

        if (!draft.byId) return

        action.payload.forEach(id => {
          delete draft.byId[id]
        })
      })

    case 'REPLACE_COLUMNS':
      return immer(state, draft => {
        draft.allIds = []
        draft.byId = {}

        action.payload.forEach(p => {
          p.subscriptions.forEach(s => {
            draft.allIds.push(s.id)

            draft.byId[s.id] = {
              ...(s as any), // TODO: Fix any
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            draft.byId[s.id].data = draft.byId[s.id].data || {}
          })
        })
      })

    case 'FETCH_SUBSCRIPTION_REQUEST':
      return immer(state, draft => {
        if (!draft.allIds) return
        if (!draft.byId) return

        const subscription = draft.byId[action.payload.subscriptionId]
        if (!subscription) return

        subscription.data = subscription.data || {}

        const { page } = action.payload.params
        const prevLoadState = subscription.data.loadState
        subscription.data.loadState =
          page > 1
            ? 'loading_more'
            : !prevLoadState ||
              prevLoadState === 'not_loaded' ||
              prevLoadState === 'loading_first'
            ? 'loading_first'
            : 'loading'
      })

    case 'FETCH_SUBSCRIPTION_SUCCESS':
      return immer(state, draft => {
        if (!draft.allIds) return
        if (!draft.byId) return

        const subscription = draft.byId[action.payload.subscriptionId]
        if (!subscription) return

        subscription.data = subscription.data || {}
        subscription.data.canFetchMore = action.payload.canFetchMore
        subscription.data.errorMessage = undefined
        subscription.data.lastFetchedAt = new Date().toISOString()
        subscription.data.loadState = 'loaded'

        const prevItems = (subscription.data.items || []) as any
        const newItems = (action.payload.data || []) as any
        const mergedItems = _.uniqBy(
          _.concat(newItems, prevItems as any),
          'id',
        ).map(item => {
          const prevValue = prevItems.find((i: any) => i.id === item.id)
          if (!prevValue) return item

          return {
            ...item,
            saved: prevValue.saved,
          }
        })

        subscription.data.items = mergedItems
      })

    case 'FETCH_SUBSCRIPTION_FAILURE':
      return immer(state, draft => {
        if (!draft.allIds) return
        if (!draft.byId) return

        const subscription = draft.byId[action.payload.subscriptionId]
        if (!subscription) return

        subscription.data = subscription.data || {}
        subscription.data.loadState = 'error'
        subscription.data.errorMessage = action.error && action.error.message
      })

    case 'SAVE_ITEM_FOR_LATER':
      return immer(state, draft => {
        if (!draft.allIds) return
        if (!draft.byId) return

        const keys = Object.keys(draft.byId)
        if (!(keys && keys.length)) return

        keys.forEach(id => {
          const subscription = draft.byId[id]
          if (
            !(
              subscription &&
              subscription.data &&
              subscription.data.items &&
              subscription.data.items.length
            )
          )
            return

          subscription.data.items = (subscription.data.items as any).map(
            (item: any) => {
              if (!(item && `${item.id}` === action.payload.itemId)) return item

              return {
                ...item,
                saved: action.payload.save !== false,
              }
            },
          )
        })
      })

    case 'CLEAR_ARCHIVED_ITEMS':
      return immer(state, draft => {
        if (!draft.byId) return

        const { clearedAt, subscriptionIds } = action.payload

        if (!(clearedAt && subscriptionIds && subscriptionIds.length)) return

        subscriptionIds.forEach(id => {
          const subscription = draft.byId[id]
          if (!subscription) return

          if (subscription.type === 'activity') {
            if (!(draft.byId[id].data && draft.byId[id].data.items)) return

            const items = draft.byId[id].data.items as EnhancedGitHubEvent[]
            if (!items.length) return

            draft.byId[id] = {
              ...draft.byId[id],
              data: {
                ...draft.byId[id].data,
                items: items.filter(
                  item => item && !(item.created_at <= clearedAt),
                ),
              },
            } as ActivitySubscription
          } else if (subscription.type === 'notifications') {
            if (!(draft.byId[id].data && draft.byId[id].data.items)) return

            const items = draft.byId[id].data
              .items as EnhancedGitHubNotification[]
            if (!items.length) return

            draft.byId[id] = {
              ...draft.byId[id],
              data: {
                ...draft.byId[id].data,
                items: items.filter(
                  item => item && !(item.updated_at <= clearedAt),
                ),
              },
            } as NotificationSubscription
          }
        })
      })

    default:
      return state
  }
}
