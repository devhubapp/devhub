import _ from 'lodash'
import {
  ActivityColumnFilters,
  BaseColumnFilters,
  Column,
  ColumnFilters,
  ColumnSubscription,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedItem,
  IssueOrPullRequestColumnFilters,
  NotificationColumnFilters,
} from '../types'
import {
  getIssueOrPullRequestState,
  getIssueOrPullRequestSubjectType,
  getItemIssueOrPullRequest,
  getItemOwnersAndRepos,
  getItemSearchableStrings,
  getNotificationSubjectType,
  isDraft,
  isItemRead,
  sortIssuesOrPullRequests,
  sortNotifications,
} from './github'
import {
  getEventMetadata,
  mergeSimilarEvents,
  sortEvents,
} from './github/events'
import {
  getSearchQueryTerms,
  isEventPrivate,
  isNotificationPrivate,
} from './shared'

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

export function getOwnerAndRepoFormattedFilter(
  filters: BaseColumnFilters | undefined,
) {
  const ownerFiltersWithRepos = (filters && filters.owners) || {}
  const ownerFilters = _.mapValues(
    ownerFiltersWithRepos,
    obj => obj && obj.value,
  )
  const repoFilters: typeof ownerFilters = {}

  if (ownerFiltersWithRepos) {
    Object.keys(ownerFiltersWithRepos).forEach(owner => {
      if (
        !(ownerFiltersWithRepos[owner] && ownerFiltersWithRepos[owner]!.repos)
      )
        return

      Object.entries(
        (ownerFiltersWithRepos[owner] && ownerFiltersWithRepos[owner]!.repos) ||
          {},
      ).forEach(([repo, value]) => {
        const repoFullName = `${owner}/${repo}`.toLowerCase()
        repoFilters[repoFullName] = value
      })
    })
  }

  const ownerFilterIsStrict = !!(
    ownerFilters && filterRecordWithThisValueCount(ownerFilters, true)
  )

  const repoFilterIsStrict = !!(
    repoFilters && filterRecordWithThisValueCount(repoFilters, true)
  )

  const allForcedRepos = _.sortBy(
    Object.keys(repoFilters)
      .filter(repoFullName => typeof repoFilters[repoFullName] === 'boolean')
      .map(repoFullName => repoFullName.toLowerCase()),
  )

  const allForcedOwners = _.sortBy(
    Object.keys(ownerFiltersWithRepos)
      .filter(
        ownerFilterWithRepo =>
          !!ownerFiltersWithRepos[ownerFilterWithRepo] &&
          (typeof ownerFiltersWithRepos[ownerFilterWithRepo]!.value ===
            'boolean' ||
            filterRecordHasAnyForcedValue(
              ownerFiltersWithRepos[ownerFilterWithRepo]!.repos,
            )),
      )
      .map(owner => owner.toLowerCase()),
  )

  const allIncludedRepos = _.sortBy(
    Object.keys(repoFilters)
      .filter(repoFullName => repoFilters[repoFullName] === true)
      .map(repoFullName => repoFullName.toLowerCase()),
  )

  const allIncludedOwners = _.sortBy(
    Object.keys(ownerFiltersWithRepos)
      .filter(
        ownerFilterWithRepo =>
          !!ownerFiltersWithRepos[ownerFilterWithRepo] &&
          (ownerFiltersWithRepos[ownerFilterWithRepo]!.value === true ||
            filterRecordWithThisValueCount(
              ownerFiltersWithRepos[ownerFilterWithRepo]!.repos,
              true,
            )),
      )
      .map(owner => owner.toLowerCase()),
  )

  return {
    allForcedOwners,
    allForcedRepos,
    allIncludedOwners,
    allIncludedRepos,
    ownerFilterIsStrict,
    ownerFilters,
    ownerFiltersWithRepos,
    repoFilterIsStrict,
    repoFilters,
  }
}

export function itemPassesOwnerOrRepoFilter(
  type: ColumnSubscription['type'],
  item: EnhancedItem,
  ownerAndRepoFormattedFilter: ReturnType<
    typeof getOwnerAndRepoFormattedFilter
  >,
) {
  const {
    ownerFilterIsStrict,
    ownerFilters,
    ownerFiltersWithRepos,
    repoFilterIsStrict,
    repoFilters,
  } = ownerAndRepoFormattedFilter

  if (
    ownerFilters &&
    ownerFiltersWithRepos &&
    repoFilters &&
    !getItemOwnersAndRepos(type, item).every(or => {
      const thisOwnerRepoFilters =
        ownerFiltersWithRepos &&
        ownerFiltersWithRepos[or.owner] &&
        ownerFiltersWithRepos[or.owner]!.repos
      const thisOwnerRepoFilterIsStrict =
        thisOwnerRepoFilters &&
        filterRecordWithThisValueCount(thisOwnerRepoFilters, true)

      const ownerIsChecked =
        ownerFilters[or.owner] === true ||
        (ownerFilters[or.owner] !== false &&
          ((!ownerFilterIsStrict && !repoFilterIsStrict) ||
            thisOwnerRepoFilterIsStrict))
      if (!ownerIsChecked) return false

      if (!thisOwnerRepoFilters) return true

      const repoIsChecked =
        thisOwnerRepoFilters[or.repo] === true ||
        (thisOwnerRepoFilters[or.repo] !== false &&
          !thisOwnerRepoFilterIsStrict)
      return !!repoIsChecked
    })
  )
    return false

  return true
}

export function itemPassesStringSearchFilter(
  type: ColumnSubscription['type'],
  item: EnhancedItem,
  query: string | undefined,
) {
  const itemStrings = getItemSearchableStrings(type, item)
  const termsToSearchFor = getSearchQueryTerms(query)

  if (!(termsToSearchFor && termsToSearchFor.length)) return true
  if (!(itemStrings && itemStrings.length)) return true

  return termsToSearchFor.every(termArr => {
    if (
      !(
        termArr &&
        Array.isArray(termArr) &&
        (termArr.length === 2 || termArr.length === 3)
      )
    )
      return true

    const [key, value, isNegated] =
      termArr.length === 2 ? ['', termArr[0], termArr[1]] : termArr
    if (!(value && typeof value === 'string')) return false

    let searchTerm = key ? `${key}:${value}` : value
    if (searchTerm[0] === '"' && searchTerm.slice(-1) === '"') {
      searchTerm = searchTerm.slice(1, -1).trim()
      if (!searchTerm) return false
    }

    const found = itemStrings.some(itemString => {
      if (!(itemString && typeof itemString === 'string')) return false

      return itemString.toLowerCase().includes(searchTerm.toLowerCase())
    })

    return isNegated ? !found : found
  })
}

function baseColumnHasAnyFilter(filters: BaseColumnFilters | undefined) {
  if (!filters) return false

  if (filters.clearedAt) return true
  if (typeof filters.private === 'boolean') return true
  if (typeof filters.saved === 'boolean') return true
  if (typeof filters.draft === 'boolean') return true
  if (typeof filters.unread === 'boolean') return true
  if (filters.query) return true

  if (filters.state && filterRecordHasAnyForcedValue(filters.state)) {
    return true
  }

  if (
    filters.subjectTypes &&
    filterRecordHasAnyForcedValue(filters.subjectTypes)
  ) {
    return true
  }

  const { ownerFilters, repoFilters } = getOwnerAndRepoFormattedFilter(filters)
  if (ownerFilters && filterRecordHasAnyForcedValue(ownerFilters)) {
    return true
  }
  if (repoFilters && filterRecordHasAnyForcedValue(repoFilters)) {
    return true
  }

  return false
}

export function columnHasAnyFilter(
  type: Column['type'],
  filters: ColumnFilters | undefined,
) {
  if (!filters) return false

  if (baseColumnHasAnyFilter(filters)) return true

  if (type === 'activity') {
    const f = filters as ActivityColumnFilters
    if (f.activity && filterRecordHasAnyForcedValue(f.activity.actions)) {
      return true
    }
  }

  if (type === 'notifications') {
    const f = filters as NotificationColumnFilters

    if (f.notifications && f.notifications.participating) {
      return true
    }

    if (
      f.notifications &&
      filterRecordHasAnyForcedValue(f.notifications.reasons)
    ) {
      return true
    }
  }

  return false
}

export function getFilteredIssueOrPullRequests(
  items: EnhancedGitHubIssueOrPullRequest[],
  filters: IssueOrPullRequestColumnFilters | undefined,
) {
  let _items = sortIssuesOrPullRequests(items)

  const ownerAndRepoFormattedFilter = getOwnerAndRepoFormattedFilter(filters)

  if (filters && columnHasAnyFilter('issue_or_pr', filters)) {
    _items = _items.filter(item => {
      const subjectType = getIssueOrPullRequestSubjectType(item)
      const issueOrPR = getItemIssueOrPullRequest('issue_or_pr', item)

      if (
        !itemPassesOwnerOrRepoFilter(
          'issue_or_pr',
          item,
          ownerAndRepoFormattedFilter,
        )
      )
        return false

      // since we call github's search endpoint,
      // let's let they handle this filter since they also consider all comments and other stuff
      // if (!itemPassesStringSearchFilter('issue_or_pr', item, filters.query))
      //   return false

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

  const ownerAndRepoFormattedFilter = getOwnerAndRepoFormattedFilter(filters)

  if (filters && columnHasAnyFilter('notifications', filters)) {
    _notifications = _notifications.filter(item => {
      const subjectType = getNotificationSubjectType(item)
      const issueOrPR = getItemIssueOrPullRequest('notifications', item)

      if (!itemPassesFilterRecord(reasonsFilter!, item.reason, true))
        return false

      if (
        !itemPassesOwnerOrRepoFilter(
          'notifications',
          item,
          ownerAndRepoFormattedFilter,
        )
      )
        return false

      if (!itemPassesStringSearchFilter('notifications', item, filters.query))
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
  {
    mergeSimilar,
  }: {
    mergeSimilar: boolean
  },
) {
  let _events = sortEvents(events)

  const actionFilter = filters && filters.activity && filters.activity.actions

  const ownerAndRepoFormattedFilter = getOwnerAndRepoFormattedFilter(filters)

  if (filters && columnHasAnyFilter('activity', filters)) {
    _events = _events.filter(item => {
      const subjectType = getEventMetadata(item).subjectType
      const issueOrPR = getItemIssueOrPullRequest('activity', item)

      if (
        !itemPassesOwnerOrRepoFilter(
          'activity',
          item,
          ownerAndRepoFormattedFilter,
        )
      )
        return false

      if (!itemPassesStringSearchFilter('activity', item, filters.query))
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
