// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';

import {
  createImmutableSelector,
  createImmutableSelectorCreator,
  entitiesSelector,
  objectKeysMemoized,
} from './shared';

import { SubscriptionSchema } from '../utils/normalizr/schemas';

export const subscriptionIdSelector = (state, { subscriptionId }) =>
  subscriptionId;

export const subscriptionsEntitySelector = state =>
  entitiesSelector(state).get('subscriptions');

export const subscriptionIdsSelector = state =>
  objectKeysMemoized(subscriptionsEntitySelector(state));

export const denormalizedSubscriptionsSelector = createImmutableSelectorCreator(
  1,
)(subscriptionsEntitySelector, entitiesSelector, (subscriptions, entities) =>
  denormalize(subscriptions, entities, [SubscriptionSchema]),
);

export const subscriptionSelector = createImmutableSelector(
  subscriptionIdSelector,
  subscriptionsEntitySelector,
  (subscriptionId, subscriptions) => subscriptions.get(subscriptionId),
);

export const subscriptionEventsSelector = createImmutableSelector(
  subscriptionSelector,
  subscription => subscription && subscription.get('events'),
);

export default denormalizedSubscriptionsSelector;

export const subscriptionsIsLoadingSelector = createImmutableSelector(
  subscriptionsEntitySelector,
  subscriptions =>
    subscriptions.some(subscription => subscription.get('loading')),
);
