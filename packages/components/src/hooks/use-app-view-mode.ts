import { useAppLayout } from '../components/context/LayoutContext'
import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useAppViewMode() {
  const appViewMode = useReduxState(selectors.viewModeSelector)
  const { sizename } = useAppLayout()

  const supportsSingleColumnViewMode = sizename >= '4-x-large'

  return {
    _appViewMode: supportsSingleColumnViewMode ? appViewMode : 'multi-column',
    appViewMode: 'single-column',
    supportsSingleColumnViewMode,
  }
}
