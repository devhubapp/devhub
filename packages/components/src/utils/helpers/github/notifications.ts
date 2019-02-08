import _ from 'lodash'

import {
  capitalize,
  EnhancedGitHubNotification,
  GitHubNotificationReason,
  sortNotifications,
} from '@devhub/core'
import * as colors from '../../../styles/colors'

export const notificationReasons: GitHubNotificationReason[] = [
  'assign',
  'author',
  'comment',
  'invitation',
  'manual',
  'mention',
  'review_requested',
  'security_alert',
  'state_change',
  'subscribed',
  'team_mention',
]

export function getNotificationReasonMetadata<
  T extends GitHubNotificationReason
>(
  reason: T,
): {
  color: string
  reason: T
  label: string
  description: string
} {
  switch (reason) {
    case 'assign':
      return {
        reason,
        color: colors.pink,
        description: 'You were assigned to this thread',
        label: 'Assigned',
      }

    case 'author':
      return {
        reason,
        color: colors.lightRed,
        description: 'You created this thread',
        label: 'Author',
      }

    case 'comment':
      return {
        reason,
        color: colors.blue,
        description: 'You commented on the thread',
        label: 'Commented',
      }

    case 'invitation':
      return {
        reason,
        color: colors.brown,
        description:
          'You accepted an invitation to contribute to the repository',
        label: 'Invited',
      }

    case 'manual':
      return {
        reason,
        color: colors.teal,
        description: 'You subscribed to the thread',
        label: 'Subscribed',
      }

    case 'mention':
      return {
        reason,
        color: colors.orange,
        description: 'You were @mentioned',
        label: 'Mentioned',
      }

    case 'state_change':
      return {
        reason,
        color: colors.purple,
        description: 'You changed the thread state',
        label: 'State changed',
      }

    case 'subscribed':
      return {
        reason,
        color: colors.blueGray,
        description: "You're watching this repository",
        label: 'Watching',
      }

    case 'team_mention':
      return {
        reason,
        color: colors.yellow,
        description: 'Your team was mentioned',
        label: 'Team mentioned',
      }

    case 'review_requested':
      return {
        reason,
        color: colors.yellow,
        description: 'Someone requested you a review',
        label: 'Review requested',
      }

    case 'security_alert':
      return {
        reason,
        color: colors.red,
        description: 'Potential security vulnerability found',
        label: 'Security',
      }

    default:
      return {
        reason,
        color: colors.gray,
        description: '',
        label: capitalize(reason),
      }
  }
}

export function mergeNotificationsPreservingEnhancement(
  newItems: EnhancedGitHubNotification[],
  prevItems: EnhancedGitHubNotification[],
) {
  return sortNotifications(
    _.uniqBy(_.concat(newItems, prevItems), 'id').map(item => {
      const newItem = newItems.find(i => i.id === item.id)
      const existingItem = prevItems.find(i => i.id === item.id)
      if (!(newItem && existingItem)) return item

      return {
        forceUnreadLocally: existingItem.forceUnreadLocally,
        last_read_at: existingItem.last_read_at,
        last_unread_at: existingItem.last_unread_at,
        saved: existingItem.saved,
        unread: existingItem.unread,
        ...newItem,
      }
    }),
  )
}
