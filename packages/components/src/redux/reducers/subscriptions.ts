import immer from 'immer'
import _ from 'lodash'

import { ColumnSubscription } from '@devhub/core'
import { REHYDRATE } from 'redux-persist'
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
          if (subscription.data.items.length) {
            const sevenDays = 1000 * 60 * 60 * 24 * 7

            subscription.data.items = (subscription.data.items as any[]).filter(
              item => {
                if (!item) return false
                if (!item.updated_at) return true

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
        subscription.data.items = action.payload.data
        subscription.data.errorMessage = undefined
        subscription.data.lastFetchedAt = new Date().toISOString()
        subscription.data.loadState = 'loaded'
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

    default:
      return state
  }
}
