import { ExtractParamsFromActivityMethod } from '.'
import { octokit } from '../libs/github'

export interface NotificationParams {
  all?: boolean
}

export interface NotificationColumn {
  type: 'notifications'
  subtype?: undefined
  params: NotificationParams
}

export type ActivityColumn = {
  type: 'activity'
} & (
  | {
      subtype: 'ORG_PUBLIC_EVENTS'
      params: ExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForOrg
      >
    }
  | {
      subtype: 'PUBLIC_EVENTS'
      params: ExtractParamsFromActivityMethod<typeof octokit.activity.getEvents>
    }
  | {
      subtype: 'REPO_EVENTS'
      params: ExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForRepo
      >
    }
  | {
      subtype: 'REPO_NETWORK_EVENTS'
      params: ExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForRepoNetwork
      >
    }
  | {
      subtype: 'USER_EVENTS'
      params: ExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForUser
      >
    }
  | {
      subtype: 'USER_ORG_EVENTS'
      params: ExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForUserOrg
      >
    }
  | {
      subtype: 'USER_PUBLIC_EVENTS'
      params: ExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsForUserPublic
      >
    }
  | {
      subtype: 'USER_RECEIVED_EVENTS'
      params: ExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsReceived
      >
    }
  | {
      subtype: 'USER_RECEIVED_PUBLIC_EVENTS'
      params: ExtractParamsFromActivityMethod<
        typeof octokit.activity.getEventsReceivedPublic
      >
    })

export type Column = NotificationColumn | ActivityColumn
