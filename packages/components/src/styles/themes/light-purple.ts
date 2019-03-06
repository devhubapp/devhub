import * as colors from '../colors'
import { createThemeFromColor } from './custom'

export const theme = createThemeFromColor(
  '#F9F8FA',
  'light-purple',
  'Light Purple',
  { primaryBackgroundColor: colors.purple, primaryForegroundColor: '#FFFFFF' },
)
