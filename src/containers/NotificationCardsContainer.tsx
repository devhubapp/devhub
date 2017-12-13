import React from 'react'

import NotificationCards from '../components/cards/NotificationCards'
import { INotification } from '../utils/types'

const notifications: INotification[] = [
  { id: '0', actor: { id: '0', username: 'sibelius' } },
  { id: '1', actor: { id: '1', username: 'gaearon' } },
  { id: '2', actor: { id: '2', username: 'brunolemos' } },
  { id: '3', actor: { id: '3', username: 'augustolazaro' } },
]

const NotificationCardsContainer = () => <NotificationCards notifications={notifications} />

export default NotificationCardsContainer
