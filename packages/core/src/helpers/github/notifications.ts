import axios from 'axios'
import _ from 'lodash'

import {
  EnhancedGitHubNotification,
  EnhancementCache,
  GitHubNotification,
  NotificationPayloadEnhancement,
} from '../../types'
import { getOwnerAndRepo } from './shared'
import { getCommentIdFromUrl } from './url'

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

    return { notificationId: notification.id, enhance }
  })

  const enhancements = await Promise.all(promises)

  const enhancementMap: any = enhancements.reduce(
    (map, payload) =>
      payload
        ? {
            ...map,
            [payload.notificationId]: payload.enhance,
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
  return notifications.map(cen => {
    const enhanced = currentEnhancedNotifications.find(n => n.id === cen.id)

    const enhance = enhancementMap[cen.id]
    if (!enhance) {
      if (!enhanced) return cen
      return { ...enhanced, ...cen }
    }

    return {
      ..._.pick(enhanced, [
        'comment',
        'commit',
        'issue',
        'pullRequest',
        'release',
        'enhanced',
      ]),
      ...cen,
      ...enhance,
    } as EnhancedGitHubNotification
  })
}

export function getOlderNotificationDate(
  notifications: EnhancedGitHubNotification[],
) {
  const olderItem = sortNotifications(notifications).pop()
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
  if (!notifications) return []

  return _(notifications)
    .uniqBy('id')
    .orderBy('updated_at', 'desc')
    .value()
}
