import {
  ColumnAndSubscriptions,
  ColumnFilters,
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
