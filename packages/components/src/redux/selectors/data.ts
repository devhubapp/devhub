import { EnhancedItem } from '@devhub/core'
import { createSelector } from 'reselect'

import { EMPTY_ARRAY, EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'

const s = (state: RootState) => state.data || EMPTY_OBJ

export const dataByNodeIdOrId = (state: RootState) => s(state).byId

export const dataNodeIdsOrIdsBySubscriptionId = (state: RootState) =>
  s(state).idsBySubscriptionId

export const itemsBySubscriptionIdsSelector = createSelector(
  (_state: RootState, subscriptionIds: string[]) => subscriptionIds,
  (state: RootState, _subscriptionIds: string[]) =>
    dataNodeIdsOrIdsBySubscriptionId(state),
  (state: RootState, _subscriptionIds: string[]) => dataByNodeIdOrId(state),
  (subscriptionIds, idsBySubscriptionId, entryById) => {
    if (!idsBySubscriptionId) return EMPTY_ARRAY
    if (!(subscriptionIds && subscriptionIds.length)) return EMPTY_ARRAY

    const itemIds: string[] = []
    const items: EnhancedItem[] = []
    subscriptionIds.forEach(subscriptionId => {
      const ids = idsBySubscriptionId[subscriptionId]
      if (!(ids && ids.length)) return

      ids.forEach(id => {
        if (!id) return
        if (itemIds.includes(id)) return

        const entry = entryById[id]
        if (!(entry && entry.item)) return

        itemIds.push(id)
        items.push(entry.item)
      })
    })

    if (!(items && items.length)) return EMPTY_ARRAY

    return items
  },
)
