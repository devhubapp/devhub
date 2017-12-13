import React from 'react'

import SwipeableCard, { IProps as ICardProps } from './partials/SwipeableCard'

export interface IProps extends ICardProps {}

export interface IState {}

const NotificationCard = ({ username }: IProps) => <SwipeableCard username={username} />

export default NotificationCard
