// @flow
/*  eslint-disable import/prefer-default-export */

import moment from 'moment';
import { List, Map, Set } from 'immutable';

import { archivedEventIdsSelector, readEventIdsSelector } from './events';
import { subscriptionsEntitySelector, subscriptionSelector } from './subscriptions';
import { createImmutableSelector, entitiesSelector, objectKeysMemoized, stateSelector } from './shared';

export const columnIdSelector = (state, { columnId }) => columnId;
export const columnsEntitySelector = state => entitiesSelector(state).get('columns');
export const columnIdsSelector = state => objectKeysMemoized(columnsEntitySelector(state));

const sortColumnsByDate = (b, a) => (
  moment(a.get('createdAt')).isAfter(moment(b.get('createdAt'))) ? 1 : -1
);

export const makeColumnSelector = () => createImmutableSelector(
  columnIdSelector,
  columnsEntitySelector,
  (columnId, columns) => (
    columns.get(columnId)
  ),
);

export const columnSubscriptionIdsSelector = (state, { columnId }) => {
  const columnSelector = makeColumnSelector();
  return (columnSelector(state, { columnId }) || Map()).get('subscriptions') || List();
};

export const makeColumnEventIdsSelector = () => createImmutableSelector(
  stateSelector,
  columnIdSelector,
  columnSubscriptionIdsSelector,
  (state, columnId, subscriptionsIds) => {
    let eventIds = Set();

    subscriptionsIds.forEach((subscriptionId) => {
      const subscription = subscriptionSelector(state, { subscriptionId });
      if (!subscription) return;

      const subscriptionEventIds = Set(subscription.get('events'));
      eventIds = eventIds.union(subscriptionEventIds);
    });

    return eventIds.toList();
  },
);

export const makeColumnArchivedIdsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector();

  return createImmutableSelector(
    archivedEventIdsSelector,
    columnEventIdsSelector,
    (archivedIds, columnEventIds) => Set(archivedIds).intersect(columnEventIds),
  );
};

export const makeColumnReadIdsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector();

  return createImmutableSelector(
    readEventIdsSelector,
    columnEventIdsSelector,
    (readIds, columnEventIds) => Set(readIds).intersect(columnEventIds),
  );
};

export const makeColumnSubscriptionsSelector = () => createImmutableSelector(
  columnSubscriptionIdsSelector,
  subscriptionsEntitySelector,
  (subscriptionIds, subscriptions) => (
    subscriptionIds.map(subscriptionId => (
      subscriptions.get(subscriptionId)
    )).filter(Boolean)
  ),
);

const columnSubscriptionsSelector = makeColumnSubscriptionsSelector();

export const columnIsLoadingSelector = createImmutableSelector(
  columnSubscriptionsSelector,
  subscriptions => subscriptions.some(subscription => subscription.get('loading')),
);

export const columnErrorsSelector = createImmutableSelector(
  columnSubscriptionsSelector,
  subscriptions => subscriptions
    .reduce((errors, subscription) => errors.concat(subscription.get('error')), [])
    .filter(Boolean),
);

export const orderedColumnsSelector = createImmutableSelector(
  columnsEntitySelector,
  (columns) => (
    columns
      .toList()
      .sort(sortColumnsByDate)
      .sortBy(column => column.get('order'))
  ),
);

export const makeColumnIsEmptySelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector();
  const columnArchivedIdsSelector = makeColumnArchivedIdsSelector();

  return createImmutableSelector(
    columnEventIdsSelector,
    columnArchivedIdsSelector,
    (columnEventIds, columnArchivedIds) => columnEventIds.size === columnArchivedIds.size,
  );
};
