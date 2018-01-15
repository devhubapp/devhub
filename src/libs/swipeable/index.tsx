import { ReactNode } from 'react'
import BaseSwipeableRow, { IBaseAction, IBaseProps } from './BaseSwipeableRow'

export interface IAction extends IBaseAction {}

export interface IProps extends IBaseProps {}

export default class NonSwipeableRow extends BaseSwipeableRow<
  IProps,
  void,
  IAction
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
