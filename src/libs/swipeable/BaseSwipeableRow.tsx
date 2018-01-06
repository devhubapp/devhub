import React, { PureComponent, ReactNode } from 'react'
import { Animated, View } from 'react-native'
import { Swipeable, SwipeableProperties } from 'react-native-gesture-handler'

enum BaseActionType {
  BUTTON = 'BUTTON',
  FULL = 'FULL',
}

export interface IBaseAction {
  color: string
  key: string
  onPress: () => void
  textColor?: string
  type?: BaseActionType
  width?: number
}

export interface IBaseProps {
  leftActions: IBaseAction[]
  rightActions: IBaseAction[]
}

export interface IBaseState {}

export type Placement = 'LEFT' | 'RIGHT'

export const defaultWidth = 64

export default abstract class BaseSwipeableRow<
  P = {},
  S = {}
> extends PureComponent<IBaseProps & P, IBaseState & S> {
  _swipeableRow: Swipeable | null = null

  abstract renderButtonAction: (
    action: IBaseAction,
    {
      dragX,
      placement,
      progress,
      x,
    }: {
      x: number
      placement: Placement
      progress: Animated.Value
      dragX: Animated.Value
    },
  ) => ReactNode

  abstract renderFullAction: (
    action: IBaseAction,
    {
      dragX,
      placement,
      progress,
    }: {
      dragX: Animated.Value
      placement: Placement
      progress: Animated.Value
    },
  ) => ReactNode

  renderLeftActions: SwipeableProperties['renderLeftActions'] = (
    progress,
    dragX,
  ) => {
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
      <View style={{ width, flexDirection: 'row' }}>
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

  renderRightActions: SwipeableProperties['renderRightActions'] = (
    progress,
    dragX,
  ) => {
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
      <View style={{ width, flexDirection: 'row' }}>
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
