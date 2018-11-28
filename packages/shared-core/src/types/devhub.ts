import Octokit from '@octokit/rest'
import {
  GitHubEvent,
  GitHubExtractParamsFromActivityMethod,
  GitHubIcon,
  GitHubNotificationReason,
  Omit,
} from '.'

type octokit = InstanceType<typeof Octokit>

export interface NotificationSubscription {
  id: string
  type: 'notifications'
  subtype?: undefined | ''
  params: {
    all?: boolean
  }
  createdAt: string
  updatedAt: string
}

export type ActivitySubscription = {
  id: string
  type: 'activity'
  createdAt: string
  updatedAt: string
} & (
  | {
      subtype: 'ORG_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['getEventsForOrg']
      >
    }
  | {
      subtype: 'PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['getEvents']
      >
    }
  | {
      subtype: 'REPO_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['getEventsForRepo']
      >
    }
  | {
      subtype: 'REPO_NETWORK_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['getEventsForRepoNetwork']
      >
    }
  | {
      subtype: 'USER_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['getEventsForUser']
      >
    }
  | {
      subtype: 'USER_ORG_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['getEventsForUserOrg']
      >
    }
  | {
      subtype: 'USER_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['getEventsForUserPublic']
      >
    }
  | {
      subtype: 'USER_RECEIVED_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['getEventsReceived']
      >
    }
  | {
      subtype: 'USER_RECEIVED_PUBLIC_EVENTS'
      params: GitHubExtractParamsFromActivityMethod<
        octokit['activity']['getEventsReceivedPublic']
      >
    })

export interface BaseColumnFilters {
  // archived?: boolean
  clearedAt?: string
  // order?: Array<'asc' | 'desc'>
  // owners?: string[]
  private?: boolean
  // repos?: string[]
  // saved?: boolean
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
  subscription: Omit<
    ColumnSubscription,
    'id' | 'params' | 'createdAt' | 'updatedAt'
  >
  paramList: ColumnParamField[]
  defaultParams?: Partial<Record<ColumnParamField, any>>
}

export interface ColumnAndSubscriptions {
  column:
    | Omit<ActivityColumn, 'createdAt' | 'updatedAt'>
    | Omit<NotificationColumn, 'createdAt' | 'updatedAt'>
  subscriptions: Array<Omit<ColumnSubscription, 'createdAt' | 'updatedAt'>>
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
      name: 'SETTINGS'
      params?: undefined
    }
