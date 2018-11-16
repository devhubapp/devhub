import {
  ColumnAndSubscriptions,
  ColumnFilters,
  GitHubEvent,
  GitHubNotificationReason,
} from '../../types'
import {
  createAction,
  createActionCreatorCreator,
} from '../../utils/helpers/redux'

export const replaceColumns = createActionCreatorCreator('REPLACE_COLUMNS')<
  ColumnAndSubscriptions[]
>()

export const addColumn = createActionCreatorCreator('ADD_COLUMN')<
  ColumnAndSubscriptions
>()

export const deleteColumn = createActionCreatorCreator('DELETE_COLUMN')<
  string
>()

export const moveColumn = createActionCreatorCreator('MOVE_COLUMN')<{
  columnId: string
  columnIndex: number
}>()

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
