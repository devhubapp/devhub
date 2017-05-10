// @flow

import GitHubAPI from 'github'

import { name as appName } from '../../package.json'

const PUBLIC_EVENTS: 'PUBLIC_EVENTS' = 'PUBLIC_EVENTS'
const REPO_EVENTS: 'REPO_EVENTS' = 'REPO_EVENTS'
const REPO_ISSUE_EVENTS: 'REPO_ISSUE_EVENTS' = 'REPO_ISSUE_EVENTS'
const REPO_NETWORK_PUBLIC_EVENTS: 'REPO_NETWORK_PUBLIC_EVENTS' =
  'REPO_NETWORK_PUBLIC_EVENTS'
const ORG_PUBLIC_EVENTS: 'ORG_PUBLIC_EVENTS' = 'ORG_PUBLIC_EVENTS'
const USER_RECEIVED_EVENTS: 'USER_RECEIVED_EVENTS' = 'USER_RECEIVED_EVENTS'
const USER_RECEIVED_PUBLIC_EVENTS: 'USER_RECEIVED_PUBLIC_EVENTS' =
  'USER_RECEIVED_PUBLIC_EVENTS'
const USER_EVENTS: 'USER_EVENTS' = 'USER_EVENTS'
const USER_PUBLIC_EVENTS: 'USER_PUBLIC_EVENTS' = 'USER_PUBLIC_EVENTS'
const USER_ORG_EVENTS: 'USER_ORG_EVENTS' = 'USER_ORG_EVENTS'
const NOTIFICATIONS: 'NOTIFICATIONS' = 'NOTIFICATIONS'
const MARK_ALL_NOTIFICATIONS_AS_READ: 'MARK_ALL_NOTIFICATIONS_AS_READ' =
  'MARK_ALL_NOTIFICATIONS_AS_READ'
const MARK_NOTIFICATION_THREAD_AS_READ: 'MARK_NOTIFICATION_THREAD_AS_READ' =
  'MARK_NOTIFICATION_THREAD_AS_READ'
const MARK_ALL_NOTIFICATIONS_AS_READ_FOR_REPO: 'MARK_ALL_NOTIFICATIONS_AS_READ_FOR_REPO' =
  'MARK_ALL_NOTIFICATIONS_AS_READ_FOR_REPO'

const github = new GitHubAPI({
  agent: appName,
  // debug: process.env.NODE_ENV !== 'production',
})

export const requestTypes = {
  PUBLIC_EVENTS,
  REPO_EVENTS,
  REPO_ISSUE_EVENTS,
  REPO_NETWORK_PUBLIC_EVENTS,
  ORG_PUBLIC_EVENTS,
  USER_RECEIVED_EVENTS,
  USER_RECEIVED_PUBLIC_EVENTS,
  USER_EVENTS,
  USER_PUBLIC_EVENTS,
  USER_ORG_EVENTS,
  NOTIFICATIONS,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATION_THREAD_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ_FOR_REPO,
}

export type ApiRequestType =
  | typeof PUBLIC_EVENTS
  | typeof REPO_EVENTS
  | typeof REPO_ISSUE_EVENTS
  | typeof REPO_NETWORK_PUBLIC_EVENTS
  | typeof ORG_PUBLIC_EVENTS
  | typeof USER_RECEIVED_EVENTS
  | typeof USER_RECEIVED_PUBLIC_EVENTS
  | typeof USER_EVENTS
  | typeof USER_PUBLIC_EVENTS
  | typeof USER_ORG_EVENTS
  | typeof NOTIFICATIONS
  | typeof MARK_ALL_NOTIFICATIONS_AS_READ
  | typeof MARK_NOTIFICATION_THREAD_AS_READ
  | typeof MARK_ALL_NOTIFICATIONS_AS_READ_FOR_REPO

export function authenticate(token: string) {
  if (!token) return false

  try {
    github.authenticate({
      type: 'oauth',
      token,
    })

    return true
  } catch (e) {
    return false
  }
}

export function getRequestTypeIcon(type: ApiRequestType) {
  switch (type) {
    case requestTypes.PUBLIC_EVENTS:
      return 'home'
    case requestTypes.REPO_EVENTS:
      return 'repo'
    case requestTypes.REPO_ISSUE_EVENTS:
      return 'issue-opened'
    case requestTypes.REPO_NETWORK_PUBLIC_EVENTS:
      return 'repo'
    case requestTypes.ORG_PUBLIC_EVENTS:
      return 'organization'
    case requestTypes.USER_RECEIVED_EVENTS:
      return 'home'
    case requestTypes.USER_RECEIVED_PUBLIC_EVENTS:
      return 'home'
    case requestTypes.USER_EVENTS:
      return 'person'
    case requestTypes.USER_PUBLIC_EVENTS:
      return 'person'
    case requestTypes.USER_ORG_EVENTS:
      return 'organization'
    default:
      if (__DEV__) console.error(`No api method configured for type '${type}'`)
      return 'mark-github'
  }
}

export function getUniquePath(
  type: ApiRequestType,
  { org, owner, repo, username }: Object = {},
) {
  return (() => {
    switch (type) {
      case requestTypes.PUBLIC_EVENTS:
        return '/events'

      case requestTypes.REPO_EVENTS:
        if (!(owner && repo)) throw new Error('Required params: owner, repo')
        return `/repos/${owner}/${repo}/events`

      case requestTypes.REPO_ISSUE_EVENTS:
        if (!(owner && repo)) throw new Error('Required params: owner, repo')
        return `/repos/${owner}/${repo}/issues/events`

      case requestTypes.REPO_NETWORK_PUBLIC_EVENTS:
        if (!(owner && repo)) throw new Error('Required params: owner, repo')
        return `/networks/${owner}/${repo}/events`

      case requestTypes.ORG_PUBLIC_EVENTS:
        if (!org) throw new Error('Required params: org')
        return `/orgs/${org}/events`

      case requestTypes.USER_RECEIVED_EVENTS:
        if (!username) throw new Error('Required params: username')
        return `/users/${username}/received_events`

      case requestTypes.USER_RECEIVED_PUBLIC_EVENTS:
        if (!username) throw new Error('Required params: username')
        return `/users/${username}/received_events/public`

      case requestTypes.USER_EVENTS:
        if (!username) throw new Error('Required params: username')
        return `/users/${username}/events`

      case requestTypes.USER_PUBLIC_EVENTS:
        if (!username) throw new Error('Required params: username')
        return `/users/${username}/events/public`

      case requestTypes.USER_ORG_EVENTS:
        if (!(username && org))
          throw new Error('Required params: username, org')
        return `/users/${username}/events/orgs/${org}`

      case requestTypes.NOTIFICATIONS:
        return '/notifications'

      default:
        throw new Error(`No path configured for type '${type}'`)
    }
  })().toLowerCase()
}

export function getApiMethod(type: ApiRequestType) {
  switch (type) {
    case requestTypes.PUBLIC_EVENTS:
      return github.activity.getEvents

    case requestTypes.REPO_EVENTS:
      return github.activity.getEventsForRepo

    case requestTypes.REPO_ISSUE_EVENTS:
      return github.activity.getEventsForRepoIssues

    case requestTypes.REPO_NETWORK_PUBLIC_EVENTS:
      return github.activity.getEventsForRepoNetwork

    case requestTypes.ORG_PUBLIC_EVENTS:
      return github.activity.getEventsForOrg

    case requestTypes.USER_RECEIVED_EVENTS:
      return github.activity.getEventsReceived

    case requestTypes.USER_RECEIVED_PUBLIC_EVENTS:
      return github.activity.getEventsReceivedPublic

    case requestTypes.USER_EVENTS:
      return github.activity.getEventsForUser

    case requestTypes.USER_PUBLIC_EVENTS:
      return github.activity.getEventsForUserPublic

    case requestTypes.USER_ORG_EVENTS:
      return github.activity.getEventsForUserOrg

    case requestTypes.NOTIFICATIONS:
      return github.activity.getNotifications

    case requestTypes.MARK_ALL_NOTIFICATIONS_AS_READ:
      return github.activity.markNotificationsAsRead

    case requestTypes.MARK_NOTIFICATION_THREAD_AS_READ:
      return github.activity.markNotificationThreadAsRead

    case requestTypes.MARK_ALL_NOTIFICATIONS_AS_READ_FOR_REPO:
      return github.activity.markNotificationsAsReadForRepo

    default:
      throw new Error(`No api method configured for type '${type}'`)
  }
}

export function fetch(type: ApiRequestType) {
  const method = getApiMethod(type)
  return method()
}

export default github
