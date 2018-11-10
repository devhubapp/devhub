import { ColumnSubscription, Omit } from '../../types'
import { createActionCreatorCreator } from '../../utils/helpers/redux'

export const addColumnSubscription = createActionCreatorCreator(
  'ADD_COLUMN_SUBSCRIPTION',
)<Omit<ColumnSubscription, 'id' | 'createdAt' | 'updatedAt'>>()

export const deleteColumnSubscription = createActionCreatorCreator(
  'DELETE_COLUMN_SUBSCRIPTION',
)<string>()
