// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';
import { arrayOf } from 'normalizr';

import { createImmutableSelector, entitiesSelector } from './shared';
import { makeColumnEventIdsSelector } from './columns';
import { EventSchema } from '../utils/normalizr/schemas';
import { groupSimilarEvents } from '../utils/helpers';

export const eventIdSelector = (state, { eventId }) => eventId;
export const seenEventIdsSelector = state => state.get('seenEvents');
export const sortEventsByDate = (b, a) => (a.get('created_at') > b.get('created_at') ? 1 : -1);

export const makeSeenEventSelector = () => createImmutableSelector(
  eventIdSelector,
  seenEventIdsSelector,
  (eventId, seenIds) => seenIds.includes(eventId),
);

export const makeDenormalizedEventSelector = () => createImmutableSelector(
  eventIdSelector,
  entitiesSelector,
  (eventId, entities) => denormalize(eventId, entities, EventSchema),
);

export const makeDenormalizedOrderedColumnEventsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector();

  return createImmutableSelector(
    columnEventIdsSelector,
    entitiesSelector,
    (eventIds, entities) => groupSimilarEvents(
      denormalize(eventIds, entities, arrayOf(EventSchema))
        .filter(Boolean)
        .sort(sortEventsByDate)
      ,
    ),
  );
};
