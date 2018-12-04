import { EnhancedGitHubNotification } from '../types'
import { fromGitHubRepository } from './repository'

export function fromGitHubNotification(
  notification: EnhancedGitHubNotification,
) {
  if (!(notification && notification.id)) return null

  return {
    id: notification.id,
    isUnread: notification.unread === true,
    reason: notification.reason || '',
    subject: {
      type: notification.subject.type || '',
      title: notification.subject.title || '',
      url: notification.subject.url || '',
      latestCommentURL: notification.subject.latest_comment_url || '',
    },
    payload: {
      repository:
        notification.repository &&
        fromGitHubRepository(notification.repository),
      comment: notification.comment, // TODO: modify fields
      commit: notification.commit, // TODO: modify fields
      issue: notification.issue, // TODO: modify fields
      pullRequest: notification.pullRequest, // TODO: modify fields
      release: notification.release, // TODO: modify fields
    },
    lastReadAt: notification.last_read_at || '',
    updatedAt: notification.updated_at || '',
  }
}
