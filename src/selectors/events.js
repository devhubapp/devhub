// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';

import {
  createImmutableSelectorCreator,
  createImmutableSelector,
  entitiesSelector,
  isArchivedFilter,
  isReadFilter,
} from './shared';

import { makeColumnEventIdsSelector } from './columns';
import { EventSchema } from '../utils/normalizr/schemas';
import { groupSimilarEvents } from '../utils/helpers';

export const eventIdSelector = (state, { eventId }) => eventId;
export const eventEntitiesSelector = (state) => entitiesSelector(state).get('events');
export const eventSelector = (state, { eventId }) => eventEntitiesSelector(state).get(eventId);
export const sortEventsByDate = (b, a) => (a.get('created_at') > b.get('created_at') ? 1 : -1);

export const readEventIdsSelector = createImmutableSelector(
  eventEntitiesSelector,
  (events) => (
    events
      .filter(Boolean)
      .filter(isReadFilter)
      .map(event => event.get('id'))
      .toList()
  ),
);

export const makeIsArchivedEventSelector = () => createImmutableSelector(
  eventSelector,
  isArchivedFilter,
);

export const makeIsReadEventSelector = () => createImmutableSelector(
  eventIdSelector,
  readEventIdsSelector,
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
