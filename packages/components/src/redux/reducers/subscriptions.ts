import immer from 'immer'
import _ from 'lodash'

import {
  ColumnSubscription,
  constants,
  removeUselessURLsFromResponseItem,
  subscriptionsArrToState,
} from '@devhub/core'
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
    case 'CLEANUP_SUBSCRIPTIONS_DATA': {
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        const keys = Object.keys(draft.byId)
        if (!(keys && keys.length && draft.byId)) return

        const subscriptionIds = action.payload.subscriptionIds || keys
        subscriptionIds.forEach(id => {
          const subscription = draft.byId[id]
          if (!subscription) return

          subscription.data = subscription.data || {}
          subscription.data.items = subscription.data.items || []
          subscription.data.canFetchMore = true
          delete subscription.data.errorMessage
          delete subscription.data.loadState

          // remove old items from the cache
          // unless they were marked as Save for Later
          if (subscription.data.items.length) {
            let count = 0

            if (subscription.type === 'activity') {
              subscription.data.items = _.orderBy(
                subscription.data.items,
                'created_at',
                'desc',
              )
                .filter(item => {
                  if (!item) return false
                  if (item.saved) return true
                  if (!action.payload.deleteOlderThan) return false
                  if (!item.created_at) return true

                  return (
                    new Date(item.created_at).toISOString() >=
                    action.payload.deleteOlderThan
                  )
                })
                .filter(item => {
                  count = count + 1
                  if (item.saved) return true
                  return count <= constants.DEFAULT_PAGINATION_PER_PAGE
                })
            } else if (subscription.type === 'notifications') {
              subscription.data.items = _.orderBy(
                subscription.data.items,
                'updated_at',
                'desc',
              )
                .filter(item => {
                  if (!item) return false
                  if (item.saved) return true
                  if (item.unread) return true
                  if (!action.payload.deleteOlderThan) return false
                  if (!item.updated_at) return true

                  return (
                    new Date(item.updated_at).toISOString() >=
                    action.payload.deleteOlderThan
                  )
                })
                .filter(item => {
                  count = count + 1
                  if (item.saved) return true
                  return count <= constants.DEFAULT_PAGINATION_PER_PAGE
                })
            }
          }
        })
      })
    }

    case 'ADD_COLUMN_AND_SUBSCRIPTIONS':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        const normalized = subscriptionsArrToState(action.payload.subscriptions)

        draft.allIds = _.uniq(draft.allIds.concat(normalized.allIds)).filter(
          Boolean,
        )

        Object.assign(draft.byId, normalized.byId)

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
        const normalized = subscriptionsArrToState(
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
          _.orderBy(
            _.concat(newItems, prevItems as any),
            action.payload.subscriptionType === 'notifications'
              ? 'updated_at'
              : 'created_at',
            'desc',
          ),
          'id',
        ).map(item => {
          const prevValue = prevItems.find((i: any) => i.id === item.id)
          if (!prevValue) return item

          return {
            ...item,
            saved: prevValue.saved,
          }
        })

        subscription.data.items = mergedItems.map(
          removeUselessURLsFromResponseItem,
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
        subscription.data.errorMessage = action.error && action.error.message
        subscription.data.lastFetchedAt = new Date().toISOString()
        subscription.data.loadState = 'error'

        // draft.updatedAt = new Date().toISOString()
      })

    case 'SAVE_ITEMS_FOR_LATER':
      return immer(state, draft => {
        if (!(action.payload.itemIds && action.payload.itemIds.length)) return
        if (!draft.allIds) return
        if (!draft.byId) return

        const keys = Object.keys(draft.byId)
        if (!(keys && keys.length)) return

        const stringIds =
          action.payload.itemIds &&
          action.payload.itemIds.map(id => `${id || ''}`.trim()).filter(Boolean)
        if (!(stringIds && stringIds.length)) return

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
              if (!(item && stringIds.includes(`${item.id}`))) return item

              return {
                ...item,
                saved: action.payload.save !== false,
              }
            },
          )
        })

        draft.updatedAt = new Date().toISOString()
      })

    default:
      return state
  }
}
