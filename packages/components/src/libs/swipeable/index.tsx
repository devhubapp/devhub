import { ReactNode } from 'react'

import { AppleSwipeableRowProps } from './AppleSwipeableRow'
import { BaseSwipeableRow, BaseSwipeableRowAction } from './BaseSwipeableRow'
import { GoogleSwipeableRowProps } from './GoogleSwipeableRow'

export type SwipeableRowAction = BaseSwipeableRowAction

export type SwipeableRowProps = GoogleSwipeableRowProps | AppleSwipeableRowProps

export class SwipeableRow extends BaseSwipeableRow<
  SwipeableRowProps,
  void,
  SwipeableRowAction
> {
  renderButtonAction = () => {
    return null
  }

  renderFullAction = () => {
    return null
  }

  render(): ReactNode {
    const { children } = this.props
    return children
  }
}
