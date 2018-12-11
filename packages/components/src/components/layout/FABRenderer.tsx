import React, { useRef } from 'react'

import { Animated, Easing, View, ViewStyle } from 'react-native'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
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
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const closeAllModals = useReduxAction(actions.closeAllModals)
  const replaceModal = useReduxAction(actions.replaceModal)
  const { sizename } = useAppLayout()

  if (sizename !== '1-small') return null

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

    return (
      <Animated.View style={[fabPositionStyle, { transform: [{ rotateZ }] }]}>
        <FAB
          key="fab"
          analyticsLabel="add_column"
          iconName="plus"
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

      return (
        <Animated.View style={[fabPositionStyle, { transform: [{ rotateZ }] }]}>
          <FAB
            analyticsLabel="close_modals"
            key="fab"
            iconName="plus"
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
