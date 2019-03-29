import Octokit from '@octokit/rest'

import {
  GitHubComment,
  GitHubCommit,
  GitHubEvent,
  GitHubEventSubjectType,
  GitHubExtractParamsFromMethod,
  GitHubIcon,
  GitHubIssue,
  GitHubNotification,
  GitHubNotificationReason,
  GitHubNotificationSubjectType,
  GitHubPullRequest,
  GitHubRelease,
  GitHubRepo,
  GitHubWatchEvent,
} from './github'
import { Omit } from './typescript'

type octokit = InstanceType<typeof Octokit>

export interface ReadUnreadEnhancement {
  forceUnreadLocally?: boolean // Workaround while GitHub doesn't support marking as unread via api
  last_read_at?: string
  last_unread_at?: string
  unread?: boolean // GitHub server's value
}

export interface SaveForLaterEnhancement {
  saved?: boolean
}

export interface NotificationPayloadEnhancement {
  comment?: GitHubComment
  commit?: GitHubCommit
  issue?: GitHubIssue
  pullRequest?: GitHubPullRequest
  release?: GitHubRelease
  enhanced?: boolean
}

export interface EnhancedGitHubNotification
  extends GitHubNotification,
    NotificationPayloadEnhancement,
    ReadUnreadEnhancement,
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
  ReadUnreadEnhancement &
  SaveForLaterEnhancement

export interface ColumnSubscriptionData<
  Item extends EnhancedGitHubNotification | EnhancedGitHubEvent
> {
  items?: Item[]
  loadState?: EnhancedLoadState
  errorMessage?: string
  canFetchMore?: boolean
  lastFetchedAt?: string
}

export type NotificationColumnSubscription = {
  id: string
  type: 'notifications'
  params: {
    all?: boolean
    participating?: boolean
  }
  data: ColumnSubscriptionData<EnhancedGitHubNotification>
  createdAt: string
  updatedAt: string
} & (
  | {
      subtype: undefined | ''
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listNotifications']
      >
    }
  | {
      subtype: 'REPO_NOTIFICATIONS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listNotificationsForRepo']
      >
    })

export type ActivityColumnSubscription = {
  id: string
  type: 'activity'
  data: ColumnSubscriptionData<EnhancedGitHubEvent>
  createdAt: string
  updatedAt: string
} & (
  | {
      subtype: 'ORG_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listEventsForOrg']
      >
    }
  | {
      subtype: 'PUBLIC_EVENTS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listPublicEvents']
      >
    }
  | {
      subtype: 'REPO_EVENTS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listRepoEvents']
      >
    }
  | {
      subtype: 'REPO_NETWORK_EVENTS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listPublicEventsForRepoNetwork']
      >
    }
  | {
      subtype: 'USER_EVENTS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listEventsForUser']
      >
    }
  | {
      subtype: 'USER_ORG_EVENTS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listEventsForOrg']
      >
    }
  | {
      subtype: 'USER_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listPublicEventsForUser']
      >
    }
  | {
      subtype: 'USER_RECEIVED_EVENTS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listReceivedEventsForUser']
      >
    }
  | {
      subtype: 'USER_RECEIVED_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromMethod<
        octokit['activity']['listReceivedPublicEventsForUser']
      >
    })

export interface BaseColumnFilters {
  clearedAt?: string
  // order?: Array<'asc' | 'desc'>
  // owners?: string[]
  private?: boolean
  // repos?: string[]
  saved?: boolean
  // search: {
  //   exclude?: string
  //   match?: string
  //   regex?: string
  // }
  // sort?: string[]
  subjectTypes?:
    | Partial<Record<GitHubEventSubjectType, boolean>>
    | Partial<Record<GitHubNotificationSubjectType, boolean>>
  unread?: boolean
}

export interface ActivityColumnFilters extends BaseColumnFilters {
  activity?: {
    types?: Partial<Record<GitHubEvent['type'], boolean>>
  }
  subjectTypes?: Partial<Record<GitHubEventSubjectType, boolean>>
}

export interface NotificationColumnFilters extends BaseColumnFilters {
  notifications?: {
    participating?: boolean
    reasons?: Partial<Record<GitHubNotificationReason, boolean>>
  }
  subjectTypes?: Partial<Record<GitHubNotificationSubjectType, boolean>>
}

export type ColumnFilters = ActivityColumnFilters | NotificationColumnFilters

// export interface ColumnOptions {
//   enableBadge?: boolean
//   enableNotifications?: boolean
// }

export type ColumnSubscription =
  | ActivityColumnSubscription
  | NotificationColumnSubscription

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

export type ActivityColumnCreation = Omit<
  ActivityColumn,
  'createdAt' | 'updatedAt'
> & {
  createdAt?: string
  updatedAt?: string
}

export type NotificationColumnCreation = Omit<
  NotificationColumn,
  'createdAt' | 'updatedAt'
> & {
  createdAt?: string
  updatedAt?: string
}

export type ColumnCreation = ActivityColumnCreation | NotificationColumnCreation

export type ActivityColumnSubscriptionCreation = Omit<
  ActivityColumnSubscription,
  'id' | 'data' | 'createdAt' | 'updatedAt'
> & {
  id?: string | undefined
  data?: ActivityColumnSubscription['data'] | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type NotificationColumnSubscriptionCreation = Omit<
  NotificationColumnSubscription,
  'id' | 'data' | 'createdAt' | 'updatedAt'
> & {
  id?: string | undefined
  data?: NotificationColumnSubscription['data'] | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type ColumnSubscriptionCreation =
  | ActivityColumnSubscriptionCreation
  | NotificationColumnSubscriptionCreation

export type ColumnParamField = 'all' | 'org' | 'owner' | 'repo' | 'username'

export interface AddColumnDetailsPayload {
  title: string
  icon: GitHubIcon
  subscription: Pick<ColumnSubscription, 'type' | 'subtype'>
  paramList: ColumnParamField[]
  defaultParams?: Partial<Record<ColumnParamField, any>>
  isPrivateSupported: boolean
}

export interface ColumnAndSubscriptions {
  column: ColumnCreation
  subscriptions: ColumnSubscriptionCreation[]
}

export interface ColumnsAndSubscriptions {
  columns: Array<ColumnAndSubscriptions['column']>
  subscriptions: ColumnAndSubscriptions['subscriptions']
  columnsUpdatedAt?: string
  subscriptionsUpdatedAt?: string
}

export type ModalPayload =
  | {
      name: 'ADD_COLUMN'
      params?: undefined
    }
  | {
      name: 'ADD_COLUMN_DETAILS'
      params: AddColumnDetailsPayload
    }
  | {
      name: 'ADVANCED_SETTINGS'
      params?: undefined
    }
  | {
      name: 'KEYBOARD_SHORTCUTS'
      params?: undefined
    }
  | {
      name: 'SETTINGS'
      params?: undefined
    }
  | {
      name: 'SETUP_GITHUB_ENTERPRISE'
      params?: undefined
    }

export type ModalPayloadWithIndex = ModalPayload & { index: number }

export type LoadState = 'error' | 'loaded' | 'loading' | 'not_loaded'

export type EnhancedLoadState = LoadState | 'loading_first' | 'loading_more'

export type EnhancementCache = Map<
  string,
  false | { timestamp: number; data: any }
>

export type AppViewMode = 'multi-column' | 'single-column'

export type CardViewMode = 'compact' | 'expanded'
