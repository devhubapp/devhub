import _ from 'lodash'

import { Theme, ThemeColors } from '@devhub/core'

export const themeColorFields: Array<keyof ThemeColors> = [
  'backgroundColor',
  'backgroundColorDarker1',
  'backgroundColorDarker2',
  'backgroundColorDarker3',
  'backgroundColorLess1',
  'backgroundColorLess2',
  'backgroundColorLess3',
  'backgroundColorLighther1',
  'backgroundColorLighther2',
  'backgroundColorLighther3',
  'backgroundColorMore1',
  'backgroundColorMore2',
  'backgroundColorMore3',
  'backgroundColorTransparent10',
  'foregroundColor',
  'foregroundColorMuted50',
]

export const pickThemeColors = (theme: Theme) => _.pick(theme, themeColorFields)
