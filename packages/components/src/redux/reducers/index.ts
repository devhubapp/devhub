import { EnhancedItem, getFilteredItems, getItemNodeIdOrId } from '@devhub/core'
import immer from 'immer'
import _ from 'lodash'
import { combineReducers } from 'redux'

import * as selectors from '../selectors'
import { ExtractStateFromReducer } from '../types/base'
import { appReducer } from './app'
import { authReducer } from './auth'
import { columnsReducer } from './columns'
import { configReducer } from './config'
import { countReducer } from './counters'
import { dataReducer } from './data'
import { githubReducer } from './github'
import { navigationReducer } from './navigation'
import { subscriptionsReducer } from './subscriptions'

const _rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  columns: columnsReducer,
  config: configReducer,
  counters: countReducer,
  data: dataReducer,
  github: githubReducer,
  navigation: navigationReducer,
  subscriptions: subscriptionsReducer,
})

export const rootReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LOGOUT':
      return _rootReducer(_.pick(state, ['config', 'counters']) as any, action)

    case 'CLEANUP_ARCHIVED_ITEMS':
      return cleanupArchivedItemsReducer(state)

    default:
      return _rootReducer(state, action)
  }
}

function cleanupArchivedItemsReducer(
  state: ExtractStateFromReducer<typeof _rootReducer>,
) {
  return immer(state, (draft) => {
    draft.columns = draft.columns || {}
    draft.columns.byId = draft.columns.byId || {}

    draft.subscriptions = draft.subscriptions || {}
    draft.subscriptions.byId = draft.subscriptions.byId || {}

    const subscriptionsDataSelector =
      selectors.createSubscriptionsDataSelector()

    const itemsNodeIdsOrIdsToKeepSet = new Set<string>()

    const columnIds = Object.keys(draft.columns.byId)
    columnIds.forEach((columnId) => {
      const column = draft.columns.byId![columnId]
      if (!column) return

      column.subscriptionIds = column.subscriptionIds || []
      const columnItems: EnhancedItem[] = subscriptionsDataSelector(
        state,
        column.subscriptionIds,
      )
      const itemsToKeep =
        column.filters && column.filters.clearedAt
          ? getFilteredItems(
              column.type,
              columnItems,
              { clearedAt: column.filters.clearedAt },
              {
                dashboardFromUsername: undefined,
                mergeSimilar: false,
                plan: undefined,
              },
            )
          : columnItems || []

      itemsToKeep.forEach((item) => {
        const nodeIdOrId = getItemNodeIdOrId(item)
        if (!nodeIdOrId) return

        itemsNodeIdsOrIdsToKeepSet.add(nodeIdOrId)
      })
    })

    if (draft.data.savedIds) {
      draft.data.savedIds.forEach((nodeIdOrId) => {
        itemsNodeIdsOrIdsToKeepSet.add(nodeIdOrId)
      })
    }

    draft.data.byId = _.pick(
      draft.data.byId || {},
      Array.from(itemsNodeIdsOrIdsToKeepSet),
    )

    const keepFn = (nodeIdOrId: string) =>
      itemsNodeIdsOrIdsToKeepSet.has(nodeIdOrId)

    draft.data.allIds = (draft.data.allIds || []).filter(keepFn)
    draft.data.idsBySubscriptionId = _.mapValues(
      draft.data.idsBySubscriptionId,
      (ids) => (ids ? ids.filter(keepFn) : ids),
    )
    draft.data.idsByType = _.mapValues(draft.data.idsByType, (ids) =>
      ids ? ids.filter(keepFn) : ids,
    )
    draft.data.readIds = (draft.data.readIds || []).filter(keepFn)
  })
}
