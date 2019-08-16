import { GitHubIcon } from '@devhub/core'
import React, { PureComponent, ReactNode } from 'react'
import { Animated, View } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { sharedStyles } from '../../styles/shared'

export type BaseActionType = 'BUTTON' | 'FULL'

export interface BaseSwipeableRowAction {
  color: string
  icon?: GitHubIcon
  key: string
  label?: string
  onPress: () => void
  textColor?: string
  type?: BaseActionType
  width?: number
}

export interface BaseSwipeableRowProps<IAction = BaseSwipeableRowAction> {
  children: ReactNode
  leftActions: Array<BaseSwipeableRowAction & IAction> // tslint:disable-line prefer-array-literal
  rightActions: Array<BaseSwipeableRowAction & IAction> // tslint:disable-line prefer-array-literal
}

export interface BaseSwipeableRowBaseState {}

export type Placement = 'LEFT' | 'RIGHT'

export const defaultWidth = 64

export abstract class BaseSwipeableRow<
  P = {},
  S = {},
  IAction = BaseSwipeableRowAction
> extends PureComponent<
  BaseSwipeableRowProps<IAction> & P,
  BaseSwipeableRowBaseState & S
> {
  _swipeableRow: Swipeable | null = null

  abstract renderButtonAction: (
    action: IAction,
    params: {
      x: number
      placement: Placement
      progress: Animated.Value
      dragX: Animated.Value
    },
  ) => ReactNode

  abstract renderFullAction: (
    action: IAction,
    params: {
      dragX: Animated.Value
      placement: Placement
      progress: Animated.Value
    },
  ) => ReactNode

  renderLeftActions = (progress: Animated.Value, dragX: Animated.Value) => {
    const { leftActions: actions } = this.props

    const fullAction = actions.find(action => action.type === 'FULL')
    const buttonActions = actions.filter(action => action.type !== 'FULL')

    if (fullAction)
      return this.renderFullAction(fullAction, {
        dragX,
        progress,
        placement: 'LEFT',
      })

    const width = buttonActions.reduce(
      (total, action) => total + (action.width || defaultWidth),
      0,
    )
    let x = 0

    return (
      <View style={[sharedStyles.horizontal, { width }]}>
        {buttonActions.map(action => {
          x += action.width || defaultWidth
          return this.renderButtonAction(action, {
            dragX,
            progress,
            x,
            placement: 'LEFT',
          })
        })}
      </View>
    )
  }

  renderRightActions = (progress: Animated.Value, dragX: Animated.Value) => {
    const { rightActions: actions } = this.props

    const fullAction = actions.find(action => action.type === 'FULL')
    const buttonActions = actions.filter(action => action.type !== 'FULL')

    if (fullAction)
      return this.renderFullAction(fullAction, {
        dragX,
        progress,
        placement: 'RIGHT',
      })

    const width = buttonActions.reduce(
      (total, action) => total + (action.width || defaultWidth),
      0,
    )
    let x = width

    return (
      <View style={[sharedStyles.horizontal, { width }]}>
        {buttonActions.map(action => {
          const component = this.renderButtonAction(action, {
            dragX,
            progress,
            x,
            placement: 'RIGHT',
          })
          x -= action.width || defaultWidth
          return component
        })}
      </View>
    )
  }

  updateRef = (ref: Swipeable) => {
    this._swipeableRow = ref
  }

  close = () => {
    if (this._swipeableRow) this._swipeableRow.close()
  }

  abstract render(): ReactNode
}
