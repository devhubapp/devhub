// @flow

import { denormalize } from 'denormalizr';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { SubscriptionSchema } from '../utils/normalizr/schemas';

const entitiesSelector = state => state.get('entities');
const subscriptionsIdsSelector = (state, { column }) => column.get('subscriptions');

export const columnSubscriptionsSelector = createSelector(
  entitiesSelector,
  subscriptionsIdsSelector,
  (entities, subscriptionsIds) => (
    denormalize(subscriptionsIds, entities, arrayOf(SubscriptionSchema))
  ),
);
