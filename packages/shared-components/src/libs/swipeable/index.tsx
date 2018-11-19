import { ReactNode } from 'react'

import {
  BaseSwipeableRow,
  BaseSwipeableRowAction,
  BaseSwipeableRowProps,
} from './BaseSwipeableRow'

export interface SwipeableRowAction extends BaseSwipeableRowAction {}

export interface SwipeableRowProps extends BaseSwipeableRowProps {}

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
