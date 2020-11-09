import React, { PureComponent, ReactNode } from 'react'
import { Animated, View } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { SwipeableProperties } from 'react-native-gesture-handler/Swipeable'

import { sharedStyles } from '../../styles/shared'

export type BaseActionType = 'BUTTON' | 'FULL'

export interface BaseSwipeableRowAction {
  backgroundColor: string
  foregroundColor: string
  key: string
  onPress: () => void
  type?: BaseActionType
  width?: number
}

export interface BaseSwipeableRowProps<IAction = BaseSwipeableRowAction>
  extends SwipeableProperties {
  children: ReactNode
  leftActions: (BaseSwipeableRowAction & IAction)[]
  rightActions: (BaseSwipeableRowAction & IAction)[]
}

export interface BaseSwipeableRowBaseState {}

export type Placement = 'LEFT' | 'RIGHT'

export const defaultWidth = 64

export abstract class BaseSwipeableRow<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
  IAction = BaseSwipeableRowAction
> extends PureComponent<
  BaseSwipeableRowProps<IAction> & P,
  BaseSwipeableRowBaseState & S
> {
  swipeableRef = React.createRef<Swipeable>()
  innerViewRef = React.createRef<View>()

  abstract renderButtonAction: (
    action: IAction,
    params: {
      dragAnimatedValue: Animated.AnimatedInterpolation
      placement: Placement
      progressAnimatedValue: Animated.Value | Animated.AnimatedInterpolation
      x: number
    },
  ) => ReactNode

  abstract renderFullAction: (
    action: IAction,
    params: {
      dragAnimatedValue: Animated.AnimatedInterpolation
      placement: Placement
      progressAnimatedValue: Animated.Value | Animated.AnimatedInterpolation
    },
  ) => ReactNode

  renderLeftActions = (
    progressAnimatedValue: Animated.Value | Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation,
  ): React.ReactNode => {
    const { leftActions: actions } = this.props

    const fullAction = actions.find((action) => action.type === 'FULL')
    const buttonActions = actions.filter((action) => action.type !== 'FULL')

    if (fullAction)
      return this.renderFullAction(fullAction, {
        dragAnimatedValue,
        progressAnimatedValue,
        placement: 'LEFT',
      })

    const width = buttonActions.reduce(
      (total, action) => total + (action.width || defaultWidth),
      0,
    )
    let x = 0

    return (
      <View style={[sharedStyles.horizontal, { width }]}>
        {buttonActions.map((action) => {
          x += action.width || defaultWidth
          return this.renderButtonAction(action, {
            dragAnimatedValue,
            progressAnimatedValue,
            x,
            placement: 'LEFT',
          })
        })}
      </View>
    )
  }

  renderRightActions = (
    progressAnimatedValue: Animated.Value | Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation,
  ): React.ReactNode => {
    const { rightActions: actions } = this.props

    const fullAction = actions.find((action) => action.type === 'FULL')
    const buttonActions = actions.filter((action) => action.type !== 'FULL')

    if (fullAction)
      return this.renderFullAction(fullAction, {
        dragAnimatedValue,
        progressAnimatedValue,
        placement: 'RIGHT',
      })

    const width = buttonActions.reduce(
      (total, action) => total + (action.width || defaultWidth),
      0,
    )
    let x = width

    return (
      <View style={[sharedStyles.horizontal, { width }]}>
        {buttonActions.map((action) => {
          const component = this.renderButtonAction(action, {
            dragAnimatedValue,
            progressAnimatedValue,
            x,
            placement: 'RIGHT',
          })
          x -= action.width || defaultWidth
          return component
        })}
      </View>
    )
  }

  close = () => {
    if (this.swipeableRef.current) this.swipeableRef.current.close()
  }

  abstract render(): ReactNode
}
