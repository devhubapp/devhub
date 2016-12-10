// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';
import { Map } from 'immutable';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { SubscriptionSchema } from '../utils/normalizr/schemas';

const entitiesSelector = state => state.get('entities') || Map();

export const subscriptionIdSelector = (state, { subscriptionId }) => subscriptionId;

export const subscriptionsSelector = state => (
  entitiesSelector(state).get('subscriptions') || Map()
);

export const denormalizedSubscriptionsSelector = createSelector(
  subscriptionsSelector,
  entitiesSelector,
  (subscriptions, entities) => (
    denormalize(subscriptions, entities, arrayOf(SubscriptionSchema))
  ),
);

export const subscriptionSelector = createSelector(
  subscriptionIdSelector,
  subscriptionsSelector,
  (subscriptionId, subscriptions) => subscriptions.get(subscriptionId),
);

export default denormalizedSubscriptionsSelector;
