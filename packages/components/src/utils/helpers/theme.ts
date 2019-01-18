import _ from 'lodash'

import { Theme, ThemeColors } from '@devhub/core'

export const themeColorFields: Array<keyof ThemeColors> = [
  'backgroundColor',
  'backgroundColorDarker08',
  'backgroundColorDarker16',
  'backgroundColorLess08',
  'backgroundColorLess16',
  'backgroundColorLighther08',
  'backgroundColorLighther16',
  'backgroundColorMore08',
  'backgroundColorMore16',
  'backgroundColorTransparent10',
  'foregroundColor',
  'foregroundColorMuted50',
]

export const pickThemeColors = (theme: Theme) => _.pick(theme, themeColorFields)
