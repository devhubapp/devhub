// @flow

import { denormalize } from 'denormalizr';
import { List, Map } from 'immutable';
import { createSelector } from 'reselect';

import { SubscriptionSchema } from '../utils/normalizr/schemas';

export const stateSelector = state => state || Map();
export const entitiesSelector = state => state.get('entities') || Map();
export const subscriptionsSelector = state => entitiesSelector(state).get('subscriptions') || List();
export const columnSubscriptionsIdsSelector = (state, { column }) => column.get('subscriptions') || List();

export const subscriptionSelector = createSelector(
  entitiesSelector,
  (state, { id }) => id,
  (entities, subscriptionId) => denormalize(subscriptionId, entities, SubscriptionSchema),
);


export const columnSubscriptionsSelector = createSelector(
  stateSelector,
  columnSubscriptionsIdsSelector,
  (state, subscriptionsIds) => (
    subscriptionsIds.map(id => subscriptionSelector(state, { id }))
  ),
);
