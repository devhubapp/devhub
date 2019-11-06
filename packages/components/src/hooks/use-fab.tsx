import React from 'react'
import { StyleSheet, View } from 'react-native'

import { FAB, fabSize, fabSpacing } from '../components/common/FAB'
import { useColumnFilters } from '../components/context/ColumnFiltersContext'
import {
  AppLayoutProviderState,
  useAppLayout,
} from '../components/context/LayoutContext'
import { keyboardShortcutsById } from '../components/modals/KeyboardShortcutsModal'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { contentPadding } from '../styles/variables'
import { useKeyboardVisibility } from './use-keyboard-visibility'
import { useReduxAction } from './use-redux-action'
import { useReduxState } from './use-redux-state'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: fabSpacing,
    right: contentPadding,
    marginTop: fabSpacing,
    zIndex: 1000,
  },
})

export function shouldRenderFAB({
  isColumnFiltersVisible,
  keyboardVisibility,
  sizename,
}: {
  isColumnFiltersVisible?: boolean
  keyboardVisibility?: ReturnType<typeof useKeyboardVisibility>
  sizename: AppLayoutProviderState['sizename']
}) {
  if (!(sizename <= '3-large')) return false

  if (sizename === '1-small' && isColumnFiltersVisible) return false

  if (keyboardVisibility === 'appearing' || keyboardVisibility === 'visible')
    return false

  return true
}

export function useFAB(): { Component: React.ReactNode; size: number } {
  // const addOrCloseAnimatedRef = useRef(new Animated.Value(0))

  const { isSharedFiltersOpened } = useColumnFilters()
  const { sizename } = useAppLayout()
  const keyboardVisibility = useKeyboardVisibility()
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const closeAllModals = useReduxAction(actions.closeAllModals)
  const replaceModal = useReduxAction(actions.replaceModal)

  if (
    !shouldRenderFAB({
      sizename,
      keyboardVisibility,
      isColumnFiltersVisible: isSharedFiltersOpened,
    })
  )
    return { Component: undefined, size: 0 }

  if (!currentOpenedModal) {
    /*
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
    */

    // TODO: Migrate to react-spring
    // Bug: https://github.com/react-spring/react-spring/issues/437
    const iconStyle = undefined

    return {
      size: fabSize + 2 * fabSpacing,
      Component: (
        <View collapsable={false} style={styles.container}>
          <FAB
            key="fab"
            analyticsLabel="add_column"
            iconName="plus"
            iconStyle={iconStyle}
            onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
            tooltip={`Add column (${keyboardShortcutsById.addColumn.keys[0]})`}
            useBrandColor
          />
        </View>
      ),
    }
  }

  switch (currentOpenedModal.name) {
    case 'ADD_COLUMN':
    case 'ADD_COLUMN_DETAILS': {
      /*
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
      */

      // TODO: Migrate to react-spring
      // Bug: https://github.com/react-spring/react-spring/issues/437
      const iconStyle = undefined

      return {
        size: fabSize + 2 * fabSpacing,
        Component: (
          <View style={styles.container}>
            <FAB
              analyticsLabel="close_modals"
              key="fab"
              iconName="x"
              iconStyle={iconStyle}
              onPress={() => closeAllModals()}
              tooltip={`Close (${keyboardShortcutsById.closeModal.keys[0]})`}
            />
          </View>
        ),
      }
    }

    default: {
      // addOrCloseAnimatedRef.current.setValue(0)
      return { Component: undefined, size: 0 }
    }
  }
}
