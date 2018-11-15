import * as colors from '../../../styles/colors'
import { GitHubNotificationReason } from '../../../types'
import { capitalize } from '../shared'

export function getNotificationReasonTextsAndColor<
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

    default:
      return {
        reason,
        color: colors.gray,
        description: '',
        label: capitalize(reason),
      }
  }
}
