import { Theme, ThemeTransformer } from '@devhub/core'
import { useReduxState } from '../../hooks/use-redux-state'
import { Browser } from '../../libs/browser'
import * as selectors from '../../redux/selectors'
import { transformTheme } from '../../utils/helpers/theme'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'

export function useTheme(
  { themeTransformer }: { themeTransformer?: ThemeTransformer } = {},
  callback?: (theme: Theme) => void,
) {
  let theme = useReduxState(selectors.themeSelector, callback)
  if (themeTransformer) theme = transformTheme(theme, themeTransformer)

  const headerThemeColors = getColumnHeaderThemeColors(theme.backgroundColor)
  Browser.setBackgroundColor(theme[headerThemeColors.normal])
  Browser.setForegroundColor(theme.foregroundColor)

  return theme
}
