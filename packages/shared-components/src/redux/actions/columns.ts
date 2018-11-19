import {
  ColumnAndSubscriptions,
  ColumnFilters,
  GitHubEvent,
  GitHubNotificationReason,
} from 'shared-core/dist/types'
import { createAction } from 'shared-core/dist/utils/helpers/redux'

export function replaceColumns(payload: ColumnAndSubscriptions[]) {
  return createAction('REPLACE_COLUMNS', payload)
}

export function addColumn(payload: ColumnAndSubscriptions) {
  return createAction('ADD_COLUMN', payload)
}

export function deleteColumn(columnId: string) {
  return createAction('DELETE_COLUMN', columnId)
}

export function moveColumn(payload: { columnId: string; columnIndex: number }) {
  return createAction('MOVE_COLUMN', payload)
}

export function setColumnActivityTypeFilter<
  T extends GitHubEvent['type']
>(payload: { columnId: string; type: T; value: boolean }) {
  return createAction('SET_COLUMN_ACTIVITY_TYPE_FILTER', payload)
}

export function setColumnReasonFilter<
  T extends GitHubNotificationReason
>(payload: { columnId: string; reason: T; value: boolean }) {
  return createAction('SET_COLUMN_REASON_FILTER', payload)
}

export function setColumnUnreadFilter(payload: {
  columnId: string
  unread: ColumnFilters['unread']
}) {
  return createAction('SET_COLUMN_UNREAD_FILTER', payload)
}

export function setColumnPrivacyFilter(payload: {
  columnId: string
  private: ColumnFilters['private']
}) {
  return createAction('SET_COLUMN_PRIVACY_FILTER', payload)
}
