import { createAction } from '../../utils/helpers/redux'

export function deleteColumnSubscription(columnId: string) {
  return createAction('DELETE_COLUMN_SUBSCRIPTION', columnId)
}
