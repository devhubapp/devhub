import React from 'react'
import { Animated, StyleSheet, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import { sharedStyles } from '../../styles/shared'
import {
  BaseSwipeableRow,
  BaseSwipeableRowAction,
  BaseSwipeableRowProps,
  Placement,
} from './BaseSwipeableRow'

export { defaultWidth } from './BaseSwipeableRow'

export interface AppleSwipeableRowAction extends BaseSwipeableRowAction {
  label: string
}

export interface AppleSwipeableRowProps
  extends BaseSwipeableRowProps<AppleSwipeableRowAction> {}

export class AppleSwipeableRow extends BaseSwipeableRow<
  AppleSwipeableRowProps,
  void,
  AppleSwipeableRowAction
> {
  renderButtonAction = (
    action: AppleSwipeableRowAction,
    {
      x,
      placement,
      progressAnimatedValue,
    }: {
      placement: Placement
      progressAnimatedValue: Animated.Value | Animated.AnimatedInterpolation
      x: number
    },
  ) => {
    const transform = {
      translateX:
        placement === 'LEFT'
          ? progressAnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-x, 0],
            })
          : progressAnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [x, 0],
            }),
    }

    const pressHandler = () => {
      action.onPress()
      this.close()
    }

    return (
      <Animated.View
        key={`swipeable-button-action-${action.key}`}
        style={[sharedStyles.flex, { transform: [transform] }]}
      >
        <RectButton
          onPress={pressHandler}
          style={[
            styles.baseActionContainer,
            { backgroundColor: action.backgroundColor, width: action.width },
          ]}
        >
          <Text
            style={[
              styles.actionText,
              {
                alignSelf: 'center',
                color: action.foregroundColor || '#FF0000',
              },
            ]}
          >
            {action.label}
          </Text>
        </RectButton>
      </Animated.View>
    )
  }

  renderFullAction = (
    action: AppleSwipeableRowAction,
    {
      dragAnimatedValue,
      placement,
    }: {
      dragAnimatedValue: Animated.AnimatedInterpolation
      placement: Placement
    },
  ) => {
    const transform = {
      translateX:
        placement === 'LEFT'
          ? dragAnimatedValue.interpolate({
              inputRange: [0, 50, 100, 101],
              outputRange: [-20, 0, 0, 1],
            })
          : dragAnimatedValue.interpolate({
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
          { backgroundColor: action.backgroundColor, minWidth: action.width },
        ]}
        onPress={pressHandler}
      >
        <Animated.Text
          style={[
            styles.actionText,
            {
              alignSelf: placement === 'LEFT' ? 'flex-start' : 'flex-end',
              color: action.foregroundColor || '#FF0000',
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
        ref={this.swipeableRef}
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
  baseActionContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  actionText: {
    backgroundColor: 'transparent',
    fontSize: 16,
    padding: 10,
  },
})
