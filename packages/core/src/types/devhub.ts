import Octokit from '@octokit/rest'

import {
  GitHubComment,
  GitHubCommit,
  GitHubEvent,
  GitHubExtractParamsFromActivityMethod,
  GitHubIcon,
  GitHubIssue,
  GitHubNotification,
  GitHubNotificationReason,
  GitHubPullRequest,
  GitHubRelease,
  GitHubRepo,
  GitHubWatchEvent,
} from './github'
import { Omit } from './typescript'

type octokit = InstanceType<typeof Octokit>

export interface SaveForLaterEnhancement {
  saved?: boolean
}

export interface NotificationPayloadEnhancement {
  comment?: GitHubComment
  commit?: GitHubCommit
  issue?: GitHubIssue
  pullRequest?: GitHubPullRequest
  release?: GitHubRelease
}

export interface EnhancedGitHubNotification
  extends GitHubNotification,
    NotificationPayloadEnhancement,
    SaveForLaterEnhancement {}

export interface GitHubEnhancedEventBase {
  merged: string[]
}

export interface MultipleStarEvent
  extends GitHubEnhancedEventBase,
    Omit<GitHubWatchEvent, 'type' | 'repo'> {
  type: 'WatchEvent:OneUserMultipleRepos'
  repos: GitHubRepo[]
}

export type EnhancedGitHubEvent = (GitHubEvent | MultipleStarEvent) &
  SaveForLaterEnhancement

export interface ColumnSubscriptionData<
  Item extends EnhancedGitHubNotification | EnhancedGitHubEvent
> {
  items?: Item[]
  loadState?: LoadState
  errorMessage?: string
  canFetchMore?: boolean
  lastFetchedAt?: string
}

export interface NotificationSubscription {
  id: string
  type: 'notifications'
  subtype?: undefined | ''
  params: {
    all?: boolean
  }
  data: ColumnSubscriptionData<EnhancedGitHubNotification>
  createdAt: string
  updatedAt: string
}

export type ActivitySubscription = {
  id: string
  type: 'activity'
  data: ColumnSubscriptionData<EnhancedGitHubEvent>
  createdAt: string
  updatedAt: string
} & (
  | {
      subtype: 'ORG_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['listEventsForOrg']
      >
    }
  | {
      subtype: 'PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['listPublicEvents']
      >
    }
  | {
      subtype: 'REPO_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['listRepoEvents']
      >
    }
  | {
      subtype: 'REPO_NETWORK_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['listPublicEventsForRepoNetwork']
      >
    }
  | {
      subtype: 'USER_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['listEventsForUser']
      >
    }
  | {
      subtype: 'USER_ORG_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['listEventsForOrg']
      >
    }
  | {
      subtype: 'USER_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['listPublicEventsForUser']
      >
    }
  | {
      subtype: 'USER_RECEIVED_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['listReceivedEventsForUser']
      >
    }
  | {
      subtype: 'USER_RECEIVED_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['listReceivedPublicEventsForUser']
      >
    })

export interface BaseColumnFilters {
  inbox?: {
    inbox?: boolean
    archived?: boolean
    saved?: boolean
  }
  clearedAt?: string
  // order?: Array<'asc' | 'desc'>
  // owners?: string[]
  private?: boolean
  // repos?: string[]
  // search: {
  //   exclude?: string
  //   match?: string
  //   regex?: string
  // }
  // sort?: string[]
}

export interface ActivityColumnFilters extends BaseColumnFilters {
  activity?: {
    types?: Partial<Record<GitHubEvent['type'], boolean>>
  }
}

export interface NotificationColumnFilters extends BaseColumnFilters {
  notifications?: {
    reasons?: Partial<Record<GitHubNotificationReason, boolean>>
  }
  unread?: boolean
}

export type ColumnFilters = ActivityColumnFilters | NotificationColumnFilters

// export interface ColumnOptions {
//   enableBadge?: boolean
//   enableNotifications?: boolean
// }

export type ColumnSubscription = ActivitySubscription | NotificationSubscription

export interface BaseColumn {
  id: string
  // title?: string // TODO
  // subtitle?: string // TODO
  subscriptionIds: string[]
  // options?: ColumnOptions // TODO
  createdAt: string
  updatedAt: string
}

export interface ActivityColumn extends BaseColumn {
  id: string
  type: 'activity'
  filters?: ActivityColumnFilters
}

export interface NotificationColumn extends BaseColumn {
  id: string
  type: 'notifications'
  filters?: NotificationColumnFilters
}

export type Column = ActivityColumn | NotificationColumn

export type ColumnParamField = 'all' | 'org' | 'owner' | 'repo' | 'username'

export interface AddColumnDetailsPayload {
  name: string
  icon: GitHubIcon
  subscription: Pick<ColumnSubscription, 'type' | 'subtype'>
  paramList: ColumnParamField[]
  defaultParams?: Partial<Record<ColumnParamField, any>>
}

export interface ColumnAndSubscriptions {
  column:
    | Omit<ActivityColumn, 'createdAt' | 'updatedAt'>
    | Omit<NotificationColumn, 'createdAt' | 'updatedAt'>
  subscriptions: Array<
    Pick<ColumnSubscription, 'id' | 'type' | 'subtype' | 'params'>
  >
}

export interface ColumnsAndSubscriptions {
  columns: Array<ColumnAndSubscriptions['column']>
  subscriptions: ColumnAndSubscriptions['subscriptions']
}

export type ModalPayload =
  | {
      name: 'ADD_COLUMN_AND_SUBSCRIPTIONS'
      params?: undefined
    }
  | {
      name: 'ADD_COLUMN_DETAILS'
      params: AddColumnDetailsPayload
    }
  | {
      name: 'SETTINGS'
      params?: undefined
    }

export type LoadState =
  | 'error'
  | 'loaded'
  | 'loading'
  | 'loading_first'
  | 'loading_more'
  | 'not_loaded'

export type EnhancementCache = Map<
  string,
  false | { timestamp: number; data: any }
>
