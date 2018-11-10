import { createActionCreatorCreator } from '../../utils/helpers/redux'

export const deleteColumnSubscription = createActionCreatorCreator(
  'DELETE_COLUMN_SUBSCRIPTION',
)<string>()
