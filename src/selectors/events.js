// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';

import {
  createImmutableSelectorCreator,
  createImmutableSelector,
  entitiesSelector,
  isArchivedFilter,
} from './shared';

import { makeColumnEventIdsSelector } from './columns';
import { EventSchema } from '../utils/normalizr/schemas';
import { groupSimilarEvents } from '../utils/helpers';

export const eventIdSelector = (state, { eventId }) => eventId;
export const eventSelector = (state, { eventId }) => entitiesSelector(state).getIn(['events', eventId]);
export const seenEventIdsSelector = state => state.get('seenEvents').toList();
export const sortEventsByDate = (b, a) => (a.get('created_at') > b.get('created_at') ? 1 : -1);

export const makeSeenEventSelector = () => createImmutableSelector(
  eventIdSelector,
  seenEventIdsSelector,
  (eventId, readIds) => !!readIds.includes(eventId),
);

export const makeDenormalizedEventSelector = () => createImmutableSelectorCreator(1)(
  eventSelector,
  entitiesSelector,
  (event, entities) => denormalize(event, entities, EventSchema),
);

export const makeDenormalizedOrderedColumnEventsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector();

  return createImmutableSelectorCreator(1)(
    columnEventIdsSelector,
    entitiesSelector,
    (eventIds, entities) => groupSimilarEvents(
      denormalize(eventIds, entities, [EventSchema])
        .filter(Boolean)
        .filterNot(isArchivedFilter)
        .sort(sortEventsByDate)
      ,
    ),
  );
};
