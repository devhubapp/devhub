// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';
import { Set } from 'immutable';

import {
  createImmutableSelectorCreator,
  createImmutableSelector,
  entitiesSelector,
  isArchivedFilter,
  isDeletedFilter,
  isReadFilter,
} from './shared';

import { makeColumnEventIdsSelector } from './columns';
import { EventSchema } from '../utils/normalizr/schemas';
import { groupSimilarEvents } from '../utils/helpers/github/events';

export const eventIdSelector = (state, { eventId }) => eventId;
export const eventEntitiesSelector = (state) => entitiesSelector(state).get('events');
export const eventSelector = (state, { eventId }) => eventEntitiesSelector(state).get(eventId);
export const sortEventsByDate = (b, a) => (a.get('created_at') > b.get('created_at') ? 1 : -1);

export const archivedEventIdsSelector = createImmutableSelector(
  eventEntitiesSelector,
  (events) => (
    events
      .filter(isArchivedFilter)
      .map(event => event.get('id'))
      .toList()
  ),
);

export const readEventIdsSelector = createImmutableSelector(
  eventEntitiesSelector,
  (events) => (
    events
      .filter(isReadFilter)
      .map(event => event.get('id'))
      .toList()
  ),
);

export const unarchivedEventIdsSelector = createImmutableSelector(
  eventEntitiesSelector,
  (events) => (
    events
      .filter(Boolean)
      .filterNot(isDeletedFilter)
      .filterNot(isArchivedFilter)
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

export const makeDenormalizedEventSelector = () =>
  createImmutableSelectorCreator(1)(eventSelector, entitiesSelector, (
    event,
    entities,
  ) =>
    denormalize(event, entities, EventSchema)
      .filter(Boolean)
      .filterNot(isDeletedFilter));

export const makeDenormalizedOrderedColumnEventsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector();

  return createImmutableSelectorCreator(1)(
    columnEventIdsSelector,
    unarchivedEventIdsSelector,
    entitiesSelector,
    (eventIds, unarchivedEventIds, entities) => {
      const notArchivedIds = Set(eventIds).intersect(unarchivedEventIds);

      return groupSimilarEvents(
        denormalize(notArchivedIds, entities, [EventSchema])
          .filter(Boolean)
          .sort(sortEventsByDate)
        ,
      );
    },
  );
};
