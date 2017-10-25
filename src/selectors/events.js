// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr'
import { Set } from 'immutable'

import {
  createImmutableSelector,
  createImmutableSelectorCreator,
  createObjectKeysMemoized,
  entitiesSelector,
  isArchivedFilter,
  isDeletedFilter,
  isReadFilter,
} from './shared'

import { makeColumnEventIdsSelector } from './columns'
import { EventSchema } from '../utils/normalizr/schemas'
import { groupSimilarEvents } from '../utils/helpers/github/events'
import { get } from '../utils/immutable'

const objectKeysMemoized = createObjectKeysMemoized()

export const eventIdSelector = (state, { eventId }) => eventId

export const eventEntitiesSelector = createImmutableSelector(
  state => get(entitiesSelector(state), 'events'),
  events => events.filter(Boolean),
)

export const eventIdsSelector = state =>
  objectKeysMemoized(eventEntitiesSelector(state))

export const eventSelector = (state, { eventId }) =>
  eventEntitiesSelector(state).get(eventId)

export const sortEventsByDate = (b, a) =>
  a && b ? (a.get('created_at') > b.get('created_at') ? 1 : -1) : 0

export const archivedEventIdsSelector = createImmutableSelector(
  eventEntitiesSelector,
  events =>
    events
      .filter(isArchivedFilter)
      .map(event => event.get('id'))
      .toList(),
)

export const readEventIdsSelector = createImmutableSelector(
  eventEntitiesSelector,
  events =>
    events
      .filter(isReadFilter)
      .map(event => event.get('id'))
      .toList(),
)

export const unarchivedEventIdsSelector = createImmutableSelector(
  eventEntitiesSelector,
  events =>
    events
      .filter(Boolean)
      .filterNot(isDeletedFilter)
      .filterNot(isArchivedFilter)
      .map(event => event.get('id'))
      .toList(),
)

export const makeIsArchivedEventSelector = () =>
  createImmutableSelector(eventSelector, isArchivedFilter)

export const makeIsReadEventSelector = () =>
  createImmutableSelector(eventSelector, isReadFilter)

export const makeDenormalizedEventSelector = (n = 1) =>
  createImmutableSelectorCreator(n)(
    eventSelector,
    entitiesSelector,
    (event, entities) => denormalize(event, entities, EventSchema),
  )

export const makeDenormalizedOrderedColumnEventsSelector = () => {
  const columnEventIdsSelector = makeColumnEventIdsSelector()

  return createImmutableSelectorCreator(1)(
    columnEventIdsSelector,
    unarchivedEventIdsSelector,
    entitiesSelector,
    (eventIds, unarchivedEventIds, entities) => {
      const notArchivedIds = Set(eventIds)
        .intersect(unarchivedEventIds)
        .toList()

      return groupSimilarEvents(
        denormalize(notArchivedIds, entities, [EventSchema])
          .filter(Boolean)
          .toList()
          .sort(sortEventsByDate),
      )
    },
  )
}
