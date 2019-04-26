import { CardViewMode } from '@devhub/core'
import { useAppLayout } from '../components/context/LayoutContext'
import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

function getCardViewMode(cardWidth: number): CardViewMode {
  return cardWidth >= 650 ? 'compact' : 'expanded'
}

function getEnableCompactLabels(
  cardWidth: number,
  repoTableColumnWidth: number,
): boolean {
  if (getCardViewMode(cardWidth) !== 'compact') return false
  return cardWidth - repoTableColumnWidth >= 850
}

export function useAppViewMode() {
  const { sizename } = useAppLayout()
  const _appViewMode = useReduxState(selectors._appViewModeSelector)

  const canSwitchAppViewMode = sizename >= '2-medium'

  const appViewMode = canSwitchAppViewMode ? _appViewMode : 'single-column'

  return {
    appViewMode,
    canSwitchAppViewMode,
    getCardViewMode,
    getEnableCompactLabels,
  }
}
