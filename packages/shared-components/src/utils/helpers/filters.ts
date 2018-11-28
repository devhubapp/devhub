import _ from 'lodash'

import {
  ActivityColumnFilters,
  GitHubEvent,
  GitHubNotification,
  NotificationColumnFilters,
} from 'shared-core/dist/types'
import { mergeSimilarEvents } from 'shared-core/dist/utils/helpers/github/events'
import {
  isEventPrivate,
  isNotificationPrivate,
} from 'shared-core/dist/utils/helpers/shared'

export const filterRecordHasAnyForcedValue = (
  filtersRecord: Record<string, boolean | undefined> | undefined,
) => {
  if (!filtersRecord) return false
  return Object.values(filtersRecord).some(value => typeof value === 'boolean')
}

export const filterRecordHasThisValue = (
  filtersRecord: Record<string, boolean | undefined> | undefined,
  valueToCheck: boolean,
) => {
  if (!filtersRecord) return false
  return Object.values(filtersRecord).some(value => value === valueToCheck)
}

export function itemPassesFilterRecord(
  filtersRecord: Record<string, boolean | undefined> | undefined,
  value: any,
  defaultValue: boolean,
) {
  if (!filtersRecord) return defaultValue

  const hasForcedFilter = filterRecordHasAnyForcedValue(filtersRecord)
  if (!hasForcedFilter) return defaultValue

  const isFilterStrict =
    hasForcedFilter && filterRecordHasThisValue(filtersRecord, defaultValue)

  return filtersRecord[value] === !defaultValue ||
    (filtersRecord[value] !== defaultValue && isFilterStrict)
    ? !defaultValue
    : defaultValue
}

export function getFilteredNotifications(
  notifications: GitHubNotification[],
  filters?: NotificationColumnFilters,
) {
  let _notifications = _(notifications)
    .uniqBy('id')
    .orderBy(['unread', 'updated_at', 'created_at'], ['desc', 'desc', 'desc'])
    .value()

  const reasonsFilter =
    filters && filters.notifications && filters.notifications.reasons

  const hasFilter =
    filters &&
    (filterRecordHasAnyForcedValue(reasonsFilter) ||
      typeof filters.unread === 'boolean' ||
      typeof filters.private === 'boolean' ||
      filters.clearedAt)

  if (hasFilter && filters) {
    _notifications = _notifications.filter(notification => {
      if (!itemPassesFilterRecord(reasonsFilter, notification.reason, true))
        return false

      if (
        typeof filters.unread === 'boolean' &&
        filters.unread !== !!notification.unread
      ) {
        return false
      }

      if (
        typeof filters.private === 'boolean' &&
        isNotificationPrivate(notification) !== filters.private
      ) {
        return false
      }

      if (
        filters.clearedAt &&
        notification.unread !== true &&
        (!notification.updated_at ||
          notification.updated_at < filters.clearedAt)
      ) {
        return false
      }

      return true
    })
  }

  return _notifications
}
export function getFilteredEvents(
  events: GitHubEvent[],
  filters?: ActivityColumnFilters,
) {
  let _events = _(events)
    .uniqBy('id')
    .orderBy(['updated_at', 'created_at'], ['desc', 'desc'])
    .value()

  const activityFilter = filters && filters.activity && filters.activity.types
  const hasFilter =
    filters &&
    (filterRecordHasAnyForcedValue(activityFilter) ||
      typeof filters.private === 'boolean' ||
      filters.clearedAt)

  if (hasFilter && filters) {
    _events = _events.filter(event => {
      if (!itemPassesFilterRecord(activityFilter, event.type, true))
        return false

      if (
        typeof filters.private === 'boolean' &&
        isEventPrivate(event) !== filters.private
      ) {
        return false
      }

      if (
        filters.clearedAt &&
        (!event.created_at || event.created_at < filters.clearedAt)
      ) {
        return false
      }

      return true
    })
  }

  return mergeSimilarEvents(_events)
}
