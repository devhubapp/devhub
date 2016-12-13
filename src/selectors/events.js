// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';
import { Map } from 'immutable';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { columnEventIdsSelector } from './columns';
import { EventSchema } from '../utils/normalizr/schemas';
import { mergeSimilarEvents } from '../utils/helpers';

const entitiesSelector = state => state.get('entities') || Map();

export const eventIdSelector = (state, { eventId }) => eventId;
export const sortEventsByDate = (b, a) => (a.get('created_at') > b.get('created_at') ? 1 : -1);

export const makeDenormalizedEventSelector = () => createSelector(
  eventIdSelector,
  entitiesSelector,
  (eventId, entities) => denormalize(eventId, entities, EventSchema),
);

export const makeDenormalizedColumnEventsSelector = () => createSelector(
  columnEventIdsSelector,
  entitiesSelector,
  (eventIds, entities) => mergeSimilarEvents(
    denormalize(eventIds, entities, arrayOf(EventSchema))
      .filter(Boolean)
      .sort(sortEventsByDate)
  ),
);
