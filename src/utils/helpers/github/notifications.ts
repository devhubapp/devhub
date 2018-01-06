import * as baseTheme from '../../../styles/themes/base'

import { IBaseTheme, IGitHubNotification } from '../../../types'
import { capitalize } from '../shared'

export function getNotificationReasonTextsAndColor(
  notification: IGitHubNotification,
  theme: IBaseTheme | undefined = baseTheme,
): { color: string; reason: string; label: string; description: string } {
  const { reason }: IGitHubNotification = notification

  switch (reason) {
    case 'assign':
      return {
        reason,
        color: theme.pink,
        description: 'You were assigned to this thread',
        label: 'Assigned',
      }

    case 'author':
      return {
        reason,
        color: theme.lightRed,
        description: 'You created this thread',
        label: 'Author',
      }

    case 'comment':
      return {
        reason,
        color: theme.blue,
        description: 'You commented on the thread',
        label: 'Commented',
      }

    case 'invitation':
      return {
        reason,
        color: theme.brown,
        description:
          'You accepted an invitation to contribute to the repository',
        label: 'Invited',
      }

    case 'manual':
      return {
        reason,
        color: theme.teal,
        description: 'You subscribed to the thread',
        label: 'Subscribed',
      }

    case 'mention':
      return {
        reason,
        color: theme.orange,
        description: 'You were @mentioned',
        label: 'Mentioned',
      }

    case 'state_change':
      return {
        reason,
        color: theme.purple,
        description: 'You changed the thread state',
        label: 'State changed',
      }

    case 'subscribed':
      return {
        reason,
        color: theme.blueGray,
        description: "You're watching this repository",
        label: 'Watching',
      }

    case 'team_mention':
      return {
        reason,
        color: theme.yellow,
        description: 'Your team was mentioned',
        label: 'Team mentioned',
      }

    case 'review_requested':
      return {
        reason,
        color: theme.yellow,
        description: 'Someone requested you a review',
        label: 'Review requested',
      }

    default:
      return {
        reason,
        color: theme.gray,
        description: '',
        label: capitalize(reason),
      }
  }
}
