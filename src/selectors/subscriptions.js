// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';
import { Map } from 'immutable';
import { arrayOf } from 'normalizr';

import { createImmutableSelector, entitiesSelector } from './shared';
import { SubscriptionSchema } from '../utils/normalizr/schemas';

export const subscriptionIdSelector = (state, { subscriptionId }) => subscriptionId;

export const subscriptionsSelector = state => (
  entitiesSelector(state).get('subscriptions') || Map()
);

export const denormalizedSubscriptionsSelector = createImmutableSelector(
  subscriptionsSelector,
  entitiesSelector,
  (subscriptions, entities) => (
    denormalize(subscriptions, entities, arrayOf(SubscriptionSchema))
  ),
);

export const subscriptionSelector = createImmutableSelector(
  subscriptionIdSelector,
  subscriptionsSelector,
  (subscriptionId, subscriptions) => subscriptions.get(subscriptionId),
);

export default denormalizedSubscriptionsSelector;
