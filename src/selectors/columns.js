// @flow
/*  eslint-disable import/prefer-default-export */

import moment from 'moment';
import { denormalize } from 'denormalizr';
import { List, Map, Set } from 'immutable';
import { memoize } from 'lodash';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { subscriptionsSelector, subscriptionSelector } from './subscriptions';

export const objectKeysMemoized = memoize(obj => (obj ? obj.keySeq() : Seq()));

const stateSelector = state => state || Map();
const entitiesSelector = state => state.get('entities') || Map();

export const columnIdSelector = (state, { columnId }) => columnId;
export const columnsSelector = state => entitiesSelector(state).get('columns') || Map();
export const columnIdsSelector = state => objectKeysMemoized(columnsSelector(state)) || List();

const sortColumnsByDate = (b, a) => (
  moment(a.get('createdAt')).isAfter(moment(b.get('createdAt'))) ? 1 : -1
);

export const makeColumnSelector = () => createSelector(
  columnIdSelector,
  columnsSelector,
  (columnId, columns) => (
    columns.get(columnId)
  ),
);

export const columnSelector = makeColumnSelector();

export const columnSubscriptionIdsSelector = (state, { columnId }) => (
  (columnSelector(state, { columnId }) || Map()).get('subscriptions') || List()
);

export const columnEventIdsSelector = createSelector(
  stateSelector,
  columnIdSelector,
  columnSubscriptionIdsSelector,
  (state, columnId, subscriptionsIds) => {
    let eventIds = Set();

    subscriptionsIds.forEach((subscriptionId) => {
      const subscription = subscriptionSelector(state, { subscriptionId });
      const subscriptionEventIds = subscription.get('events') || List();
      eventIds = eventIds.union(subscriptionEventIds);
    });

    return eventIds.toList();
  },
);

export const makeColumnSubscriptionsSelector = () => createSelector(
  columnSubscriptionIdsSelector,
  subscriptionsSelector,
  (subscriptionIds, subscriptions) => (
    subscriptionIds.map(subscriptionId => (
      subscriptions.get(subscriptionId)
    ))
  ),
);

const columnSubscriptionsSelector = makeColumnSubscriptionsSelector();

export const columnIsLoadingSelector = createSelector(
  columnSubscriptionsSelector,
  subscriptions => subscriptions.some(subscription => subscription.get('loading')),
);

export const columnErrorsSelector = createSelector(
  columnSubscriptionsSelector,
  subscriptions => subscriptions
    .reduce((errors, subscription) => errors.concat(subscription.get('error')), [])
    .filter(Boolean),
);

export const columnListSelector = createSelector(
  columnsSelector,
  (columns) => (
    columns
      .toList()
      .sort(sortColumnsByDate)
  ),
);
