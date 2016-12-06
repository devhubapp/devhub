// @flow

import { denormalize } from 'denormalizr';
import { List, Map } from 'immutable';
import { createSelector } from 'reselect';

import { EventSchema } from '../utils/normalizr/schemas';

export const stateSelector = state => state || Map();
export const entitiesSelector = state => state.get('entities') || Map();
export const columnEventsIdsSelector = (state, { column }) => column.get('events') || List();

export const sortEventsByDate = (b, a) => (a.get('created_at') > b.get('created_at') ? 1 : -1);

export const eventSelector = createSelector(
  entitiesSelector,
  (state, { id }) => id,
  (entities, eventId) => denormalize(eventId, entities, EventSchema),
);

export const columnEventsSelector = createSelector(
  stateSelector,
  columnEventsIdsSelector,
  (state, eventsIds) => List(
    eventsIds
      .take(50)
      .map(eventId => eventSelector(state, { id: eventId }))
    ,
  ).sort(sortEventsByDate),
);
