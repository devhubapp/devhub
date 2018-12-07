import _ from 'lodash'

import {
  ActivityColumnFilters,
  EnhancedGitHubEvent,
  EnhancedGitHubNotification,
  isEventPrivate,
  isNotificationPrivate,
  mergeSimilarEvents,
  NotificationColumnFilters,
} from '@devhub/core'

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

export function activityColumnHasAnyFilter(
  filters: ActivityColumnFilters | undefined,
) {
  if (!filters) return false

  if (typeof filters.private === 'boolean' || filters.clearedAt) return true

  if (filters.inbox) {
    return filterRecordHasAnyForcedValue(filters.inbox)
  }

  if (filters.activity) {
    return filterRecordHasAnyForcedValue(filters.activity.types)
  }

  return false
}

export function notificationColumnHasAnyFilter(
  filters: NotificationColumnFilters | undefined,
) {
  if (!filters) return false

  if (typeof filters.private === 'boolean' || filters.clearedAt) return true
  if (typeof filters.unread === 'boolean') return true

  if (filters.inbox) {
    return filterRecordHasAnyForcedValue(filters.inbox)
  }

  if (filters.notifications) {
    return filterRecordHasAnyForcedValue(filters.notifications.reasons)
  }

  return false
}

export function getFilteredNotifications(
  notifications: EnhancedGitHubNotification[],
  filters?: NotificationColumnFilters,
) {
  let _notifications = _(notifications)
    .uniqBy('id')
    .orderBy(['unread', 'updated_at', 'created_at'], ['desc', 'desc', 'desc'])
    .value()

  const reasonsFilter =
    filters && filters.notifications && filters.notifications.reasons

  const inboxFilter = (filters && filters.inbox) || {}

  if (filters && notificationColumnHasAnyFilter(filters)) {
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

      const showInbox = inboxFilter.inbox !== false
      const showSaveForLater = inboxFilter.saved !== false
      const showCleared = inboxFilter.archived === true

      if (
        filters.clearedAt &&
        (!notification.updated_at ||
          notification.updated_at <= filters.clearedAt)
      )
        if (!notification.unread && !(showSaveForLater && notification.saved))
          return showCleared

      if (notification.saved) return showSaveForLater

      return showInbox
    })
  }

  return _notifications
}

export function getFilteredEvents(
  events: EnhancedGitHubEvent[],
  filters?: ActivityColumnFilters,
) {
  let _events = _(events)
    .uniqBy('id')
    .orderBy(['updated_at', 'created_at'], ['desc', 'desc'])
    .value()

  const activityFilter = filters && filters.activity && filters.activity.types
  const inboxFilter = (filters && filters.inbox) || {}

  if (filters && activityColumnHasAnyFilter(filters)) {
    _events = _events.filter(event => {
      if (!itemPassesFilterRecord(activityFilter, event.type, true))
        return false

      if (
        typeof filters.private === 'boolean' &&
        isEventPrivate(event) !== filters.private
      ) {
        return false
      }

      const showInbox = inboxFilter.inbox !== false
      const showSaveForLater = inboxFilter.saved !== false
      const showCleared = inboxFilter.archived === true

      if (
        filters.clearedAt &&
        (!event.created_at || event.created_at <= filters.clearedAt)
      )
        if (!(showSaveForLater && event.saved) /* && !event.unread */)
          return showCleared

      if (event.saved) return showSaveForLater

      return showInbox
    })
  }

  return mergeSimilarEvents(_events)
}
