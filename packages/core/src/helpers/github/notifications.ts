import axios from 'axios'
import _ from 'lodash'

import {
  EnhancedGitHubNotification,
  EnhancementCache,
  getCommentIdFromUrl,
  getOwnerAndRepo,
  GitHubNotification,
  NotificationPayloadEnhancement,
} from '../..'

export async function getNotificationsEnhancementMap(
  notifications: EnhancedGitHubNotification[],
  {
    cache = new Map(),
    githubToken,
  }: {
    cache: EnhancementCache | undefined | undefined
    githubToken: string
  },
): Promise<Record<string, NotificationPayloadEnhancement>> {
  const promises = notifications.map(async notification => {
    if (!(notification.repository && notification.repository.full_name)) return

    const { owner, repo } = getOwnerAndRepo(notification.repository.full_name)
    if (!(owner && repo)) return

    const commentId = getCommentIdFromUrl(
      notification.subject.latest_comment_url,
    )

    const enhance: NotificationPayloadEnhancement = {}

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
        cache.set(notification.subject.url, { data, timestamp: Date.now() })
      } catch (error) {
        console.error(
          `Failed to load ${notification.subject.type} notification details`,
          error,
        )
        cache.set(notification.subject.url, false)
        return
      }
    } else if (hasSubjectCache) {
      if (subjectCache && subjectCache.data)
        enhance[subjectField] = subjectCache.data
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
      }
    } else if (!commentId) {
      enhance.comment = undefined
    } else if (hasCommentCache) {
      if (commentCache && commentCache.data) enhance.comment = commentCache.data
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
      ...enhanced,
      ...cen,
      ...enhance,
    } as EnhancedGitHubNotification
  })
}

export function getOlderNotificationDate(
  notifications: EnhancedGitHubNotification[],
) {
  const olderItem = _.orderBy(notifications, 'updated_at', 'asc')[0]
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
      checkAndFix(n.commit, n.commit.commit.url, n.commit.commit.committer.date)
    if (n.issue) checkAndFix(n.issue, n.issue.url, n.issue.updated_at)
    if (n.pullRequest)
      checkAndFix(n.pullRequest, n.pullRequest.url, n.pullRequest.updated_at)
    if (n.release) checkAndFix(n.release, n.release.url, n.release.published_at)
  })

  return cache
}
