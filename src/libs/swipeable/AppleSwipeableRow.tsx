import React from 'react'
import { Animated, StyleSheet, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import BaseSwipeableRow, { IBaseAction, IBaseProps, Placement } from './BaseSwipeableRow'

export { defaultWidth } from './BaseSwipeableRow'

export interface IAction extends IBaseAction {
  label: string
}

export interface IProps extends IBaseProps {}

export default class AppleSwipeableRow extends BaseSwipeableRow {
  _swipeableRow = null

  renderButtonAction = (
    action: IAction,
    { x, placement, progress }: { x: number; placement: Placement; progress },
  ) => {
    const transform = {
      translateX:
        placement === 'LEFT'
          ? progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-x, 0],
            })
          : progress.interpolate({
              inputRange: [0, 1],
              outputRange: [x, 0],
            }),
    }

    const pressHandler = () => {
      action.onPress()
      this.close()
      alert(action.label)
    }

    return (
      <Animated.View
        key={`swipeable-button-action-${action.key}`}
        style={{ flex: 1, transform: [transform] }}
      >
        <RectButton
          style={[
            styles.baseActionContainer,
            { backgroundColor: action.color, width: action.width },
          ]}
          onPress={pressHandler}
        >
          <Text
            style={[
              styles.actionText,
              { alignSelf: 'center', color: action.textColor || '#FFFFFF' },
            ]}
          >
            {action.label}
          </Text>
        </RectButton>
      </Animated.View>
    )
  }

  renderFullAction = (action: IAction, { dragX, placement }: { placement: Placement }) => {
    const transform = {
      translateX:
        placement === 'LEFT'
          ? dragX.interpolate({
              inputRange: [0, 50, 100, 101],
              outputRange: [-20, 0, 0, 1],
            })
          : dragX.interpolate({
              inputRange: [-101, -100, -50, 0],
              outputRange: [-1, 0, 0, 20],
            }),
    }

    const pressHandler = () => {
      action.onPress()
      this.close()
    }

    return (
      <RectButton
        key={`swipeable-full-action-${action.key}`}
        style={[
          styles.baseActionContainer,
          { backgroundColor: action.color, minWidth: action.width },
        ]}
        onPress={pressHandler}
      >
        <Animated.Text
          style={[
            styles.actionText,
            {
              alignSelf: placement === 'LEFT' ? 'flex-start' : 'flex-end',
              color: action.textColor || '#FFFFFF',
              transform: [transform],
            },
          ]}
        >
          {action.label}
        </Animated.Text>
      </RectButton>
    )
  }

  render() {
    const { children, ...props } = this.props

    return (
      <Swipeable
        {...props}
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
        rightThreshold={40}
      >
        {children}
      </Swipeable>
    )
  }
}

const styles = StyleSheet.create({
  actionText: {
    backgroundColor: 'transparent',
    fontSize: 16,
    padding: 10,
  },
  baseActionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
})
