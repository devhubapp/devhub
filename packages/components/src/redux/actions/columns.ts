import {
  ColumnAndSubscriptions,
  ColumnFilters,
  ColumnsAndSubscriptions,
  ColumnSubscriptionCreation,
  GitHubEvent,
  GitHubNotificationReason,
  NotificationColumnFilters,
} from '@devhub/core'
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

export function moveColumn(payload: { columnId: string; columnIndex: number }) {
  return createAction('MOVE_COLUMN', payload)
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

export function setColumnActivityTypeFilter<
  T extends GitHubEvent['type']
>(payload: { columnId: string; type: T; value: boolean | null }) {
  return createAction('SET_COLUMN_ACTIVITY_TYPE_FILTER', payload)
}

export function setColumnReasonFilter<
  T extends GitHubNotificationReason
>(payload: { columnId: string; reason: T; value: boolean | null }) {
  return createAction('SET_COLUMN_REASON_FILTER', payload)
}

export function setColumnUnreadFilter(payload: {
  columnId: string
  unread: NotificationColumnFilters['unread']
}) {
  return createAction('SET_COLUMN_UNREAD_FILTER', payload)
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
