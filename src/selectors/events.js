// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';
import { arrayOf } from 'normalizr';

import { createImmutableSelector, entitiesSelector } from './shared';
import { columnEventIdsSelector } from './columns';
import { EventSchema } from '../utils/normalizr/schemas';
import { mergeSimilarEvents } from '../utils/helpers';

export const eventIdSelector = (state, { eventId }) => eventId;
export const sortEventsByDate = (b, a) => (a.get('created_at') > b.get('created_at') ? 1 : -1);

export const makeDenormalizedEventSelector = () => createImmutableSelector(
  eventIdSelector,
  entitiesSelector,
  (eventId, entities) => denormalize(eventId, entities, EventSchema),
);

export const makeDenormalizedColumnEventsSelector = () => createImmutableSelector(
  columnEventIdsSelector,
  entitiesSelector,
  (eventIds, entities) => mergeSimilarEvents(
    denormalize(eventIds, entities, arrayOf(EventSchema))
      .filter(Boolean)
      .sort(sortEventsByDate)
    ,
  ),
);
