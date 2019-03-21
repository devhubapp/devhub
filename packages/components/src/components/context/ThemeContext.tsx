import { Theme } from '@devhub/core'
import { useReduxState } from '../../hooks/use-redux-state'
import { Browser } from '../../libs/browser'
import * as selectors from '../../redux/selectors'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'

export function useTheme(callback?: (theme: Theme) => void) {
  const theme = useReduxState(selectors.themeSelector, callback)

  const headerThemeColors = getColumnHeaderThemeColors(theme.backgroundColor)
  Browser.setBackgroundColor(theme[headerThemeColors.normal])
  Browser.setForegroundColor(theme.foregroundColor)

  return theme
}
