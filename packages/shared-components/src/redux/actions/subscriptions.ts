import { createAction } from '../helpers'

export function deleteColumnSubscription(columnId: string) {
  return createAction('DELETE_COLUMN_SUBSCRIPTION', columnId)
}
