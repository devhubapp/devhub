import { createSelector } from 'reselect'

import {
  ColumnFilters,
  ColumnSubscription,
  EnhancedGitHubEvent,
  EnhancedGitHubNotification,
  sortEvents,
  sortNotifications,
} from '@devhub/core'
import {
  getFilteredEvents,
  getFilteredNotifications,
} from '../../utils/helpers/filters'
import { RootState } from '../types'

const s = (state: RootState) => state.subscriptions || {}

export const subscriptionIdsSelector = (state: RootState) =>
  s(state).allIds || []

export const createSubscriptionSelector = () =>
  createSelector(
    (state: RootState) => s(state).byId,
    (_state: RootState, id: string) => id,
    (byId, id) => byId && byId[id],
  )

export const subscriptionSelector = createSubscriptionSelector()

export const subscriptionsArrSelector = createSelector(
  (state: RootState) => s(state).byId,
  (state: RootState) => subscriptionIdsSelector(state),
  (byId, ids) => ids.map(id => byId && byId[id]).filter(Boolean),
)

export const createSubscriptionsDataSelector = () =>
  createSelector(
    (state: RootState, subscriptionIds: string[]) =>
      subscriptionIds.map(id => subscriptionSelector(state, id)),
    subscriptions => {
      let items: ColumnSubscription['data']['items']

      subscriptions.forEach(subscription => {
        if (
          !(
            subscription &&
            subscription.data &&
            subscription.data.items &&
            subscription.data.items.length
          )
        )
          return

        if (!items) {
          items = subscription.data.items
        } else {
          items = [...items, ...subscription.data.items] as any
        }
      })

      if (!(items && items.length)) return []

      if (subscriptions[0]!.type === 'notifications') {
        return sortNotifications(items as EnhancedGitHubNotification[])
      }

      return sortEvents(items as EnhancedGitHubEvent[])
    },
  )

export const createFilteredSubscriptionsDataSelector = () => {
  const subscriptionsDataSelector = createSubscriptionsDataSelector()

  return createSelector(
    (state: RootState, subscriptionIds: string[]) => {
      const firstSubscription = subscriptionIds
        .map(id => subscriptionSelector(state, id))
        .filter(Boolean)[0]

      return firstSubscription && firstSubscription.type
    },
    (state: RootState, subscriptionIds: string[]) =>
      subscriptionsDataSelector(state, subscriptionIds),
    (_state: RootState, _subscriptionIds: string[], filters: ColumnFilters) =>
      filters,
    (type, items, filters) => {
      if (!(items && items.length)) return []

      if (type === 'notifications') {
        return getFilteredNotifications(
          items as EnhancedGitHubNotification[],
          filters,
        )
      }

      return getFilteredEvents(items as EnhancedGitHubEvent[], filters)
    },
  )
}
