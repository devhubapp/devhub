import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import { IconProp, MaterialIcons, Octicons } from '../../libs/vector-icons'
import { contentPadding, scaleFactor } from '../../styles/variables'
import { vibrateHapticFeedback } from '../../utils/helpers/shared'
import {
  BaseSwipeableRow,
  BaseSwipeableRowAction,
  BaseSwipeableRowProps,
  Placement,
} from './BaseSwipeableRow'
export { defaultWidth } from './BaseSwipeableRow'

const iconSize = 20 * scaleFactor

export type GoogleSwipeableRowAction = BaseSwipeableRowAction & {
  icon: IconProp
}

export type GoogleSwipeableRowProps = BaseSwipeableRowProps<
  GoogleSwipeableRowAction
>

const AnimatedOcticons = Animated.createAnimatedComponent(Octicons)
const AnimatedMaterialIcons = Animated.createAnimatedComponent(MaterialIcons)

export class GoogleSwipeableRow extends BaseSwipeableRow<
  GoogleSwipeableRowProps,
  void,
  GoogleSwipeableRowAction
> {
  renderButtonAction = (
    action: GoogleSwipeableRowAction,
    {
      dragAnimatedValue,
      placement,
      x,
    }: {
      dragAnimatedValue: Animated.AnimatedInterpolation
      placement: Placement
      x: number
    },
  ) => {
    const transform = {
      scale:
        placement === 'LEFT'
          ? dragAnimatedValue.interpolate({
              extrapolate: 'clamp',
              inputRange: [(x - 80) * scaleFactor, x * scaleFactor],
              outputRange: [0, 1],
            })
          : dragAnimatedValue.interpolate({
              extrapolate: 'clamp',
              inputRange: [-x * scaleFactor, (-x + 80) * scaleFactor],
              outputRange: [1, 0],
            }),
    }

    const pressHandler = () => {
      action.onPress()
      this.close()
    }

    const AnimatedIcon =
      action.icon && action.icon.family === 'material'
        ? AnimatedMaterialIcons
        : AnimatedOcticons

    return (
      <RectButton
        key={`swipeable-button-action-${action.key}`}
        style={[
          styles.baseActionContainer,
          { alignItems: 'center', backgroundColor: action.backgroundColor },
        ]}
        onPress={pressHandler}
      >
        <AnimatedIcon
          {...action.icon}
          size={iconSize}
          color={action.foregroundColor || '#FF0000'}
          style={[styles.actionIcon, { transform: [transform] }] as any}
        />
      </RectButton>
    )
  }

  renderFullAction = (
    action: GoogleSwipeableRowAction,
    {
      dragAnimatedValue,
      placement,
    }: {
      dragAnimatedValue: Animated.AnimatedInterpolation
      placement: Placement
    },
  ) => {
    const transform = {
      scale:
        placement === 'LEFT'
          ? dragAnimatedValue.interpolate({
              extrapolate: 'clamp',
              inputRange: [0 * scaleFactor, 80 * scaleFactor],
              outputRange: [0, 1],
            })
          : dragAnimatedValue.interpolate({
              extrapolate: 'clamp',
              inputRange: [-80 * scaleFactor, 0 * scaleFactor],
              outputRange: [1, 0],
            }),
    }

    const pressHandler = () => {
      action.onPress()
      this.close()
    }

    const AnimatedIcon =
      action.icon && action.icon.family === 'material'
        ? AnimatedMaterialIcons
        : AnimatedOcticons

    return (
      <RectButton
        key={`swipeable-full-action-${action.key}`}
        style={[
          styles.baseActionContainer,
          {
            alignItems: placement === 'LEFT' ? 'flex-start' : 'flex-end',
            backgroundColor: action.backgroundColor,
          },
        ]}
        onPress={pressHandler}
      >
        <AnimatedIcon
          {...action.icon}
          size={iconSize}
          color={action.foregroundColor || '#FF0000'}
          style={[styles.actionIcon, { transform: [transform] }] as any}
        />
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
        onSwipeableLeftWillOpen={() => {
          const fullAction = props.leftActions.find((a) => a.type === 'FULL')
          if (fullAction) {
            fullAction.onPress()
            if (this.swipeableRef.current) this.swipeableRef.current.close()
            vibrateHapticFeedback()
          }

          if (props.onSwipeableLeftWillOpen) props.onSwipeableLeftWillOpen()
        }}
        onSwipeableRightWillOpen={() => {
          const fullAction = props.rightActions.find((a) => a.type === 'FULL')
          if (fullAction) {
            fullAction.onPress()
            if (this.swipeableRef.current) this.swipeableRef.current.close()
            vibrateHapticFeedback()
          }

          if (props.onSwipeableRightWillOpen) props.onSwipeableRightWillOpen()
        }}
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

  actionIcon: {
    backgroundColor: 'transparent',
    marginHorizontal: (contentPadding * 2) / 3,
    width: iconSize,
  },
})
