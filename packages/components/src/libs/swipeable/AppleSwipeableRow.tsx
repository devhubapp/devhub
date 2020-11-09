import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import { Text } from '../../components/common/Text'
import { sharedStyles } from '../../styles/shared'
import {
  contentPadding,
  normalTextSize,
  scaleFactor,
} from '../../styles/variables'
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

export type AppleSwipeableRowProps = BaseSwipeableRowProps<
  AppleSwipeableRowAction
>

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
              inputRange: [
                0,
                50 * scaleFactor,
                100 * scaleFactor,
                101 * scaleFactor,
              ],
              outputRange: [
                -20 * scaleFactor,
                0 * scaleFactor,
                0 * scaleFactor,
                1 * scaleFactor,
              ],
            })
          : dragAnimatedValue.interpolate({
              inputRange: [
                -101 * scaleFactor,
                -100 * scaleFactor,
                -50 * scaleFactor,
                0 * scaleFactor,
              ],
              outputRange: [
                -1 * scaleFactor,
                0 * scaleFactor,
                0 * scaleFactor,
                20 * scaleFactor,
              ],
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
        friction={1}
        leftThreshold={40 * scaleFactor}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
        rightThreshold={40 * scaleFactor}
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
    fontSize: normalTextSize,
    padding: (contentPadding * 2) / 3,
  },
})
