import * as colors from '../colors'
import { createThemeFromColor } from './custom'

export const theme = createThemeFromColor(
  '#ECF0F1',
  'light-blue',
  'Light Blue',
  { primaryBackgroundColor: colors.blue, primaryForegroundColor: '#FFFFFF' },
)
