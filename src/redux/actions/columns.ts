import { Column } from '../../types'
import { createActionCreatorCreator } from '../../utils/helpers/redux'

export const addColumn = createActionCreatorCreator('ADD_COLUMN')<Column>()

export const deleteColumn = createActionCreatorCreator('DELETE_COLUMN')<
  string
>()

export const replaceColumns = createActionCreatorCreator('REPLACE_COLUMNS')<
  Column[]
>()
