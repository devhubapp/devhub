import { createAction } from '../helpers'

export function cleanupArchivedItems() {
  return createAction('CLEANUP_ARCHIVED_ITEMS')
}
