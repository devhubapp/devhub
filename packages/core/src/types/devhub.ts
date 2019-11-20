import Octokit from '@octokit/rest'

import { FeatureFlagId, PlanID } from '../utils'
import {
  GitHubAppType,
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
import { GraphQLUserPlan } from './graphql'

type octokit = InstanceType<typeof Octokit>

export interface ReadUnreadEnhancement {
  enhanced?: boolean
  last_read_at?: string
  last_unread_at?: string
}

export interface SaveForLaterEnhancement {
  enhanced?: boolean
  last_saved_at?: string
  last_unsaved_at?: string
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
  private?: boolean
  enhanced?: boolean
}

export interface PullRequestPayloadEnhancement
  extends ReadUnreadEnhancement,
    SaveForLaterEnhancement {
  merged?: boolean
  private?: boolean
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

export type DevHubDataItemType = 'event' | 'issue_or_pr' | 'notification' // TODO: 'repo' | 'user' | ...

export interface ColumnSubscriptionData {
  canFetchMore?: boolean
  errorMessage?: string
  itemNodeIdOrIds?: string[]
  lastFetchedAt?: string
  lastFetchedSuccessfullyAt?: string
  loadState?: EnhancedLoadState
}

export type ActivityColumnSubscription = {
  id: string
  type: ActivityColumn['type']
  data: ColumnSubscriptionData
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
  data: ColumnSubscriptionData
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
  data: ColumnSubscriptionData
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
  bot?: boolean
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
  watching?: Partial<Record<string, boolean>>
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

export interface ColumnOptions {
  enableInAppUnreadIndicator?: boolean
  enableAppIconUnreadIndicator?: boolean
  enableDesktopPushNotifications?: boolean
  // enableMobilePushNotifications?: boolean
}

export type ColumnSubscription =
  | ActivityColumnSubscription
  | IssueOrPullRequestColumnSubscription
  | NotificationColumnSubscription

export interface BaseColumn {
  id: string
  // title?: string // TODO
  // subtitle?: string // TODO
  subscriptionIds: string[]
  subscriptionIdsHistory: string[]
  options?: ColumnOptions
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
      name: 'PRICING'
      params?: {
        initialSelectedPlanId?: PlanID | undefined
        highlightFeature?: keyof Plan['featureFlags']
      }
    }
  | {
      name: 'SETTINGS'
      params?: undefined
    }
  | {
      name: 'SETUP_GITHUB_ENTERPRISE'
      params?: undefined
    }
  | {
      name: 'SUBSCRIBE'
      params: { planId: PlanID | undefined }
    }
  | {
      name: 'SUBSCRIBED'
      params: { planId: PlanID | undefined }
    }

export type ModalPayloadWithIndex = ModalPayload & { index: number }

export type LoadState = 'error' | 'loaded' | 'loading' | 'not_loaded'

export type EnhancedLoadState = LoadState | 'loading_first' | 'loading_more'

export type EnhancementCache = Map<
  string,
  false | { timestamp: number; data: any }
>

export type AppViewMode = 'single-column' | 'multi-column'

export interface BannerMessage {
  id: string
  message: string
  href?: string
  openOnNewTab?: boolean
  disableOnSmallScreens?: boolean
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
  bot: ItemFilterCountMetadata

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
  watching: Record<string, ItemFilterCountMetadata>
}

export interface OAuthResponseData {
  app_token?: string
  code: string
  github_app_type: GitHubAppType
  github_login: string
  github_scope: string[]
  github_token?: string
  github_token_created_at?: string
  github_token_type?: string
  oauth: boolean
}

export type DesktopOS = 'macos' | 'windows' | 'linux'
export type MobileOS = 'ios' | 'android'
export type OS = DesktopOS | MobileOS

export type DownloadOption =
  | {
      category: 'web'
      platform: 'web'
      os: OS
    }
  | {
      category: 'mobile'
      platform: 'ios'
      os: 'ios'
    }
  | {
      category: 'mobile'
      platform: 'android'
      os: 'android'
    }
  | {
      category: 'desktop'
      platform: 'web'
      os: DesktopOS
    }
  | {
      category: 'desktop'
      platform: 'web'
      os: DesktopOS
    }
  | {
      category: 'desktop'
      platform: 'web'
      os: DesktopOS
    }

export type PlatformCategory = DownloadOption['category']
export type Platform = DownloadOption['platform']

export type PlanSource = 'stripe' // | 'github_marketplace' | 'opencollective' | 'appstore' | 'playstore'
export type PlanType = 'individual' | 'team' | undefined

export interface Plan {
  id: PlanID
  type: PlanType

  stripeIds: [string, string] | [] // [test, prod]

  cannonicalId: string
  label: string
  description: string

  banner: string | boolean

  amount: number
  currency: string
  trialPeriodDays: number
  interval: 'day' | 'week' | 'month' | 'year' | undefined
  intervalCount: number
  transformUsage?: {
    divideBy: number
    round: 'up' | 'down'
  }

  featureLabels: Array<{
    id: FeatureFlagId
    label: string
    available: boolean
  }>

  featureFlags: {
    columnsLimit: number
    enableFilters: boolean
    enableSync: boolean
    enablePrivateRepositories: boolean
    enablePushNotifications: boolean
  }
}

export interface UserPlan extends GraphQLUserPlan {}

export interface ItemPushNotification<
  A extends { type: string; payload: any } = { type: string; payload: any }
> {
  title: string
  subtitle?: string
  body: string
  imageURL?: string
  onClickDispatchAction?: A
}
