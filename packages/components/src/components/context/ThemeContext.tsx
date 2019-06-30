import { Theme, ThemeTransformer } from '@devhub/core'
import { useCallback } from 'react'
import { useReduxState } from '../../hooks/use-redux-state'
import { useReduxStateCallback } from '../../hooks/use-redux-state-callback'
import { Browser } from '../../libs/browser'
import * as selectors from '../../redux/selectors'
import { transformTheme } from '../../utils/helpers/theme'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'

export function useTheme({
  themeTransformer,
}: { themeTransformer?: ThemeTransformer } = {}) {
  let theme = useReduxState(selectors.themeSelector)
  if (themeTransformer) theme = transformTheme(theme, themeTransformer)

  const headerThemeColors = getColumnHeaderThemeColors(theme.backgroundColor)
  Browser.setBackgroundColor(theme[headerThemeColors.normal])
  Browser.setForegroundColor(theme.foregroundColor)

  return theme
}

export function useThemeCallback(
  {
    skipFirstCallback,
    themeTransformer,
  }: { skipFirstCallback?: boolean; themeTransformer?: ThemeTransformer } = {},
  callback: (theme: Theme) => void,
) {
  let initialTheme = useReduxStateCallback(
    selectors.themeSelector,
    useCallback(
      t => {
        const theme = themeTransformer ? transformTheme(t, themeTransformer) : t
        callback(theme)
      },
      [callback, skipFirstCallback, themeTransformer],
    ),
    { skipFirstCallback },
  )

  if (themeTransformer)
    initialTheme = transformTheme(initialTheme, themeTransformer)

  const headerThemeColors = getColumnHeaderThemeColors(
    initialTheme.backgroundColor,
  )
  Browser.setBackgroundColor(initialTheme[headerThemeColors.normal])
  Browser.setForegroundColor(initialTheme.foregroundColor)

  return initialTheme
}
