import React, { PureComponent } from 'react'
import { View } from 'react-native'

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

export enum Placement {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export const defaultWidth = 64

export default class BaseSwipeableRow extends PureComponent<IBaseProps, IBaseState> {
  _swipeableRow = null

  renderButtonAction = (
    action: IBaseAction,
    { dragX, placement, progress, x }: { x: number; placement: Placement; progress: number },
  ) => {
    throw new Error('Not implemented: renderButtonAction')
  }

  renderFullAction = (
    action: IBaseAction,
    { dragX, placement, progress }: { placement: Placement },
  ) => {
    throw new Error('Not implemented: renderFullAction')
  }

  renderLeftActions = (progress: number, dragX) => {
    const { leftActions: actions } = this.props

    const fullAction = actions.find(action => action.type === 'FULL')
    const buttonActions = actions.filter(action => action.type !== 'FULL')

    if (fullAction) return this.renderFullAction(fullAction, { dragX, placement: 'LEFT', progress })

    const width = buttonActions.reduce((total, action) => total + (action.width || defaultWidth), 0)
    let x = 0

    return (
      <View style={{ width, flexDirection: 'row' }}>
        {buttonActions.map(action => {
          x += action.width || defaultWidth
          return this.renderButtonAction(action, { placement: 'LEFT', progress, x })
        })}
      </View>
    )
  }

  renderRightActions = (progress: number, dragX) => {
    const { rightActions: actions } = this.props

    const fullAction = actions.find(action => action.type === 'FULL')
    const buttonActions = actions.filter(action => action.type !== 'FULL')

    if (fullAction)
      return this.renderFullAction(fullAction, { dragX, placement: 'RIGHT', progress })

    const width = buttonActions.reduce((total, action) => total + (action.width || defaultWidth), 0)
    let x = width

    return (
      <View style={{ width, flexDirection: 'row' }}>
        {buttonActions.map(action => {
          const component = this.renderButtonAction(action, {
            dragX,
            placement: 'RIGHT',
            progress,
            x,
          })
          x -= action.width || defaultWidth
          return component
        })}
      </View>
    )
  }

  updateRef = ref => {
    this._swipeableRow = ref
  }

  close = () => {
    this._swipeableRow.close()
  }

  render() {
    throw new Error('Not implemented: render')
  }
}
