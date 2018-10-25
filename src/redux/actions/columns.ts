import { Column } from '../../types'
import { createActionCreatorCreator } from '../../utils/helpers/redux'

export const replaceColumns = createActionCreatorCreator('REPLACE_COLUMNS')<
  Column[]
>()
