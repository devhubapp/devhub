import {
  EnhancedGitHubNotification,
  getCommentIdFromUrl,
  getCommitShaFromUrl,
  getIssueOrPullRequestNumberFromUrl,
  getOwnerAndRepo,
  getReleaseIdFromUrl,
  GitHubComment,
  GitHubCommit,
  GitHubIssue,
  GitHubNotification,
  GitHubPullRequest,
  GitHubRelease,
  NotificationEnhancement,
} from '../..'

const enhancedCommitShas = new Map()
const enhancedCommentIds = new Map()
const enhancedIssueOrPullRequestIds = new Map()
const enhancedReleaseIds = new Map()

export async function fetchNotificationsEnhancements(
  notifications: GitHubNotification[],
  context: { githubToken: string; githubTokenType?: string },
  octokit: any,
): Promise<Record<string, NotificationEnhancement>> {
  const promises = notifications.map(async notification => {
    if (!(notification.repository && notification.repository.full_name)) return

    const { owner, repo } = getOwnerAndRepo(notification.repository.full_name)
    if (!(owner && repo)) return

    const commentId = getCommentIdFromUrl(
      notification.subject.latest_comment_url,
    )

    const enhance = {} as {
      comment?: GitHubComment
      commit?: GitHubCommit
      issue?: GitHubIssue
      pullRequest?: GitHubPullRequest
      release?: GitHubRelease
    }

    switch (notification.subject.type) {
      case 'Commit': {
        const sha = getCommitShaFromUrl(notification.subject.url)
        if (!sha) break

        if (!enhancedCommitShas.has(sha)) {
          try {
            enhancedCommitShas.set(sha, null)

            const { data } = await octokit.repos.getCommit({
              owner,
              repo,
              sha,
            })

            if (!(data && data.sha)) throw new Error('Invalid response')

            enhance.commit = (data as any) as GitHubCommit
            enhancedCommitShas.set(sha, true)
          } catch (error) {
            console.error('Failed to load Commit notification details', error)
            enhancedCommitShas.set(sha, false)
            break
          }
        }

        if (commentId && !enhancedCommentIds.has(commentId)) {
          try {
            const { data } = await octokit.repos.getCommitComment({
              owner,
              repo,
              comment_id: commentId,
            })

            if (!(data && data.id)) throw new Error('Invalid response')

            enhance.comment = (data as any) as GitHubComment
            enhancedCommentIds.set(commentId, true)
          } catch (error) {
            console.error(
              'Failed to load Commit Comment notification details',
              error,
            )
            enhancedCommentIds.set(commentId, false)
          }
        }

        break
      }

      case 'Issue':
      case 'PullRequest': {
        const issueOrPullRequestNumber = getIssueOrPullRequestNumberFromUrl(
          notification.subject.url,
        )
        if (!issueOrPullRequestNumber) break

        const fakeId = `${owner}/${repo}#${issueOrPullRequestNumber}`

        if (!enhancedIssueOrPullRequestIds.has(fakeId)) {
          try {
            enhancedIssueOrPullRequestIds.set(fakeId, null)

            if (notification.subject.type === 'PullRequest') {
              const { data } = await octokit.pulls.get({
                owner,
                repo,
                number: issueOrPullRequestNumber,
              })

              if (!(data && data.id)) throw new Error('Invalid response')

              enhance.pullRequest = (data as any) as GitHubPullRequest
            } else {
              const { data } = await octokit.issues.get({
                owner,
                repo,
                number: issueOrPullRequestNumber,
              })

              if (!(data && data.id)) throw new Error('Invalid response')

              enhance.issue = (data as any) as GitHubIssue
            }
            enhancedIssueOrPullRequestIds.set(fakeId, true)
          } catch (error) {
            console.error(
              `Failed to load ${
                notification.subject.type
              } notification details`,
              error,
            )
            enhancedIssueOrPullRequestIds.set(fakeId, false)
            break
          }
        }

        if (commentId && !enhancedCommentIds.has(commentId)) {
          try {
            enhancedCommentIds.set(commentId, null)

            if (notification.subject.latest_comment_url.includes('pulls')) {
              const { data } = await octokit.pulls.getComment({
                owner,
                repo,
                comment_id: commentId,
              })

              if (!(data && data.id)) throw new Error('Invalid response')

              enhance.comment = (data as any) as GitHubComment
            } else {
              const { data } = await octokit.issues.getComment({
                owner,
                repo,
                comment_id: commentId,
              })

              if (!(data && data.id)) throw new Error('Invalid response')

              enhance.comment = (data as any) as GitHubComment
            }

            enhancedCommentIds.set(commentId, true)
          } catch (error) {
            console.error('Failed to load Comment notification details', error)
            enhancedCommentIds.set(commentId, false)
          }
        }

        break
      }

      case 'Release': {
        const releaseId = getReleaseIdFromUrl(notification.subject.url)
        if (!releaseId) break

        if (!enhancedReleaseIds.has(releaseId)) {
          try {
            enhancedReleaseIds.set(releaseId, null)

            const { data } = await octokit.repos.getRelease({
              owner,
              repo,
              release_id: parseInt(releaseId, 10),
            })

            if (!(data && data.id)) throw new Error('Invalid response')

            enhance.release = (data as any) as GitHubRelease

            enhancedReleaseIds.set(releaseId, true)
          } catch (error) {
            console.error('Failed to load Release notification details', error)
            enhancedReleaseIds.set(releaseId, false)
            break
          }
        }

        break
      }

      default:
        break
    }

    if (!Object.keys(enhance).length) return

    return { notificationId: notification.id, enhance }
  })

  const enhancements = await Promise.all(promises)

  return enhancements.reduce(
    (map, payload) =>
      payload
        ? {
            ...map,
            [payload.notificationId]: payload.enhance,
          }
        : map,
    {},
  )
}

export function enhanceNotifications(
  notifications: GitHubNotification[],
  enhancementMap: Record<string, NotificationEnhancement>,
  currentEnhancedNotifications: EnhancedGitHubNotification[] = [],
) {
  return notifications.map(cen => {
    const enhanced = currentEnhancedNotifications.find(n => n.id === cen.id)

    const enhance = enhancementMap[cen.id]
    if (!enhance) {
      if (!enhanced) return cen
      return { ...enhanced, ...cen }
    }

    return {
      ...enhanced,
      ...cen,
      ...enhance,
    } as EnhancedGitHubNotification
  })
}
