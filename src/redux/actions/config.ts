import { createActionCreatorCreator } from '../../utils/helpers/redux'

import { ThemePair } from '../../types'

export const setTheme = createActionCreatorCreator('SET_THEME')<{
  name: ThemePair['name']
  color?: ThemePair['color']
}>()
