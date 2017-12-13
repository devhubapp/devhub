import React from 'react'

import SwipeableRow from '../../../libs/swipeable'
import Card, { IProps as ICardProps } from './Card'

export interface IProps extends ICardProps {}

export interface IState {}

const SwipeableCard = (props: IProps) => (
  <SwipeableRow
    leftActions={[
      {
        type: 'FULL',
        key: 'archive',
        icon: 'archive',
        color: '#497AFC',
        label: 'Archive',
        onPress: () => {},
      },
    ]}
    rightActions={[
      {
        type: 'FULL',
        key: 'archive',
        icon: 'archive',
        color: '#497AFC',
        label: 'Archive',
        onPress: () => {},
      },
    ]}
  >
    <Card {...props} />
  </SwipeableRow>
)

export default SwipeableCard
