import axios from 'axios'
import {
  EnhancedGitHubNotification,
  getCommentIdFromUrl,
  getOwnerAndRepo,
  GitHubNotification,
  NotificationEnhancement,
} from '../..'

const payloadUrlCache = new Map()

export async function fetchNotificationsEnhancements(
  notifications: GitHubNotification[],
  { githubToken }: { githubToken: string },
): Promise<Record<string, NotificationEnhancement>> {
  const promises = notifications.map(async notification => {
    if (!(notification.repository && notification.repository.full_name)) return

    const { owner, repo } = getOwnerAndRepo(notification.repository.full_name)
    if (!(owner && repo)) return

    const commentId = getCommentIdFromUrl(
      notification.subject.latest_comment_url,
    )

    const enhance: NotificationEnhancement = {}

    if (
      !payloadUrlCache.get(notification.subject.url) ||
      (notification.updated_at &&
        new Date(notification.updated_at).valueOf() >
          payloadUrlCache.get(notification.subject.url))
    ) {
      try {
        const field = (notification.subject.type[0].toLowerCase() +
          notification.subject.type.substr(1)) as keyof NotificationEnhancement

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

        enhance[field] = data
        payloadUrlCache.set(notification.subject.url, Date.now())
      } catch (error) {
        console.error(
          `Failed to load ${notification.subject.type} notification details`,
          error,
        )
        payloadUrlCache.set(notification.subject.url, false)
        return
      }
    }

    if (
      commentId &&
      !payloadUrlCache.get(notification.subject.latest_comment_url)
    ) {
      try {
        const { data } = await axios.get(
          `${
            notification.subject.latest_comment_url
          }?access_token=${githubToken}`,
        )
        if (!(data && data.id)) throw new Error('Invalid response')

        enhance.comment = data
        payloadUrlCache.set(notification.subject.latest_comment_url, Date.now())
      } catch (error) {
        console.error(
          `Failed to load ${notification.subject.type} comment details`,
          error,
        )
        payloadUrlCache.set(notification.subject.latest_comment_url, false)
      }
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
