// @flow

import { denormalize } from 'denormalizr';
import { List, Map } from 'immutable';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { SubscriptionSchema } from '../utils/normalizr/schemas';

export const entitiesSelector = state => state.get('entities') || Map();
export const subscriptionsSelector = state => entitiesSelector(state).get('subscriptions') || List();
export const columnSubscriptionsIdsSelector = (state, { column }) => column.get('subscriptions') || List();
export const subscriptionSelector = (state, { id }) => subscriptionsSelector(state).get(id) || Map();

export const columnSubscriptionsSelector = createSelector(
  entitiesSelector,
  columnSubscriptionsIdsSelector,
  (entities, subscriptionsIds) => (
    denormalize(subscriptionsIds, entities, arrayOf(SubscriptionSchema))
  ),
);
