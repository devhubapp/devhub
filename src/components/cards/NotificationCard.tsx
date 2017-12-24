import React, { SFC } from 'react'

import SwipeableCard, { IProps as ICardProps } from './partials/SwipeableCard'

export interface IProps extends ICardProps {}

export interface IState {}

const NotificationCard: SFC<IProps> = props => <SwipeableCard {...props} />

export default NotificationCard
