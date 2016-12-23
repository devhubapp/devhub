// @flow
/*  eslint-disable import/prefer-default-export */

import moment from 'moment';
import { List, Map, Set } from 'immutable';

import { seenEventIdsSelector } from './events';
import { subscriptionsSelector, subscriptionSelector } from './subscriptions';
import { createImmutableSelector, entitiesSelector, objectKeysMemoized, stateSelector } from './shared';

export const columnIdSelector = (state, { columnId }) => columnId;
export const columnsSelector = state => entitiesSelector(state).get('columns');
export const columnIdsSelector = state => objectKeysMemoized(columnsSelector(state));

const sortColumnsByDate = (b, a) => (
  moment(a.get('createdAt')).isAfter(moment(b.get('createdAt'))) ? 1 : -1
);

export const makeColumnSelector = () => createImmutableSelector(
  columnIdSelector,
  columnsSelector,
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
      const subscriptionEventIds = Set(subscription.get('events'));
      eventIds = eventIds.union(subscriptionEventIds);
    });

    return eventIds;
  },
);

export const makeColumnSeenEventIdsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector();

  return createImmutableSelector(
    seenEventIdsSelector,
    columnEventIdsSelector,
    (seenEventIds, columnEventIds) => seenEventIds.intersect(columnEventIds),
  );
};

export const makeColumnSubscriptionsSelector = () => createImmutableSelector(
  columnSubscriptionIdsSelector,
  subscriptionsSelector,
  (subscriptionIds, subscriptions) => (
    subscriptionIds.map(subscriptionId => (
      subscriptions.get(subscriptionId)
    ))
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

export const columnListSelector = createImmutableSelector(
  columnsSelector,
  (columns) => (
    columns
      .toList()
      .sort(sortColumnsByDate)
  ),
);
