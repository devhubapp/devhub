import { createAction } from 'shared-core/dist/utils/helpers/redux'

export function deleteColumnSubscription(columnId: string) {
  return createAction('DELETE_COLUMN_SUBSCRIPTION', columnId)
}
