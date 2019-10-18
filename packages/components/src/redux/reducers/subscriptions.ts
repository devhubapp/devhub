import {
  ColumnSubscription,
  EnhancedItem,
  getItemNodeIdOrId,
  normalizeSubscriptions,
} from '@devhub/core'
import immer from 'immer'
import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'

import { Reducer } from '../types'

export interface State {
  allIds: string[]
  byId: Record<string, ColumnSubscription | undefined>
  updatedAt: string | null
}

const initialState: State = {
  allIds: [],
  byId: {},
  updatedAt: null,
}

export const subscriptionsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case REHYDRATE as any: {
      const { err, payload } = action as any

      const subscriptions: State = err
        ? state
        : (payload && payload.subscriptions) || state

      return immer(subscriptions, draft => {
        const keys = Object.keys(draft.byId)
        if (!(keys && keys.length)) return

        keys.forEach(id => {
          const subscription = draft.byId[id]
          if (!(subscription && subscription.data)) return

          subscription.data.loadState = 'not_loaded'
        })
      })
    }

    case 'ADD_COLUMN_AND_SUBSCRIPTIONS':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        const normalized = normalizeSubscriptions(action.payload.subscriptions)

        draft.allIds = _.uniq(draft.allIds.concat(normalized.allIds)).filter(
          Boolean,
        )

        _.merge(draft.byId, normalized.byId)

        draft.updatedAt = normalized.updatedAt
      })

    case 'ADD_COLUMN_SUBSCRIPTION':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        if (!action.payload.columnId) return
        if (!(action.payload.subscription && action.payload.subscription.id))
          return

        const normalized = normalizeSubscriptions([action.payload.subscription])

        draft.allIds = _.uniq(draft.allIds.concat(normalized.allIds)).filter(
          Boolean,
        )

        _.merge(draft.byId, normalized.byId)

        draft.updatedAt = normalized.updatedAt
      })

    case 'DELETE_COLUMN_SUBSCRIPTIONS':
      return immer(state, draft => {
        if (draft.allIds)
          draft.allIds = draft.allIds.filter(id => !action.payload.includes(id))

        if (!draft.byId) return

        action.payload.forEach(id => {
          delete draft.byId[id]
        })

        draft.updatedAt = new Date().toISOString()
      })

    case 'REPLACE_COLUMNS_AND_SUBSCRIPTIONS':
      return immer(state, draft => {
        const normalized = normalizeSubscriptions(
          action.payload.subscriptions,
          action.payload.subscriptionsUpdatedAt,
        )
        draft.allIds = normalized.allIds
        draft.byId = normalized.byId

        draft.updatedAt = normalized.updatedAt
      })

    case 'FETCH_SUBSCRIPTION_REQUEST':
      return immer(state, draft => {
        if (!draft.allIds) return
        if (!draft.byId) return

        const subscription = draft.byId[action.payload.subscriptionId]
        if (!subscription) return

        subscription.data = subscription.data || {}
        subscription.data.lastFetchedAt = new Date().toISOString()

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

        // draft.updatedAt = new Date().toISOString()
      })

    case 'FETCH_SUBSCRIPTION_NOOP': {
      return immer(state, draft => {
        if (!draft.allIds) return
        if (!draft.byId) return

        const subscription = draft.byId[action.payload.subscriptionId]
        if (!subscription) return

        subscription.data = subscription.data || {}
        if (
          subscription.data.loadState === 'loading' ||
          subscription.data.loadState === 'loading_first' ||
          subscription.data.loadState === 'loading_more'
        ) {
          subscription.data.loadState = 'not_loaded'
        }
      })
    }

    case 'FETCH_SUBSCRIPTION_SUCCESS':
      return immer(state, draft => {
        if (!draft.allIds) return
        if (!draft.byId) return

        if (action.payload.subscriptionType === 'notifications') return

        const subscription = draft.byId[action.payload.subscriptionId]
        if (!subscription) return

        subscription.data = subscription.data || {}
        if (typeof action.payload.canFetchMore === 'boolean')
          subscription.data.canFetchMore = action.payload.canFetchMore
        subscription.data.errorMessage = undefined
        subscription.data.lastFetchedAt = new Date().toISOString()
        subscription.data.lastFetchedSuccessfullyAt = new Date().toISOString()
        subscription.data.loadState = 'loaded'

        subscription.data.itemNodeIdOrIds = action.payload.replaceAllItems
          ? []
          : subscription.data.itemNodeIdOrIds || []
        ;(action.payload.data || []).forEach(
          (item: EnhancedItem | undefined) => {
            if (!item) return

            const id = getItemNodeIdOrId(item)
            if (!id) return

            if (subscription.data!.itemNodeIdOrIds!.includes(id)) return
            subscription.data!.itemNodeIdOrIds!.push(id)
          },
        )

        // TODO: The updatedAt from subscriptions was being changed too often
        // (everytime this fetch success action is dispatched)
        // which caused a server sync request without need
        // because we are not saving the data.items on server yet
        // if (subscription.data.items) {
        //   draft.updatedAt = new Date().toISOString()
        // }
      })

    case 'FETCH_SUBSCRIPTION_FAILURE':
      return immer(state, draft => {
        if (!draft.allIds) return
        if (!draft.byId) return

        const subscription = draft.byId[action.payload.subscriptionId]
        if (!subscription) return

        subscription.data = subscription.data || {}
        subscription.data.lastFetchedAt = new Date().toISOString()
        subscription.data.errorMessage = action.error && action.error.message
        if (action.error && Array.isArray((action.error as any).errors)) {
          const errors = (action.error as any).errors
            .map((e: any) => e.message)
            .filter(Boolean)
            .join(' ')

          if (errors) {
            subscription.data.errorMessage = `${subscription.data.errorMessage}: ${errors}`.trim()
          }
        }
        subscription.data.loadState = 'error'

        if (
          action.payload.replaceAllItems &&
          action.error &&
          action.error.status &&
          (action.error.status >= 402 && action.error.status < 500)
        ) {
          subscription.data.itemNodeIdOrIds = []
        }

        // draft.updatedAt = new Date().toISOString()
      })

    default:
      return state
  }
}
