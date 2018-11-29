import React from 'react'

import { ViewStyle } from 'react-native'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { buttonSize } from '../common/Button'
import { FAB, fabSize } from '../common/FAB'
import { useAppLayout } from '../context/LayoutContext'

const fabStyle: ViewStyle = {
  position: 'absolute',
  bottom: contentPadding / 2 + Math.max(0, (fabSize - buttonSize) / 2),
  right: contentPadding,
  zIndex: 101,
}

export function FABRenderer() {
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const closeAllModals = useReduxAction(actions.closeAllModals)
  const replaceModal = useReduxAction(actions.replaceModal)
  const { sizename } = useAppLayout()

  if (sizename !== '1-small') return null

  if (!currentOpenedModal) {
    return (
      <FAB
        iconName="plus"
        onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
        style={fabStyle}
        useBrandColor
      />
    )
  }

  switch (currentOpenedModal.name) {
    case 'ADD_COLUMN':
    case 'ADD_COLUMN_DETAILS': {
      return (
        <FAB iconName="x" onPress={() => closeAllModals()} style={fabStyle} />
      )
    }

    default:
      return null
  }
}
