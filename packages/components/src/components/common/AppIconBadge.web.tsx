import React from 'react'

import { Platform } from '../../libs/platform'
import { useUnreadCount } from '../context/UnreadCountContext'

export interface AppIconBadgeProps {}

export const AppIconBadge = React.memo((_props: AppIconBadgeProps) => {
  const unreadCount = useUnreadCount()

  if (Platform.isElectron) {
    window.ipc.send('unread-counter', unreadCount)
  } else {
    const title = `${document.title || 'DevHub'}`
    const titleWithoutBadge = title.replace(/ \([\d]+\+?\)$/, '')

    document.title = `${titleWithoutBadge}${
      unreadCount > 0 ? ` (${unreadCount})` : ''
    }`
    updateFavicon(unreadCount > 0)
  }

  return null
})

function updateFavicon(showBadge: boolean) {
  let favicon = document.querySelector('link[rel="shortcut icon"]')

  if (!favicon) {
    const head = document.querySelector('head')
    if (!head) return false

    favicon = document.createElement('link')
    favicon.setAttribute('rel', 'shortcut icon')

    head.appendChild(favicon)
  }

  const href = favicon.getAttribute('href') || 'favicon.ico'

  const baseArr = href.split('/').slice(0, -1)
  const newFilename = showBadge ? 'favicon-with-badge.ico' : 'favicon.ico'
  const newHref = [...baseArr, newFilename].join('/')

  favicon.setAttribute('type', 'image/ico')
  favicon.setAttribute('href', newHref)

  return true
}
