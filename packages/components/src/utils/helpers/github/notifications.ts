import _ from 'lodash'

import {
  capitalize,
  EnhancedGitHubNotification,
  GitHubIcon,
  GitHubIssue,
  GitHubIssueOrPullRequest,
  GitHubNotification,
  GitHubNotificationReason,
  GitHubNotificationSubjectType,
  GitHubPullRequest,
  sortNotifications,
} from '@devhub/core'
import { bugsnag } from '../../../libs/bugsnag'
import * as colors from '../../../styles/colors'
import {
  getCommitIconAndColor,
  getIssueIconAndColor,
  getPullRequestIconAndColor,
  getReleaseIconAndColor,
} from './shared'

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

export const notificationSubjectTypes: GitHubNotificationSubjectType[] = [
  'Commit',
  'Issue',
  'PullRequest',
  'Release',
  'RepositoryInvitation',
  'RepositoryVulnerabilityAlert',
]

export function getNotificationSubjectType(
  notification: GitHubNotification,
): GitHubNotificationSubjectType | null {
  if (!(notification && notification.subject && notification.subject.type))
    return null

  return notification.subject.type
}

export function getNotificationIconAndColor(
  notification: GitHubNotification,
  payload?: GitHubIssueOrPullRequest | undefined,
): { icon: GitHubIcon; color?: string } {
  const { subject } = notification
  const { type } = subject

  switch (type) {
    case 'Commit':
      return getCommitIconAndColor()
    case 'Issue':
      return getIssueIconAndColor(payload as GitHubIssue)
    case 'PullRequest':
      return getPullRequestIconAndColor(payload as GitHubPullRequest)
    case 'Release':
      return getReleaseIconAndColor()
    case 'RepositoryInvitation':
      return { icon: 'mail', color: colors.brown }
    case 'RepositoryVulnerabilityAlert':
      return { icon: 'alert', color: colors.yellow }
    default: {
      const message = `Unknown event type: ${(event as any).type}`
      bugsnag.notify(new Error(message))
      console.error(message)
      return { icon: 'bell' }
    }
  }
}

export function getNotificationReasonMetadata<
  T extends GitHubNotificationReason
>(
  reason: T,
): {
  color: string
  reason: T
  label: string
  fullDescription: string
  smallDescription: string
} {
  switch (reason) {
    case 'assign':
      return {
        reason,
        color: colors.pink,
        fullDescription: 'You were assigned to this thread',
        smallDescription: 'You were assigned',
        label: 'Assigned',
      }

    case 'author':
      return {
        reason,
        color: colors.lightRed,
        fullDescription: 'You created this thread',
        smallDescription: 'You created',
        label: 'Author',
      }

    case 'comment':
      return {
        reason,
        color: colors.blue,
        fullDescription: 'You commented on the thread',
        smallDescription: 'You commented',
        label: 'Commented',
      }

    case 'invitation':
      return {
        reason,
        color: colors.brown,
        fullDescription:
          'You accepted an invitation to contribute to the repository',
        smallDescription: 'You were invited',
        label: 'Invited',
      }

    case 'manual':
      return {
        reason,
        color: colors.teal,
        fullDescription: 'You subscribed to the thread',
        smallDescription: 'You subscribed',
        label: 'Subscribed',
      }

    case 'mention':
      return {
        reason,
        color: colors.orange,
        fullDescription: 'You were @mentioned',
        smallDescription: 'You were mentioned',
        label: 'Mentioned',
      }

    case 'state_change':
      return {
        reason,
        color: colors.purple,
        fullDescription: 'You changed the thread state',
        smallDescription: 'You opened/closed',
        label: 'State changed',
      }

    case 'subscribed':
      return {
        reason,
        color: colors.blueGray,
        fullDescription: "You're watching this repository",
        smallDescription: 'You are watching',
        label: 'Watching',
      }

    case 'team_mention':
      return {
        reason,
        color: colors.yellow,
        fullDescription: 'Your team was mentioned',
        smallDescription: 'Team mentioned',
        label: 'Team mentioned',
      }

    case 'review_requested':
      return {
        reason,
        color: colors.yellow,
        fullDescription: 'Someone requested you a review',
        smallDescription: 'Review requested',
        label: 'Review requested',
      }

    case 'security_alert':
      return {
        reason,
        color: colors.red,
        fullDescription: 'Potential security vulnerability found',
        smallDescription: 'Security alert',
        label: 'Security',
      }

    default:
      return {
        reason,
        color: colors.gray,
        fullDescription: '',
        smallDescription: '',
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

      const mergedItem = {
        forceUnreadLocally: existingItem.forceUnreadLocally,
        last_read_at: existingItem.last_read_at,
        last_unread_at: existingItem.last_unread_at,
        saved: existingItem.saved,
        unread: existingItem.unread,
        ...newItem,
      }

      return _.isEqual(mergedItem, existingItem) ? existingItem : mergedItem
    }),
  )
}
