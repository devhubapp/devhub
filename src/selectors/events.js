// @flow

import { denormalize } from 'denormalizr';
import { List, Map } from 'immutable';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { EventSchema } from '../utils/normalizr/schemas';

export const entitiesSelector = state => state.get('entities') || Map();
export const eventsIdsSelector = (state, { column }) => column.get('events') || Map();

export const sortEventsByDate = (b, a) => (a.get('created_at') > b.get('created_at') ? 1 : -1);

export const columnEventsSelector = createSelector(
  entitiesSelector,
  eventsIdsSelector,
  (entities, eventsIds) => (
    denormalize(eventsIds, entities, arrayOf(EventSchema))
  ).sort(sortEventsByDate),
);
