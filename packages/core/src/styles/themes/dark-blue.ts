import { getStaticColors } from '../colors'
import { createThemeFromColor } from './custom'

export const theme = createThemeFromColor('#242B38', 'dark-blue', 'Dark Blue', {
  override: {
    primaryBackgroundColor: getStaticColors({ isDark: true }).blue,
  },
})
