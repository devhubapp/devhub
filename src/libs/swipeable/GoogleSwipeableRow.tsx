import React from 'react'
import { Animated, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'

import BaseSwipeableRow, {
  IBaseAction,
  IBaseProps,
  Placement,
} from './BaseSwipeableRow'

export { defaultWidth } from './BaseSwipeableRow'

export interface IAction extends IBaseAction {
  icon: string
}

export interface IProps extends IBaseProps {}

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

export default class GoogleSwipeableRow extends BaseSwipeableRow {
  _swipeableRow = null

  renderButtonAction = (
    action: IAction,
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
      // alert(action.label)
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
          size={30}
          color={action.textColor || '#FFFFFF'}
          style={[styles.actionIcon, { transform: [transform] }]}
        />
      </RectButton>
    )
  }

  renderFullAction = (
    action: IAction,
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
          size={30}
          color={action.textColor || '#FFFFFF'}
          style={[styles.actionIcon, { transform: [transform] }]}
        />
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
        leftThreshold={80}
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
  } as TextStyle,

  actionIcon: {
    backgroundColor: 'transparent',
    marginHorizontal: 10,
    width: 30,
  } as ViewStyle,
})
