import { createActionCreatorCreator } from '../../utils/helpers/redux'

import { ThemePair } from '../../types'

export const setTheme = createActionCreatorCreator('SET_THEME')<{
  id: ThemePair['id']
  color?: ThemePair['color']
}>()
