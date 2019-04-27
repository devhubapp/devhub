import _ from 'lodash'
import {
  ActivityColumnFilters,
  BaseColumnFilters,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  IssueOrPullRequestColumnFilters,
  NotificationColumnFilters,
} from '../types'
import {
  getIssueOrPullRequestState,
  getIssueOrPullRequestSubjectType,
  getNotificationSubjectType,
  isDraft,
  isItemRead,
  sortIssuesOrPullRequests,
  sortNotifications,
} from './github'
import {
  getEventMetadata,
  getEventSubjectType,
  mergeSimilarEvents,
  sortEvents,
} from './github/events'
import { isEventPrivate, isNotificationPrivate } from './shared'

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
  if (typeof filters.draft === 'boolean') return true
  if (typeof filters.unread === 'boolean') return true

  if (filters.state && filterRecordHasAnyForcedValue(filters.state)) {
    return true
  }

  if (
    filters.subjectTypes &&
    filterRecordHasAnyForcedValue(filters.subjectTypes)
  ) {
    return true
  }

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
      const subjectType = getIssueOrPullRequestSubjectType(item)
      const issueOrPR =
        subjectType === 'Issue' || subjectType === 'PullRequest'
          ? item
          : undefined

      const isStateFilterStrict = filterRecordWithThisValueCount(
        filters.state,
        true,
      )
      if (
        (isStateFilterStrict &&
          (!issueOrPR ||
            !itemPassesFilterRecord(
              filters.state!,
              getIssueOrPullRequestState(issueOrPR)!,
              true,
            ))) ||
        (!isStateFilterStrict &&
          issueOrPR &&
          !itemPassesFilterRecord(
            filters.state!,
            getIssueOrPullRequestState(issueOrPR)!,
            true,
          ))
      )
        return false

      if (
        (filters.draft === true &&
          (!issueOrPR || filters.draft !== isDraft(issueOrPR))) ||
        (filters.draft === false &&
          issueOrPR &&
          filters.draft !== isDraft(issueOrPR))
      )
        return false

      if (!itemPassesFilterRecord(filters.subjectTypes!, subjectType!, true))
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
    _notifications = _notifications.filter(item => {
      const subjectType = getNotificationSubjectType(item)
      const issueOrPR =
        subjectType === 'Issue' || subjectType === 'PullRequest'
          ? item.issue || item.pullRequest
          : undefined

      if (!itemPassesFilterRecord(reasonsFilter!, item.reason, true))
        return false

      if (
        filters.notifications &&
        filters.notifications.participating &&
        item.reason === 'subscribed'
      )
        return false

      const isStateFilterStrict = filterRecordWithThisValueCount(
        filters.state,
        true,
      )
      if (
        (isStateFilterStrict &&
          (!issueOrPR ||
            !itemPassesFilterRecord(
              filters.state!,
              getIssueOrPullRequestState(issueOrPR)!,
              true,
            ))) ||
        (!isStateFilterStrict &&
          issueOrPR &&
          !itemPassesFilterRecord(
            filters.state!,
            getIssueOrPullRequestState(issueOrPR)!,
            true,
          ))
      )
        return false

      if (
        (filters.draft === true &&
          (!issueOrPR || filters.draft !== isDraft(issueOrPR))) ||
        (filters.draft === false &&
          issueOrPR &&
          filters.draft !== isDraft(issueOrPR))
      )
        return false

      if (!itemPassesFilterRecord(filters.subjectTypes!, subjectType!, true))
        return false

      if (
        typeof filters.unread === 'boolean' &&
        filters.unread !== !isItemRead(item)
      ) {
        return false
      }

      if (
        typeof filters.private === 'boolean' &&
        isNotificationPrivate(item) !== filters.private
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
    _events = _events.filter(item => {
      const subjectType = getEventSubjectType(item)

      const issueOrPR =
        item &&
        item.payload &&
        ('issue' in item.payload
          ? item.payload.issue
          : 'pull_request' in item.payload
          ? item.payload.pull_request
          : undefined)

      const isStateFilterStrict = filterRecordWithThisValueCount(
        filters.state,
        true,
      )
      if (
        (isStateFilterStrict &&
          (!issueOrPR ||
            !itemPassesFilterRecord(
              filters.state!,
              getIssueOrPullRequestState(issueOrPR)!,
              true,
            ))) ||
        (!isStateFilterStrict &&
          issueOrPR &&
          !itemPassesFilterRecord(
            filters.state!,
            getIssueOrPullRequestState(issueOrPR)!,
            true,
          ))
      )
        return false

      if (
        (filters.draft === true &&
          (!issueOrPR || filters.draft !== isDraft(issueOrPR))) ||
        (filters.draft === false &&
          issueOrPR &&
          filters.draft !== isDraft(issueOrPR))
      )
        return false

      if (!itemPassesFilterRecord(filters.subjectTypes!, subjectType!, true))
        return false

      if (
        !itemPassesFilterRecord(
          actionFilter!,
          getEventMetadata(item).action!,
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

      if (
        typeof filters.private === 'boolean' &&
        isEventPrivate(item) !== filters.private
      ) {
        return false
      }

      const showSaveForLater = filters.saved !== false
      const showInbox = filters.saved !== true
      const showCleared = false

      if (
        filters.clearedAt &&
        (!item.created_at || item.created_at <= filters.clearedAt)
      )
        if (!(showSaveForLater && item.saved))
          /* && isItemRead(event) */
          return showCleared

      if (item.saved) return showSaveForLater

      return showInbox
    })
  }

  return mergeSimilar ? mergeSimilarEvents(_events, mergeMaxLength) : _events
}

export const mergeMaxLength = 5
