import { fromGitHubRepository } from './repository'

export function fromGitHubNotification(notification: any) {
  if (!(notification && notification.id)) return null

  return {
    id: notification.id,
    isUnread: notification.unread === true,
    reason: notification.reason || '',
    subject: {
      type: notification.subject.type || '',
      title: notification.subject.title || '',
      url: notification.subject.url || '', // FIX
      latestCommentURL: notification.subject.latest_comment_url || '', // FIX
    },
    // TODO
    payload: {
      repository:
        notification.repository &&
        fromGitHubRepository(notification.repository),
      // comment: Comment
      // commit: Commit
      // issue: Issue
      // pullRequest: PullRequest
      // release: Release
    },
    lastReadAt: notification.last_read_at || '',
    updatedAt: notification.updated_at || '',
  }
}
