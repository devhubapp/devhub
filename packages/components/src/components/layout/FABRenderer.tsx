import React, { useRef } from 'react'

import { Animated, Easing, ViewStyle } from 'react-native'
import { useKeyboardVisibility } from '../../hooks/use-keyboard-visibility'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { buttonSize } from '../common/Button'
import { FAB, fabSize } from '../common/FAB'
import { useAppLayout } from '../context/LayoutContext'

export const fabSpacing =
  contentPadding / 2 + Math.max(0, (fabSize - buttonSize) / 2)

const fabPositionStyle: ViewStyle = {
  position: 'absolute',
  bottom: fabSpacing,
  right: contentPadding,
  zIndex: 101,
}

export function FABRenderer() {
  const addOrCloseAnimatedRef = useRef(new Animated.Value(0))

  const keyboardVisibility = useKeyboardVisibility()
  const { sizename } = useAppLayout()

  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)

  const closeAllModals = useReduxAction(actions.closeAllModals)
  const replaceModal = useReduxAction(actions.replaceModal)

  if (!(sizename < '3-large')) return null
  if (keyboardVisibility === 'appearing' || keyboardVisibility === 'visible')
    return null

  if (!currentOpenedModal) {
    Animated.timing(addOrCloseAnimatedRef.current, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
    }).start()

    const rotateZ = addOrCloseAnimatedRef.current.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    })

    const iconStyle = { transform: [{ rotateZ }] }

    return (
      <Animated.View style={fabPositionStyle}>
        <FAB
          key="fab"
          analyticsLabel="add_column"
          iconName="plus"
          iconStyle={iconStyle}
          onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
          useBrandColor
        />
      </Animated.View>
    )
  }

  switch (currentOpenedModal.name) {
    case 'ADD_COLUMN':
    case 'ADD_COLUMN_DETAILS': {
      Animated.timing(addOrCloseAnimatedRef.current, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
      }).start()

      const rotateZ = addOrCloseAnimatedRef.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
      })

      const iconStyle = { transform: [{ rotateZ }] }

      return (
        <Animated.View style={fabPositionStyle}>
          <FAB
            analyticsLabel="close_modals"
            key="fab"
            iconName="plus"
            iconStyle={iconStyle}
            onPress={() => closeAllModals()}
          />
        </Animated.View>
      )
    }

    default: {
      addOrCloseAnimatedRef.current.setValue(0)
      return null
    }
  }
}
