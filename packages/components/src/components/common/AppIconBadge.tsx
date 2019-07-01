import React from 'react'

import { Platform } from '../../libs/platform'
import { useUnreadCount } from '../context/UnreadCountContext'

interface IProps {}

export const AppIconBadge = React.memo((_props: IProps) => {
  if (Platform.isElectron) {
    const unreadCount = useUnreadCount()
    window.ipc.send('unread-counter', unreadCount)
  }
  return null
})
