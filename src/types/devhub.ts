import { GitHubExtractParamsFromActivityMethod } from '.'
import { octokit } from '../libs/github'

export interface NotificationParams {
  all?: boolean
}

export interface NotificationColumn {
  id: string
  type: 'notifications'
  subtype?: undefined
  params: NotificationParams
}

export type ActivityColumn = {
  id: string
  type: 'activity'
} & (
  | {
      subtype: 'ORG_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForOrg
      >
    }
  | {
      subtype: 'PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        typeof octokit.activity.getEvents
      >
    }
  | {
      subtype: 'REPO_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForRepo
      >
    }
  | {
      subtype: 'REPO_NETWORK_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForRepoNetwork
      >
    }
  | {
      subtype: 'USER_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForUser
      >
    }
  | {
      subtype: 'USER_ORG_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForUserOrg
      >
    }
  | {
      subtype: 'USER_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForUserPublic
      >
    }
  | {
      subtype: 'USER_RECEIVED_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsReceived
      >
    }
  | {
      subtype: 'USER_RECEIVED_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsReceivedPublic
      >
    })

export type Column = NotificationColumn | ActivityColumn

export type Modal = 'SETTINGS'
