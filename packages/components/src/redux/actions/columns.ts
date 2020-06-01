import {
  ColumnAndSubscriptions,
  ColumnFilters,
  ColumnOptions,
  ColumnsAndSubscriptions,
  ColumnSubscriptionCreation,
  EnhancedGitHubNotification,
  GitHubEventAction,
  GitHubEventSubjectType,
  GitHubIssueOrPullRequestSubjectType,
  GitHubNotificationSubjectType,
  GitHubStateType,
  NotificationColumnFilters,
} from '@devhub/core'
import { EmitterTypes } from '../../libs/emitter'
import { createAction } from '../helpers'

export function replaceColumnsAndSubscriptions(
  payload: ColumnsAndSubscriptions,
) {
  return createAction('REPLACE_COLUMNS_AND_SUBSCRIPTIONS', payload)
}

export function addColumnAndSubscriptions(payload: ColumnAndSubscriptions) {
  return createAction('ADD_COLUMN_AND_SUBSCRIPTIONS', payload)
}

export function addColumnSubscription(payload: {
  columnId: string
  subscription: ColumnSubscriptionCreation
}) {
  return createAction('ADD_COLUMN_SUBSCRIPTION', payload)
}

export function removeSubscriptionFromColumn(payload: {
  columnId: string
  subscriptionId: string
}) {
  return createAction('REMOVE_SUBSCRIPTION_FROM_COLUMN', payload)
}

export function deleteColumn(payload: {
  columnId: string
  columnIndex: number
}) {
  return createAction('DELETE_COLUMN', payload)
}

export function moveColumn(
  payload: {
    columnId: string
    columnIndex: number
  } & Omit<EmitterTypes['FOCUS_ON_COLUMN'], 'focusOnVisibleItem'>,
) {
  return createAction('MOVE_COLUMN', payload)
}

export function setColumnOption<O extends keyof ColumnOptions>(payload: {
  columnId: string
  option: O
  value: ColumnOptions[O] | null
}) {
  return createAction('SET_COLUMN_OPTION', payload)
}

export function clearColumnFilters(payload: { columnId: string }) {
  return createAction('CLEAR_COLUMN_FILTERS', payload)
}

export function replaceColumnFilters(payload: {
  columnId: string
  filters: ColumnFilters
}) {
  return createAction('REPLACE_COLUMN_FILTERS', payload)
}

export function setColumnSavedFilter(payload: {
  columnId: string
  saved?: boolean | null
}) {
  return createAction('SET_COLUMN_SAVED_FILTER', payload)
}

export function setColumnParticipatingFilter(payload: {
  columnId: string
  participating: boolean
}) {
  return createAction('SET_COLUMN_PARTICIPATING_FILTER', payload)
}

export function setColumnActivityActionFilter<
  T extends GitHubEventAction
>(payload: { columnId: string; type: T; value: boolean | null }) {
  return createAction('SET_COLUMN_ACTIVITY_ACTION_FILTER', payload)
}

export function setColumnLabelFilter(payload: {
  columnId: string
  label: string
  value: boolean | null
  removeIfAlreadySet?: boolean
  removeOthers?: boolean
}) {
  return createAction('SET_COLUMN_LABEL_FILTER', payload)
}

export function setColumnReasonFilter<
  T extends EnhancedGitHubNotification['reason']
>(payload: {
  columnId: string
  reason: T
  value: boolean | null
  removeIfAlreadySet?: boolean
  removeOthers?: boolean
}) {
  return createAction('SET_COLUMN_REASON_FILTER', payload)
}

export function setColummStateTypeFilter<T extends GitHubStateType>(payload: {
  columnId: string
  state: T
  value: boolean | null
  supportsOnlyOne?: boolean
}) {
  return createAction('SET_COLUMN_STATE_FILTER', payload)
}

export function setColummBotFilter(payload: {
  columnId: string
  bot: ColumnFilters['bot']
}) {
  return createAction('SET_COLUMN_BOT_FILTER', payload)
}

export function setColummDraftFilter(payload: {
  columnId: string
  draft: ColumnFilters['draft']
}) {
  return createAction('SET_COLUMN_DRAFT_FILTER', payload)
}

export function setColummSubjectTypeFilter<
  T extends
    | GitHubEventSubjectType
    | GitHubNotificationSubjectType
    | GitHubIssueOrPullRequestSubjectType
>(payload: { columnId: string; subjectType: T; value: boolean | null }) {
  return createAction('SET_COLUMN_SUBJECT_TYPE_FILTER', payload)
}

export function setColumnUnreadFilter(payload: {
  columnId: string
  unread: NotificationColumnFilters['unread']
}) {
  return createAction('SET_COLUMN_UNREAD_FILTER', payload)
}

export function setColumnInvolvesFilter(payload: {
  columnId: string
  user: string
  value: boolean | null
}) {
  return createAction('SET_COLUMN_INVOLVES_FILTER', payload)
}

export function replaceColumnWatchingFilter(payload: {
  columnId: string
  owner: string | null
}) {
  return createAction('REPLACE_COLUMN_WATCHING_FILTER', payload)
}

export function setColumnWatchingFilter(payload: {
  columnId: string
  owner: string
  value: boolean | null
}) {
  return createAction('SET_COLUMN_WATCHING_FILTER', payload)
}

export function replaceColumnOwnerFilter(payload: {
  columnId: string
  owner: string | null
}) {
  return createAction('REPLACE_COLUMN_OWNER_FILTER', payload)
}

export function setColumnOwnerFilter(payload: {
  columnId: string
  owner: string
  value: boolean | null
}) {
  return createAction('SET_COLUMN_OWNER_FILTER', payload)
}

export function setColumnRepoFilter(payload: {
  columnId: string
  owner: string
  repo: string
  value: boolean | null
}) {
  return createAction('SET_COLUMN_REPO_FILTER', payload)
}

export function setColumnPrivacyFilter(payload: {
  columnId: string
  private: ColumnFilters['private']
}) {
  return createAction('SET_COLUMN_PRIVACY_FILTER', payload)
}

export function setColumnClearedAtFilter(payload: {
  columnId: string
  clearedAt: string | null
}) {
  return createAction('SET_COLUMN_CLEARED_AT_FILTER', payload)
}

export function clearAllColumnsWithConfirmation(
  payload: { clearedAt?: string | null } = {},
) {
  return createAction('CLEAR_ALL_COLUMNS_WITH_CONFIRMATION', payload)
}

export function clearAllColumns(payload: { clearedAt?: string | null } = {}) {
  return createAction('CLEAR_ALL_COLUMNS', payload)
}

export function changeIssueNumberFilter(payload: {
  columnId: string
  issueNumber: number
  value: boolean | null
  removeIfAlreadySet?: boolean
  removeOthers?: boolean
}) {
  return createAction('CHANGE_ISSUE_NUMBER_FILTER', payload)
}
