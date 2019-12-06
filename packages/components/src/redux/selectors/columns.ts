import {
  Column,
  ColumnSubscription,
  getColumnHeaderDetails,
} from '@devhub/core'
import { PixelRatio } from 'react-native'

import { EMPTY_ARRAY, EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'
import { createItemsBySubscriptionIdsSelector } from './data'
import { currentGitHubUsernameSelector } from './github'
import { createImmerSelector } from './helpers'
import {
  createSubscriptionsDataSelector,
  subscriptionSelector,
} from './subscriptions'

const s = (state: RootState) => state.columns || EMPTY_OBJ

export const columnSelector = (state: RootState, columnId: string) => {
  if (!columnId) return

  const byId = s(state).byId
  return (byId && byId[columnId]) || undefined
}

export const columnIdsSelector = (state: RootState) =>
  s(state).allIds || EMPTY_ARRAY

export const columnCountSelector = (state: RootState) =>
  columnIdsSelector(state).length

export const columnsArrSelector = createImmerSelector((state: RootState) => {
  const byId = s(state).byId
  const columnIds = columnIdsSelector(state)

  if (!(byId && columnIds)) return EMPTY_ARRAY

  return columnIds.map(columnId => byId[columnId]).filter(Boolean) as Column[]
})

export const hasCreatedColumnSelector = (state: RootState) =>
  s(state).byId !== null

export const createColumnSubscriptionsSelector = () =>
  createImmerSelector((state: RootState, columnId: string) => {
    const column = columnSelector(state, columnId)
    const subscriptionIds = (column && column.subscriptionIds) || EMPTY_ARRAY

    return subscriptionIds
      .map(subscriptionId => subscriptionSelector(state, subscriptionId))
      .filter(Boolean) as ColumnSubscription[]
  })

export const createColumnSubscriptionSelector = () => {
  const columnSubscriptionsSelector = createColumnSubscriptionsSelector()

  return (
    state: RootState,
    columnId: string,
  ): ColumnSubscription | undefined => {
    return (
      columnSubscriptionsSelector(state, columnId).slice(-1)[0] || undefined
    )
  }
}

export const createColumnHeaderDetailsSelector = () => {
  const columnSubscriptionsSelector = createColumnSubscriptionsSelector()
  const getColumnHeaderDetailsMemoized = createImmerSelector(
    getColumnHeaderDetails,
  )

  return createImmerSelector((state: RootState, columnId: string) => {
    const subscriptions = columnSubscriptionsSelector(state, columnId)

    const column = columnSelector(state, columnId)
    if (!column) return undefined

    const loggedUsername = currentGitHubUsernameSelector(state)

    return getColumnHeaderDetailsMemoized(
      column,
      subscriptions,
      { loggedUsername },
      PixelRatio.getPixelSizeForLayoutSize,
    )
  })
}

export const createColumnDataSelector = () => {
  const subscriptionsDataSelector = createSubscriptionsDataSelector()
  const itemsBySubscriptionIdsSelector = createItemsBySubscriptionIdsSelector()

  return (state: RootState, columnId: string) => {
    let saved: boolean | undefined

    const subscriptionIds = (() => {
      const column = columnSelector(state, columnId)
      if (!column) return EMPTY_ARRAY

      saved = column.filters && column.filters.saved

      if (
        saved &&
        column.subscriptionIdsHistory &&
        column.subscriptionIdsHistory.length
      )
        return column.subscriptionIdsHistory

      if (column.subscriptionIds && column.subscriptionIds.length)
        return column.subscriptionIds

      return EMPTY_ARRAY
    })()

    if (saved) return itemsBySubscriptionIdsSelector(state, subscriptionIds)

    return subscriptionsDataSelector(state, subscriptionIds)
  }
}
