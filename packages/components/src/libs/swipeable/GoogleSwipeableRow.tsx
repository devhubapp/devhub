import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import { GitHubIcon } from '@devhub/core'
import { Octicons as Icon } from '../../libs/vector-icons'
import {
  BaseSwipeableRow,
  BaseSwipeableRowAction,
  BaseSwipeableRowProps,
  Placement,
} from './BaseSwipeableRow'

export { defaultWidth } from './BaseSwipeableRow'

const iconSize = 20

export interface GoogleSwipeableRowAction extends BaseSwipeableRowAction {
  icon: GitHubIcon
  label: undefined
}

export interface GoogleSwipeableRowProps extends BaseSwipeableRowProps {}

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

export class GoogleSwipeableRow extends BaseSwipeableRow<
  GoogleSwipeableRowProps,
  void,
  GoogleSwipeableRowAction
> {
  renderButtonAction = (
    action: GoogleSwipeableRowAction,
    {
      dragX,
      placement,
      x,
    }: { dragX: Animated.Value; placement: Placement; x: number },
  ) => {
    const transform = {
      scale:
        placement === 'LEFT'
          ? dragX.interpolate({
              extrapolate: 'clamp',
              inputRange: [x - 80, x],
              outputRange: [0, 1],
            })
          : dragX.interpolate({
              extrapolate: 'clamp',
              inputRange: [-x, -x + 80],
              outputRange: [1, 0],
            }),
    }

    const pressHandler = () => {
      action.onPress()
      this.close()
    }

    return (
      <RectButton
        key={`swipeable-button-action-${action.key}`}
        style={[
          styles.baseActionContainer,
          { alignItems: 'center', backgroundColor: action.color },
        ]}
        onPress={pressHandler}
      >
        <AnimatedIcon
          name={action.icon}
          size={iconSize}
          color={action.textColor || '#FFFFFF'}
          style={[styles.actionIcon, { transform: [transform] }] as any}
        />
      </RectButton>
    )
  }

  renderFullAction = (
    action: GoogleSwipeableRowAction,
    { dragX, placement }: { dragX: Animated.Value; placement: Placement },
  ) => {
    const transform = {
      scale:
        placement === 'LEFT'
          ? dragX.interpolate({
              extrapolate: 'clamp',
              inputRange: [0, 80],
              outputRange: [0, 1],
            })
          : dragX.interpolate({
              extrapolate: 'clamp',
              inputRange: [-80, 0],
              outputRange: [1, 0],
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
          {
            alignItems: placement === 'LEFT' ? 'flex-start' : 'flex-end',
            backgroundColor: action.color,
          },
        ]}
        onPress={pressHandler}
      >
        <AnimatedIcon
          name={action.icon}
          size={iconSize}
          color={action.textColor || '#FFFFFF'}
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
        ref={this.swipeable}
        friction={2}
        leftThreshold={80}
        onSwipeableLeftWillOpen={() => {
          const fullAction = props.leftActions.find(a => a.type === 'FULL')
          if (fullAction) {
            fullAction.onPress()
            if (this.swipeable.current) this.swipeable.current.close()
            ReactNativeHapticFeedback.trigger('selection', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: true,
            })
          }
        }}
        onSwipeableRightWillOpen={() => {
          const fullAction = props.rightActions.find(a => a.type === 'FULL')
          if (fullAction) {
            fullAction.onPress()
            if (this.swipeable.current) this.swipeable.current.close()
            ReactNativeHapticFeedback.trigger('selection', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: true,
            })
          }
        }}
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

  actionIcon: {
    backgroundColor: 'transparent',
    marginHorizontal: 10,
    width: iconSize,
  },
})
