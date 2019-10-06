import React from 'react'

export interface AppIconBadgeProps {}

export const AppIconBadge = React.memo((_props: AppIconBadgeProps) => {
  return null
})

// Before enabling this for mobile, needs to:
// 1. Fix badge on Android
// 2. Make sure the badge number will get automatically updated on background
/*
import React from 'react'
import firebase from '@react-native-firebase/app'

import { useUnreadCount } from '../context/UnreadCountContext'

export interface AppIconBadgeProps {}

export const AppIconBadge = React.memo((_props: AppIconBadgeProps) => {
  const unreadCount = useUnreadCount()

  askPermissionAndSetBadge(unreadCount)

  return null
})

async function askPermissionAndSetBadge(badge: number) {
  let hasPermission

  try {
    hasPermission = await firebase.messaging().hasPermission()
  } catch (error) {
    if (__DEV__) alert(`Failed to check notifications permission. ${error}`)
  }

  if (!hasPermission) {
    try {
      await firebase.messaging().requestPermission()
      hasPermission = await firebase.messaging().hasPermission()
    } catch (error) {
      if (__DEV__) alert(`Failed to get notifications permission. ${error}`)
    }
  }

  if (!hasPermission) {
    if (__DEV__) alert('Failed to get permission to set the badge.')
    return
  }

  firebase.notifications().setBadge(badge)
  return hasPermission
}
*/
