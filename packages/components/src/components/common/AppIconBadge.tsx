import React, {PushNotificationIOS} from 'react'
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
    if (__DEV__) Alert.alert(`Failed to check notifications permission. ${error}`)
  }

  if (!hasPermission) {
    try {
      await firebase.messaging().requestPermission()
      hasPermission = await firebase.messaging().hasPermission()
    } catch (error) {
      if (__DEV__) Alert.alert(`Failed to get notifications permission. ${error}`)
    }
  }

  if (!hasPermission) {
    if (__DEV__) Alert.alert('Failed to get permission to set the badge.')
    return
  }

  firebase.notifications().setBadge(badge)
  PushNotificationIOS.setApplicationIconBadgeNumber(badge);
  return hasPermission
}

