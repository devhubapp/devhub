// @flow

import { denormalize } from 'denormalizr';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { EventSchema } from '../utils/normalizr/schemas';

const entitiesSelector = state => state.get('entities');
const eventsIdsSelector = (state, { column }) => column.get('events');

const sortEventsByDate = (b, a) => (a.get('created_at') > b.get('created_at') ? 1 : -1);

export const columnEventsSelector = createSelector(
  entitiesSelector,
  eventsIdsSelector,
  (entities, eventsIds) => (
    denormalize(eventsIds, entities, arrayOf(EventSchema))
  ).sort(sortEventsByDate),
);
