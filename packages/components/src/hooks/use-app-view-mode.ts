import { CardViewMode } from '@devhub/core'
import { useAppLayout } from '../components/context/LayoutContext'
import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useAppViewMode() {
  const { sizename } = useAppLayout()

  const appViewMode = useReduxState(selectors.appViewModeSelector)

  const cardViewMode: CardViewMode =
    appViewMode === 'single-column' && sizename > '3-large'
      ? 'compact'
      : 'expanded'

  return {
    appViewMode,
    cardViewMode,
  }
}
