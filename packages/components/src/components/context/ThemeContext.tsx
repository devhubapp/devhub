import { Theme } from '@devhub/core'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'

export function useTheme(callback?: (theme: Theme) => void) {
  const theme = useReduxState(selectors.themeSelector, callback)
  return theme
}
