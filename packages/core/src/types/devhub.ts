import Octokit from '@octokit/rest'

import {
  GitHubComment,
  GitHubCommit,
  GitHubEvent,
  GitHubEventAction,
  GitHubEventSubjectType,
  GitHubExtractParamsFromMethod,
  GitHubIcon,
  GitHubIssue,
  GitHubIssueOrPullRequestSubjectType,
  GitHubItemSubjectType,
  GitHubNotification,
  GitHubNotificationReason,
  GitHubNotificationSubjectType,
  GitHubPrivacy,
  GitHubPullRequest,
  GitHubRelease,
  GitHubRepo,
  GitHubStateType,
  GitHubWatchEvent,
} from './github'

type octokit = InstanceType<typeof Octokit>

export interface ReadUnreadEnhancement {
  forceUnreadLocally?: boolean // Workaround while GitHub doesn't support marking as unread via api
  last_read_at?: string
  last_unread_at?: string
  unread?: boolean // GitHub server's value
  enhanced?: boolean
}

export interface SaveForLaterEnhancement {
  saved?: boolean
  enhanced?: boolean
}

export interface NotificationPayloadEnhancement
  extends ReadUnreadEnhancement,
    SaveForLaterEnhancement {
  comment?: GitHubComment
  commit?: GitHubCommit
  issue?: GitHubIssue
  pullRequest?: GitHubPullRequest
  release?: GitHubRelease
  enhanced?: boolean
}

export interface IssuePayloadEnhancement
  extends ReadUnreadEnhancement,
    SaveForLaterEnhancement {
  merged?: undefined
  enhanced?: boolean
}

export interface PullRequestPayloadEnhancement
  extends ReadUnreadEnhancement,
    SaveForLaterEnhancement {
  merged?: boolean
  enhanced?: boolean
}

export type IssueOrPullRequestPayloadEnhancement =
  | IssuePayloadEnhancement
  | PullRequestPayloadEnhancement

export interface EnhancedGitHubNotification
  extends GitHubNotification,
    NotificationPayloadEnhancement {}

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

export type EnhancedGitHubIssue = GitHubIssue & IssuePayloadEnhancement

export type EnhancedGitHubPullRequest = GitHubPullRequest &
  PullRequestPayloadEnhancement

export type EnhancedGitHubIssueOrPullRequest =
  | EnhancedGitHubIssue
  | EnhancedGitHubPullRequest

export type EnhancedItem =
  | EnhancedGitHubNotification
  | EnhancedGitHubEvent
  | EnhancedGitHubIssueOrPullRequest

export interface ColumnSubscriptionData<Item extends EnhancedItem> {
  items?: Item[]
  loadState?: EnhancedLoadState
  errorMessage?: string
  canFetchMore?: boolean
  lastFetchedAt?: string
}

export type ActivityColumnSubscription = {
  id: string
  type: ActivityColumn['type']
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

export interface IssueOrPullRequestColumnSubscription {
  id: string
  type: IssueOrPullRequestColumn['type']
  subtype: 'ISSUES' | 'PULLS' | undefined
  params: {
    owners?: IssueOrPullRequestColumnFilters['owners']
    involves?: IssueOrPullRequestColumnFilters['involves']
    subjectType: GitHubIssueOrPullRequestSubjectType | undefined
    state?: IssueOrPullRequestColumnFilters['state']
    draft?: IssueOrPullRequestColumnFilters['draft']
    query?: string
  }
  data: ColumnSubscriptionData<any>
  createdAt: string
  updatedAt: string
}

export type NotificationColumnSubscription = {
  id: string
  type: NotificationColumn['type']
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

export interface BaseColumnFilters {
  clearedAt?: string
  draft?: boolean
  // order?: Array<[string, 'asc' | 'desc']>
  owners?: Partial<
    Record<
      string,
      {
        value: boolean | undefined
        repos: Partial<Record<string, boolean>> | undefined
      }
    >
  >
  private?: boolean
  query?: string
  saved?: boolean
  state?: Partial<Record<GitHubStateType, boolean>>
  subjectTypes?:
    | Partial<Record<GitHubEventSubjectType, boolean>>
    | Partial<Record<GitHubNotificationSubjectType, boolean>>
  unread?: boolean
}

export interface ActivityColumnFilters extends BaseColumnFilters {
  activity?: {
    actions?: Partial<Record<GitHubEventAction, boolean>>
  }
  subjectTypes?: Partial<Record<GitHubEventSubjectType, boolean>>
}

export interface IssueOrPullRequestColumnFilters extends BaseColumnFilters {
  involves?: Partial<Record<string, boolean>>
  subjectTypes?: Partial<Record<GitHubIssueOrPullRequestSubjectType, boolean>>
}

export interface NotificationColumnFilters extends BaseColumnFilters {
  notifications?: {
    participating?: boolean
    reasons?: Partial<Record<GitHubNotificationReason, boolean>>
  }
  subjectTypes?: Partial<Record<GitHubNotificationSubjectType, boolean>>
}

export type ColumnFilters =
  | ActivityColumnFilters
  | IssueOrPullRequestColumnFilters
  | NotificationColumnFilters

// export interface ColumnOptions {
//   enableBadge?: boolean
//   enableNotifications?: boolean
// }

export type ColumnSubscription =
  | ActivityColumnSubscription
  | IssueOrPullRequestColumnSubscription
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

export interface IssueOrPullRequestColumn extends BaseColumn {
  id: string
  type: 'issue_or_pr'
  filters?: IssueOrPullRequestColumnFilters
}

export interface NotificationColumn extends BaseColumn {
  id: string
  type: 'notifications'
  filters?: NotificationColumnFilters
}

export type Column =
  | ActivityColumn
  | IssueOrPullRequestColumn
  | NotificationColumn

export type GenericColumnCreation<
  ColumnType extends
    | ActivityColumn
    | IssueOrPullRequestColumn
    | NotificationColumn
> = Omit<ColumnType, 'createdAt' | 'updatedAt'> & {
  createdAt?: string
  updatedAt?: string
}

export type ActivityColumnCreation = GenericColumnCreation<ActivityColumn>
export type IssueOrPullRequestColumnCreation = GenericColumnCreation<
  IssueOrPullRequestColumn
>
export type NotificationColumnCreation = GenericColumnCreation<
  NotificationColumn
>

export type ColumnCreation =
  | ActivityColumnCreation
  | IssueOrPullRequestColumnCreation
  | NotificationColumnCreation

export type GenericColumnSubscriptionCreation<
  ColumnSubscriptionType extends
    | ActivityColumnSubscription
    | IssueOrPullRequestColumnSubscription
    | NotificationColumnSubscription
> = Omit<ColumnSubscriptionType, 'id' | 'data' | 'createdAt' | 'updatedAt'> & {
  id?: string | undefined
  data?: ColumnSubscriptionType['data'] | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type ActivityColumnSubscriptionCreation = GenericColumnSubscriptionCreation<
  ActivityColumnSubscription
>
export type IssueOrPullRequestColumnSubscriptionCreation = GenericColumnSubscriptionCreation<
  IssueOrPullRequestColumnSubscription
>
export type NotificationColumnSubscriptionCreation = GenericColumnSubscriptionCreation<
  NotificationColumnSubscription
>

export type ColumnSubscriptionCreation =
  | ActivityColumnSubscriptionCreation
  | IssueOrPullRequestColumnSubscriptionCreation
  | NotificationColumnSubscriptionCreation

export type ColumnParamField = 'all' | 'org' | 'owner' | 'repo' | 'username'

export interface AddColumnDetailsPayload {
  title: string
  icon: GitHubIcon
  subscription: Pick<ColumnSubscription, 'type' | 'subtype'>
  defaultFilters?: Partial<Column['filters']>
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

export type AppViewMode = 'single-column' | 'multi-column'

export type CardViewMode = 'compact' | 'expanded'

export interface BannerMessage {
  id: string
  message: string
  href?: string
  openOnNewTab?: boolean
  minLoginCount?: number
  closedAt?: string | undefined
  createdAt?: string
}

export interface ItemFilterCountMetadata {
  read: 0
  unread: 0
  saved: 0
  total: 0
}

export interface ItemsFilterMetadata {
  inbox: {
    all: ItemFilterCountMetadata
    participating: ItemFilterCountMetadata
  }
  saved: ItemFilterCountMetadata
  state: Record<GitHubStateType, ItemFilterCountMetadata>
  draft: ItemFilterCountMetadata

  // items doesn't have enough info to correctly calculate this metadata
  // involves: Partial<Record<string, ItemFilterCountMetadata | undefined>>

  subjectType: Partial<
    Record<GitHubItemSubjectType, ItemFilterCountMetadata | undefined>
  >
  subscriptionReason: Partial<
    Record<GitHubNotificationReason, ItemFilterCountMetadata | undefined>
  >
  eventAction: Partial<Record<GitHubEventAction, ItemFilterCountMetadata>>
  privacy: Record<GitHubPrivacy, ItemFilterCountMetadata>
  owners: Record<
    string,
    {
      metadata: ItemFilterCountMetadata | undefined
      repos: Record<string, ItemFilterCountMetadata | undefined>
    }
  >
}
