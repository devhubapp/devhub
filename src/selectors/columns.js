// @flow
/*  eslint-disable import/prefer-default-export */

import moment from 'moment'
import { List, Map, Set } from 'immutable'

import {
  archivedEventIdsSelector,
  readEventIdsSelector,
  eventIdsSelector,
} from './events'
import {
  subscriptionsEntitySelector,
  subscriptionSelector,
} from './subscriptions'
import {
  createImmutableSelector,
  createImmutableSelectorCreator,
  // createObjectKeysMemoized,
  entitiesSelector,
  stateSelector,
} from './shared'

import { get } from '../utils/immutable'

// const objectKeysMemoized = createObjectKeysMemoized()

export const columnIdSelector = (state, { columnId }) => columnId

export const columnsEntitySelector = createImmutableSelector(
  state => get(entitiesSelector(state), 'columns'),
  columns => columns.filter(Boolean).set('new', Map({ id: 'new', order: 999 })),
)

const sortColumnsByDate = (b, a) =>
  a && b
    ? moment(get(a, 'createdAt')).isAfter(moment(get(b, 'createdAt'))) ? 1 : -1
    : 0

export const orderedColumnsSelector = createImmutableSelector(
  columnsEntitySelector,
  columns =>
    columns
      .toList()
      .sort(sortColumnsByDate)
      .sortBy(column => get(column, 'order'))
      .sort(column => (get(column, 'id') === 'new' ? 1 : 0)), // put new column at the end
)

export const columnIdsSelector = createImmutableSelector(
  orderedColumnsSelector,
  columns => columns.toList().map(column => get(column, 'id')),
)

export const makeColumnSelector = () =>
  createImmutableSelector(
    columnIdSelector,
    columnsEntitySelector,
    (columnId, columns) => get(columns, columnId),
  )

export const makeColumnSubscriptionIdsSelector = () => {
  const columnSelector = makeColumnSelector()

  return createImmutableSelector(
    columnSelector,
    column => get(column || Map(), 'subscriptions') || List(),
  )
}

export const makeColumnEventIdsSelector = () => {
  const columnSubscriptionIdsSelector = makeColumnSubscriptionIdsSelector()

  return createImmutableSelectorCreator(3)(
    columnIdSelector,
    columnSubscriptionIdsSelector,
    eventIdsSelector,
    stateSelector,
    (columnId, subscriptionsIds, _allEventIds, state) => {
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
}

export const makeColumnArchivedIdsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector()

  return createImmutableSelector(
    archivedEventIdsSelector,
    columnEventIdsSelector,
    (archivedIds, columnEventIds) =>
      Set(archivedIds)
        .intersect(columnEventIds)
        .toList(),
  )
}

export const makeColumnReadIdsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector()

  return createImmutableSelector(
    readEventIdsSelector,
    columnEventIdsSelector,
    (readIds, columnEventIds) =>
      Set(readIds)
        .intersect(columnEventIds)
        .toList(),
  )
}

export const makeColumnSubscriptionsSelector = () => {
  const columnSubscriptionIdsSelector = makeColumnSubscriptionIdsSelector()

  return createImmutableSelector(
    columnSubscriptionIdsSelector,
    subscriptionsEntitySelector,
    (subscriptionIds, subscriptions) =>
      subscriptionIds
        .map(subscriptionId => get(subscriptions, subscriptionId))
        .filter(Boolean),
  )
}

export const makeColumnIsLoadingSelector = () => {
  const columnSubscriptionsSelector = makeColumnSubscriptionsSelector()

  return createImmutableSelector(columnSubscriptionsSelector, subscriptions =>
    subscriptions.some(subscription => get(subscription, 'loading')),
  )
}

export const makeColumnErrorsSelector = () => {
  const columnSubscriptionsSelector = makeColumnSubscriptionsSelector()

  return createImmutableSelector(columnSubscriptionsSelector, subscriptions =>
    subscriptions
      .reduce(
        (errors, subscription) => errors.concat(get(subscription, 'error')),
        List(),
      )
      .filter(Boolean),
  )
}

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
