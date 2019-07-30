import axios from 'axios'
import immer from 'immer'
import _ from 'lodash'

import {
  EnhancedGitHubNotification,
  EnhancementCache,
  GitHubIcon,
  GitHubIssue,
  GitHubIssueOrPullRequest,
  GitHubLabel,
  GitHubNotification,
  GitHubNotificationReason,
  GitHubNotificationSubjectType,
  GitHubPullRequest,
  NotificationPayloadEnhancement,
  ThemeColors,
} from '../../types'
import { constants } from '../../utils'
import { capitalize, isNotificationPrivate } from '../shared'
import {
  getCommitIconAndColor,
  getIssueIconAndColor,
  getItemIsBot,
  getOwnerAndRepo,
  getPullRequestIconAndColor,
  getReleaseIconAndColor,
  isItemRead,
} from './shared'
import { getCommentIdFromUrl, getIssueOrPullRequestNumberFromUrl } from './url'

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
  payload: GitHubIssueOrPullRequest | undefined,
): { icon: GitHubIcon; color?: keyof ThemeColors; tooltip: string } {
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
      return {
        icon: 'mail',
        color: 'brown',
        tooltip: 'Repository invitation',
      }
    case 'RepositoryVulnerabilityAlert':
      return {
        icon: 'alert',
        color: 'yellow',
        tooltip: 'Repository vulnerability alert',
      }
    default: {
      const message = `Unknown notification subject type: ${type}`
      console.error(message)
      return { icon: 'bell', tooltip: '' }
    }
  }
}

export function getNotificationReasonMetadata<
  T extends GitHubNotificationReason
>(
  reason: T,
): {
  color: keyof ThemeColors
  reason: T
  label: string
  fullDescription: string
  // smallDescription: string
} {
  switch (reason) {
    case 'assign':
      return {
        reason,
        color: 'pink',
        fullDescription: 'You were assigned to the thread',
        // smallDescription: 'You were assigned',
        label: 'Assigned',
      }

    case 'author':
      return {
        reason,
        color: 'lightRed',
        fullDescription: 'You created the thread',
        // smallDescription: 'You created',
        label: 'Author',
      }

    case 'comment':
      return {
        reason,
        color: 'blue',
        fullDescription: 'You commented on the thread',
        // smallDescription: 'You commented',
        label: 'Commented',
      }

    case 'invitation':
      return {
        reason,
        color: 'brown',
        fullDescription:
          'You accepted an invitation to contribute to the repository',
        // smallDescription: 'You were invited',
        label: 'Invited',
      }

    case 'manual':
      return {
        reason,
        color: 'teal',
        fullDescription: 'You manually subscribed to the thread',
        // smallDescription: 'You subscribed manually',
        label: 'Manual',
      }

    case 'mention':
      return {
        reason,
        color: 'orange',
        fullDescription: 'You were @mentioned in the thread',
        // smallDescription: 'You were mentioned',
        label: 'Mentioned',
      }

    case 'state_change':
      return {
        reason,
        color: 'purple',
        fullDescription: 'You opened or closed the issue/pr',
        // smallDescription: 'You opened/closed',
        label: 'State changed',
      }

    case 'subscribed':
      return {
        reason,
        color: 'blueGray',
        fullDescription: "You're watching the repository",
        // smallDescription: 'You are watching',
        label: 'Watching',
      }

    case 'team_mention':
      return {
        reason,
        color: 'yellow',
        fullDescription: 'Your team was mentioned in the thread',
        // smallDescription: 'Team mentioned',
        label: 'Team mentioned',
      }

    case 'review_requested':
      return {
        reason,
        color: 'yellow',
        fullDescription: 'Someone requested your review in the pull request',
        // smallDescription: 'Review requested',
        label: 'Review requested',
      }

    case 'security_alert':
      return {
        reason,
        color: 'red',
        fullDescription: 'Potential security vulnerability found',
        // smallDescription: 'Security alert',
        label: 'Security',
      }

    default:
      return {
        reason,
        color: 'gray',
        fullDescription: '',
        // smallDescription: '',
        label: capitalize(reason),
      }
  }
}

export function mergeNotificationsPreservingEnhancement(
  newItems: EnhancedGitHubNotification[],
  prevItems: EnhancedGitHubNotification[],
  { dropPrevItems }: { dropPrevItems?: boolean } = {},
) {
  const allItems = dropPrevItems
    ? newItems || []
    : _.concat(newItems || [], prevItems || [])

  return sortNotifications(
    _.uniqBy(allItems, 'id').map(item => {
      const newItem = newItems.find(i => i.id === item.id)
      const existingItem = prevItems.find(i => i.id === item.id)

      return mergeNotificationPreservingEnhancement(newItem!, existingItem)
    }),
  )
}

export function mergeNotificationPreservingEnhancement(
  newItem: EnhancedGitHubNotification,
  existingItem: EnhancedGitHubNotification | undefined,
) {
  if (!(newItem && existingItem)) return newItem || existingItem

  const lastReadAt = _.max([existingItem.last_read_at, newItem.last_read_at])
  const lastUnreadAt = _.max([
    existingItem.last_unread_at,
    newItem.last_unread_at,
  ])

  const latestDate = _.max([lastReadAt, lastUnreadAt, newItem.updated_at])

  const preEnhancements: Record<
    keyof Omit<EnhancedGitHubNotification, keyof GitHubNotification>,
    any
  > = {
    comment: existingItem.comment,
    commit: existingItem.commit,
    enhanced: existingItem.enhanced,
    forceUnreadLocally:
      existingItem.forceUnreadLocally &&
      latestDate &&
      latestDate === newItem.updated_at
        ? newItem.unread
        : existingItem.forceUnreadLocally,
    issue: existingItem.issue,
    last_unread_at: lastUnreadAt,
    pullRequest: existingItem.pullRequest,
    release: existingItem.release,
    saved: existingItem.saved,
  }

  const postEnhancements = {
    forceUnreadLocally: preEnhancements.forceUnreadLocally,
    last_read_at: lastReadAt,
    last_unread_at: preEnhancements.last_unread_at,
    updated_at: _.max([existingItem.updated_at, newItem.updated_at])!,
  }

  return immer(newItem, draft => {
    Object.entries(preEnhancements).forEach(([key, value]) => {
      if (typeof value === 'undefined') return
      if (value === (draft as any)[key]) return
      if (typeof (draft as any)[key] !== 'undefined') return
      ;(draft as any)[key] = value
    })

    Object.entries(postEnhancements).forEach(([key, value]) => {
      if (typeof value === 'undefined') return
      if (value === (draft as any)[key]) return
      ;(draft as any)[key] = value
    })
  })
}

export async function getNotificationsEnhancementMap(
  notifications: EnhancedGitHubNotification[],
  {
    cache = new Map(),
    getGitHubInstallationTokenForRepo,
    githubOAuthToken,
  }: {
    cache: EnhancementCache | undefined | undefined
    getGitHubInstallationTokenForRepo: (
      owner: string | undefined,
      repo: string | undefined,
    ) => string | undefined
    githubOAuthToken: string
  },
): Promise<Record<string, NotificationPayloadEnhancement>> {
  const promises = notifications.map(async notification => {
    if (!(notification.repository && notification.repository.full_name)) return

    const { owner, repo } = getOwnerAndRepo(notification.repository.full_name)
    if (!(owner && repo)) return

    const installationToken = getGitHubInstallationTokenForRepo(owner, repo)
    const githubToken = installationToken || githubOAuthToken

    const commentId = getCommentIdFromUrl(
      notification.subject.latest_comment_url,
    )

    const enhance: NotificationPayloadEnhancement = {}

    const isPrivate = notification.repository.private
    const hasAccess = !isPrivate || !!installationToken
    if (!hasAccess) return

    const hasSubjectCache = cache.has(notification.subject.url)
    const hasCommentCache = cache.has(notification.subject.latest_comment_url)

    const subjectCache = cache.get(notification.subject.url)
    const commentCache = cache.get(notification.subject.latest_comment_url)

    const subjectField = (notification.subject.type[0].toLowerCase() +
      notification.subject.type.substr(
        1,
      )) as keyof NotificationPayloadEnhancement

    if (
      !hasSubjectCache ||
      (subjectCache &&
        notification.updated_at &&
        new Date(notification.updated_at).valueOf() > subjectCache.timestamp)
    ) {
      try {
        const { data } = await axios.get(
          `${notification.subject.url}?access_token=${githubToken}`,
        )
        if (
          !(
            data &&
            (notification.subject.type === 'Commit' ? data.sha : data.id)
          )
        )
          throw new Error('Invalid response')

        enhance[subjectField] = data
        enhance.enhanced = true
        cache.set(notification.subject.url, { data, timestamp: Date.now() })
      } catch (error) {
        console.error(
          `Failed to load ${notification.subject.type} notification details`,
          error,
        )
        cache.set(notification.subject.url, false)
        if (!enhance.enhanced) enhance.enhanced = false
        return
      }
    } else if (hasSubjectCache) {
      if (subjectCache && subjectCache.data) {
        enhance[subjectField] = subjectCache.data
        enhance.enhanced = true
      } else if (!enhance.enhanced) enhance.enhanced = false
    }

    if (commentId && !hasCommentCache) {
      try {
        const { data } = await axios.get(
          `${
            notification.subject.latest_comment_url
          }?access_token=${githubToken}`,
        )
        if (!(data && data.id)) throw new Error('Invalid response')

        enhance.comment = data
        enhance.enhanced = true
        cache.set(notification.subject.latest_comment_url, {
          data,
          timestamp: Date.now(),
        })
      } catch (error) {
        console.error(
          `Failed to load ${notification.subject.type} comment details`,
          error,
        )
        cache.set(notification.subject.latest_comment_url, false)
        if (!enhance.enhanced) enhance.enhanced = false
      }
    } else if (!commentId) {
      enhance.comment = undefined
    } else if (hasCommentCache) {
      if (commentCache && commentCache.data) {
        enhance.comment = commentCache.data
        enhance.enhanced = true
      } else if (!enhance.enhanced) enhance.enhanced = false
    }

    if (!Object.keys(enhance).length) return

    return { id: notification.id, enhance }
  })

  const enhancements = await Promise.all(promises)

  const enhancementMap: any = enhancements.reduce(
    (map, payload) =>
      payload
        ? {
            ...map,
            [payload.id]: payload.enhance,
          }
        : map,
    {},
  )

  return enhancementMap
}

export function enhanceNotifications(
  notifications: Array<GitHubNotification | EnhancedGitHubNotification>,
  enhancementMap: Record<string, NotificationPayloadEnhancement>,
  currentEnhancedNotifications: EnhancedGitHubNotification[] = [],
) {
  if (!(notifications && notifications.length)) return constants.EMPTY_ARRAY

  return notifications.map(item => {
    const enhanced = currentEnhancedNotifications.find(n => n.id === item.id)

    const enhance = enhancementMap[item.id]
    if (!enhance) {
      if (!enhanced) return item
      return mergeNotificationPreservingEnhancement(item, enhanced)
    }

    return {
      ...mergeNotificationPreservingEnhancement(item, enhanced),
      ...enhance,
    } as EnhancedGitHubNotification
  })
}

export function getOlderNotificationDate(
  notifications: EnhancedGitHubNotification[],
) {
  const olderItem = sortNotifications(notifications).slice(-1)[0]
  return olderItem && olderItem.updated_at
}

export function createNotificationsCache(
  notifications: EnhancedGitHubNotification[] | undefined,
  _cache?: EnhancementCache | undefined,
): EnhancementCache {
  const cache = _cache || new Map()

  if (!(notifications && notifications.length)) return cache

  const checkAndFix = (data: any, url: string, date: string) => {
    if (!cache.has(url)) {
      cache.set(url, { data, timestamp: new Date(date).valueOf() })
    }
  }

  notifications.forEach(n => {
    if (n.comment) checkAndFix(n.comment, n.comment.url, n.comment.updated_at)
    if (n.commit)
      checkAndFix(n.commit, n.commit.url, n.commit.commit.committer.date)
    if (n.issue) checkAndFix(n.issue, n.issue.url, n.issue.updated_at)
    if (n.pullRequest)
      checkAndFix(n.pullRequest, n.pullRequest.url, n.pullRequest.updated_at)
    if (n.release) checkAndFix(n.release, n.release.url, n.release.published_at)
  })

  return cache
}

export function sortNotifications(
  notifications: EnhancedGitHubNotification[] | undefined,
) {
  if (!(notifications && notifications.length)) return constants.EMPTY_ARRAY

  return _(notifications)
    .uniqBy('id')
    .orderBy('updated_at', 'desc')
    .value()
}

export function getGitHubNotificationSubItems(
  notification: EnhancedGitHubNotification,
) {
  const {
    comment,
    id,
    repository: repo,
    saved,
    subject,
    updated_at: updatedAt,
  } = notification

  const isRead = isItemRead(notification)
  const isSaved = saved === true
  const isPrivate = isNotificationPrivate(notification)

  const isPrivateAndCantSee =
    isPrivate &&
    // !hasPrivateAccess &&
    !notification.enhanced

  const commit =
    notification.commit ||
    (subject.type === 'Commit' && {
      author: { avatar_url: '', login: '', html_url: '' },
      commit: {
        author: {
          name: '',
          email: '',
        },
        message: subject.title,
        url: subject.url,
        comment_count: undefined,
      },
      url: subject.url,
    }) ||
    null

  const issue =
    notification.issue ||
    (subject.type === 'Issue' && {
      id: undefined,
      body: undefined,
      comments: undefined,
      created_at: undefined,
      labels: [] as GitHubLabel[],
      number: getIssueOrPullRequestNumberFromUrl(
        subject.url || subject.latest_comment_url,
      ),
      state: undefined,
      title: subject.title,
      url: subject.url || subject.latest_comment_url,
      html_url: '',
      user: { avatar_url: '', login: '', html_url: '' },
    }) ||
    null

  const pullRequest =
    notification.pullRequest ||
    (subject.type === 'PullRequest' && {
      id: undefined,
      body: undefined,
      created_at: undefined,
      comments: undefined,
      labels: [] as GitHubLabel[],
      draft: false,
      number: getIssueOrPullRequestNumberFromUrl(
        subject.url || subject.latest_comment_url,
      ),
      state: undefined,
      title: subject.title,
      url: subject.url || subject.latest_comment_url,
      html_url: '',
      user: { avatar_url: '', login: '', html_url: '' },
    }) ||
    undefined

  const release =
    notification.release ||
    (subject.type === 'Release' && {
      id: undefined,
      author: { avatar_url: '', login: '', html_url: '' },
      body: '',
      created_at: undefined,
      name: subject.title,
      tag_name: '',
      url: subject.url || subject.latest_comment_url,
    }) ||
    undefined

  const issueOrPullRequest = issue || pullRequest
  const createdAt = issueOrPullRequest && issueOrPullRequest.created_at

  const isRepoInvitation = subject.type === 'RepositoryInvitation'
  const isVulnerabilityAlert = subject.type === 'RepositoryVulnerabilityAlert'

  const issueOrPullRequestNumber = issueOrPullRequest
    ? issueOrPullRequest.number ||
      getIssueOrPullRequestNumberFromUrl(
        issueOrPullRequest.html_url || issueOrPullRequest.url,
      )
    : undefined

  const repoFullName =
    (notification &&
      (notification.repository.full_name || notification.repository.name)) ||
    ''

  const isBot = getItemIsBot('notifications', notification)

  return {
    comment,
    commit,
    createdAt,
    id,
    isBot,
    isPrivate,
    isPrivateAndCantSee,
    isRead,
    isRepoInvitation,
    isSaved,
    isVulnerabilityAlert,
    issueOrPullRequest,
    issueOrPullRequestNumber,
    release,
    repo,
    repoFullName,
    subject,
    updatedAt,
  }
}
