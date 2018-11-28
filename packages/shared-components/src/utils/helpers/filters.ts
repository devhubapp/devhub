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

export function getFilteredNotifications(
  notifications: GitHubNotification[],
  filters?: NotificationColumnFilters,
) {
  let _notifications = _(notifications)
    .uniqBy('id')
    .orderBy(['unread', 'updated_at', 'created_at'], ['desc', 'desc', 'desc'])
    .value()

  if (!filters) return _notifications

  const hasFilter =
    (filters.notifications &&
      filters.notifications.reasons &&
      Object.values(filters.notifications.reasons).some(v => !v)) ||
    typeof filters.unread === 'boolean' ||
    typeof filters.private === 'boolean' ||
    typeof filters.clearedAt

  if (hasFilter) {
    _notifications = _notifications.filter(notification => {
      if (
        filters.notifications &&
        filters.notifications.reasons &&
        filters.notifications.reasons[notification.reason] === false
      ) {
        return false
      }

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

  const hasFilter =
    filters &&
    ((filters.activity &&
      filters.activity.types &&
      Object.values(filters.activity.types).some(v => !v)) ||
      typeof filters.private === 'boolean' ||
      filters.clearedAt)

  if (hasFilter && filters) {
    _events = _events.filter(event => {
      if (
        filters.activity &&
        filters.activity.types &&
        filters.activity.types[event.type] === false
      ) {
        return false
      }

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
