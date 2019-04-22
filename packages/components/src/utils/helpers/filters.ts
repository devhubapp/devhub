import _ from 'lodash'

import {
  ActivityColumnFilters,
  BaseColumnFilters,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  getEventMetadata,
  getIssueOrPullRequestSubjectType,
  isEventPrivate,
  isItemRead,
  isNotificationPrivate,
  IssueOrPullRequestColumnFilters,
  mergeSimilarEvents,
  NotificationColumnFilters,
  sortEvents,
  sortIssuesOrPullRequests,
  sortNotifications,
} from '@devhub/core'
import { getEventSubjectType } from './github/events'
import { getNotificationSubjectType } from './github/notifications'

export const filterRecordHasAnyForcedValue = (
  filtersRecord: Record<string, boolean | undefined> | undefined,
) => {
  if (!filtersRecord) return false
  return Object.values(filtersRecord).some(value => typeof value === 'boolean')
}

export const filterRecordWithThisValueCount = (
  filtersRecord: Record<string, boolean | undefined> | undefined,
  valueToCheck: boolean,
): number => {
  if (!filtersRecord) return 0

  return Object.values(filtersRecord).reduce(
    (total, item) => total + (item === valueToCheck ? 1 : 0),
    0,
  )
}

export function itemPassesFilterRecord<
  F extends Record<string, boolean | undefined>
>(filtersRecord: F, value: keyof F, defaultValue: boolean) {
  if (!(filtersRecord && value)) return defaultValue

  const hasForcedFilter = filterRecordHasAnyForcedValue(filtersRecord)
  if (!hasForcedFilter) return defaultValue

  const isFilterStrict =
    hasForcedFilter &&
    filterRecordWithThisValueCount(filtersRecord, defaultValue)

  return filtersRecord[value] === !defaultValue ||
    (filtersRecord[value] !== defaultValue && isFilterStrict)
    ? !defaultValue
    : defaultValue
}

export function getFilterCountMetadata(
  filtersRecord: Record<string, boolean | undefined> | undefined,
  totalCount: number,
  defaultValue: boolean,
): { checked: number; unchecked: number; total: number } {
  if (!filtersRecord) return { checked: 0, unchecked: 0, total: totalCount }

  const keys = Object.keys(filtersRecord)

  const hasForcedFilter = filterRecordHasAnyForcedValue(filtersRecord)
  if (!hasForcedFilter) {
    return {
      checked: defaultValue ? totalCount : 0,
      unchecked: !defaultValue ? totalCount : 0,
      total: totalCount,
    }
  }

  const isFilterStrict =
    hasForcedFilter &&
    filterRecordWithThisValueCount(filtersRecord, defaultValue)

  if (isFilterStrict) {
    return keys.reduce(
      (result, key) => {
        const checked = filtersRecord[key] === defaultValue

        return {
          ...result,
          checked: checked ? result.checked + 1 : result.checked,
          unchecked: !checked ? result.unchecked + 1 : result.unchecked,
        }
      },
      { checked: 0, unchecked: 0, total: totalCount },
    )
  }

  return keys.reduce(
    (result, key) => {
      const checked =
        filtersRecord[key] === !defaultValue ? !defaultValue : defaultValue

      return {
        ...result,
        checked: checked ? result.checked : result.checked - 1,
        unchecked: !checked ? result.unchecked : result.unchecked - 1,
      }
    },
    { checked: totalCount, unchecked: totalCount, total: totalCount },
  )
}

function baseColumnHasAnyFilter(filters: BaseColumnFilters | undefined) {
  if (!filters) return false

  if (filters.clearedAt) return true
  if (typeof filters.private === 'boolean') return true
  if (typeof filters.saved === 'boolean') return true

  if (
    filters.subjectTypes &&
    filterRecordHasAnyForcedValue(filters.subjectTypes)
  ) {
    return true
  }

  if (typeof filters.unread === 'boolean') return true

  return false
}

export function activityColumnHasAnyFilter(
  filters: ActivityColumnFilters | undefined,
) {
  if (!filters) return false

  if (baseColumnHasAnyFilter(filters)) return true

  if (
    filters.activity &&
    filterRecordHasAnyForcedValue(filters.activity.actions)
  ) {
    return true
  }

  return false
}

export function issueOrPullRequestColumnHasAnyFilter(
  filters: IssueOrPullRequestColumnFilters | undefined,
) {
  if (!filters) return false

  if (baseColumnHasAnyFilter(filters)) return true

  return false
}

export function notificationColumnHasAnyFilter(
  filters: NotificationColumnFilters | undefined,
) {
  if (!filters) return false

  if (baseColumnHasAnyFilter(filters)) return true

  if (filters.notifications && filters.notifications.participating) {
    return true
  }

  if (
    filters.notifications &&
    filterRecordHasAnyForcedValue(filters.notifications.reasons)
  ) {
    return true
  }

  return false
}

export function getFilteredIssueOrPullRequests(
  items: EnhancedGitHubIssueOrPullRequest[],
  filters: IssueOrPullRequestColumnFilters | undefined,
) {
  let _items = sortIssuesOrPullRequests(items)

  if (filters && issueOrPullRequestColumnHasAnyFilter(filters)) {
    _items = _items.filter(item => {
      if (
        !itemPassesFilterRecord(
          filters.subjectTypes!,
          getIssueOrPullRequestSubjectType(item)!,
          true,
        )
      )
        return false

      if (
        typeof filters.unread === 'boolean' &&
        filters.unread !== !isItemRead(item)
      ) {
        return false
      }

      const showSaveForLater = filters.saved !== false
      const showInbox = filters.saved !== true
      const showCleared = false

      if (
        filters.clearedAt &&
        (!item.updated_at || item.updated_at <= filters.clearedAt)
      )
        if (!(showSaveForLater && item.saved))
          /* && isItemRead(notification) */
          return showCleared

      if (item.saved) return showSaveForLater

      return showInbox
    })
  }

  return _items
}

export function getFilteredNotifications(
  notifications: EnhancedGitHubNotification[],
  filters: NotificationColumnFilters | undefined,
) {
  let _notifications = sortNotifications(notifications)

  const reasonsFilter =
    filters && filters.notifications && filters.notifications.reasons

  if (filters && notificationColumnHasAnyFilter(filters)) {
    _notifications = _notifications.filter(notification => {
      if (!itemPassesFilterRecord(reasonsFilter!, notification.reason, true))
        return false

      if (
        filters.notifications &&
        filters.notifications.participating &&
        notification.reason === 'subscribed'
      )
        return false

      if (
        !itemPassesFilterRecord(
          filters.subjectTypes!,
          getNotificationSubjectType(notification)!,
          true,
        )
      )
        return false

      if (
        typeof filters.unread === 'boolean' &&
        filters.unread !== !isItemRead(notification)
      ) {
        return false
      }

      if (
        typeof filters.private === 'boolean' &&
        isNotificationPrivate(notification) !== filters.private
      ) {
        return false
      }

      const showSaveForLater = filters.saved !== false
      const showInbox = filters.saved !== true
      const showCleared = false

      if (
        filters.clearedAt &&
        (!notification.updated_at ||
          notification.updated_at <= filters.clearedAt)
      )
        if (!(showSaveForLater && notification.saved))
          /* && isItemRead(notification) */
          return showCleared

      if (notification.saved) return showSaveForLater

      return showInbox
    })
  }

  return _notifications
}

export function getFilteredEvents(
  events: EnhancedGitHubEvent[],
  filters: ActivityColumnFilters | undefined,
  mergeSimilar: boolean,
) {
  let _events = sortEvents(events)

  const actionFilter = filters && filters.activity && filters.activity.actions

  if (filters && activityColumnHasAnyFilter(filters)) {
    _events = _events.filter(event => {
      if (
        !itemPassesFilterRecord(
          actionFilter!,
          getEventMetadata(event).action!,
          true,
        )
      )
        return false

      if (
        !itemPassesFilterRecord(
          filters.subjectTypes!,
          getEventSubjectType(event)!,
          true,
        )
      )
        return false

      if (
        typeof filters.unread === 'boolean' &&
        filters.unread !== !isItemRead(event)
      ) {
        return false
      }

      if (
        typeof filters.private === 'boolean' &&
        isEventPrivate(event) !== filters.private
      ) {
        return false
      }

      const showSaveForLater = filters.saved !== false
      const showInbox = filters.saved !== true
      const showCleared = false

      if (
        filters.clearedAt &&
        (!event.created_at || event.created_at <= filters.clearedAt)
      )
        if (!(showSaveForLater && event.saved))
          /* && isItemRead(event) */
          return showCleared

      if (event.saved) return showSaveForLater

      return showInbox
    })
  }

  return mergeSimilar ? mergeSimilarEvents(_events, mergeMaxLength) : _events
}

export const mergeMaxLength = 5
