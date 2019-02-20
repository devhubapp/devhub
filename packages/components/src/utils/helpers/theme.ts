import _ from 'lodash'

import { Theme, ThemeColors } from '@devhub/core'

export const themeColorFields: Array<keyof ThemeColors> = [
  'primaryBackgroundColor',
  'primaryForegroundColor',
  'backgroundColor',
  'backgroundColorDarker1',
  'backgroundColorDarker2',
  'backgroundColorDarker3',
  'backgroundColorDarker4',
  'backgroundColorLess1',
  'backgroundColorLess2',
  'backgroundColorLess3',
  'backgroundColorLess4',
  'backgroundColorLighther1',
  'backgroundColorLighther2',
  'backgroundColorLighther3',
  'backgroundColorLighther4',
  'backgroundColorMore1',
  'backgroundColorMore2',
  'backgroundColorMore3',
  'backgroundColorMore4',
  'backgroundColorTransparent10',
  'foregroundColor',
  'foregroundColorMuted20',
  'foregroundColorMuted50',
]

export const pickThemeColors = (theme: Theme) => _.pick(theme, themeColorFields)
