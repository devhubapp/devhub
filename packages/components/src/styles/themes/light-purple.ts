import * as colors from '../colors'
import { createThemeFromColor } from './custom'

export const theme = createThemeFromColor(
  '#EEECF1',
  'light-purple',
  'Light Purple',
  { primaryBackgroundColor: colors.purple, primaryForegroundColor: '#FFFFFF' },
)
