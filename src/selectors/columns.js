// @flow
/*  eslint-disable import/prefer-default-export */

import moment from 'moment'
import { List, Map, Set } from 'immutable'

import { archivedEventIdsSelector, readEventIdsSelector } from './events'
import {
  subscriptionsEntitySelector,
  subscriptionSelector,
} from './subscriptions'
import {
  createImmutableSelector,
  entitiesSelector,
  objectKeysMemoized,
  stateSelector,
} from './shared'

import { get } from '../utils/immutable'

export const columnIdSelector = (state, { columnId }) => columnId
export const columnsEntitySelector = state =>
  get(entitiesSelector(state), 'columns').filter(Boolean)
export const columnIdsSelector = state =>
  objectKeysMemoized(columnsEntitySelector(state))

const sortColumnsByDate = (b, a) =>
  a && b
    ? moment(get(a, 'createdAt')).isAfter(moment(get(b, 'createdAt'))) ? 1 : -1
    : 0

export const makeColumnSelector = () =>
  createImmutableSelector(
    columnIdSelector,
    columnsEntitySelector,
    (columnId, columns) => get(columns, columnId),
  )

export const columnSubscriptionIdsSelector = (state, { columnId }) => {
  const columnSelector = makeColumnSelector()
  return (
    get(columnSelector(state, { columnId }) || Map(), 'subscriptions') || List()
  )
}

export const makeColumnEventIdsSelector = () =>
  createImmutableSelector(
    stateSelector,
    columnIdSelector,
    columnSubscriptionIdsSelector,
    (state, columnId, subscriptionsIds) => {
      let eventIds = Set()

      subscriptionsIds.forEach(subscriptionId => {
        const subscription = subscriptionSelector(state, { subscriptionId })
        if (!subscription) return

        const subscriptionEventIds = Set(get(subscription, 'events'))
        eventIds = eventIds.union(subscriptionEventIds)
      })

      return eventIds.toList()
    },
  )

export const makeColumnArchivedIdsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector()

  return createImmutableSelector(
    archivedEventIdsSelector,
    columnEventIdsSelector,
    (archivedIds, columnEventIds) =>
      Set(archivedIds).intersect(columnEventIds).toList(),
  )
}

export const makeColumnReadIdsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector()

  return createImmutableSelector(
    readEventIdsSelector,
    columnEventIdsSelector,
    (readIds, columnEventIds) =>
      Set(readIds).intersect(columnEventIds).toList(),
  )
}

export const makeColumnSubscriptionsSelector = () =>
  createImmutableSelector(
    columnSubscriptionIdsSelector,
    subscriptionsEntitySelector,
    (subscriptionIds, subscriptions) =>
      subscriptionIds
        .map(subscriptionId => get(subscriptions, subscriptionId))
        .filter(Boolean),
  )

const columnSubscriptionsSelector = makeColumnSubscriptionsSelector()

export const columnIsLoadingSelector = createImmutableSelector(
  columnSubscriptionsSelector,
  subscriptions =>
    subscriptions.some(subscription => get(subscription, 'loading')),
)

export const columnErrorsSelector = createImmutableSelector(
  columnSubscriptionsSelector,
  subscriptions =>
    subscriptions
      .reduce(
        (errors, subscription) => errors.concat(get(subscription, 'error')),
        [],
      )
      .filter(Boolean),
)

export const orderedColumnsSelector = createImmutableSelector(
  columnsEntitySelector,
  columns =>
    columns
      .toList()
      .sort(sortColumnsByDate)
      .sortBy(column => get(column, 'order')),
)

export const makeColumnIsEmptySelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector()
  const columnArchivedIdsSelector = makeColumnArchivedIdsSelector()

  return createImmutableSelector(
    columnEventIdsSelector,
    columnArchivedIdsSelector,
    (columnEventIds, columnArchivedIds) =>
      columnEventIds.size === columnArchivedIds.size,
  )
}
