import immer from 'immer'

import {
  ActivityColumn,
  Column,
  ColumnSubscription,
  filterRecordHasAnyForcedValue,
  getEventMetadata,
  getOwnerAndRepo,
  GitHubEvent,
  GraphQLGitHubUser,
  guid,
  IssueOrPullRequestColumnSubscription,
  removeUselessURLsFromResponseItem,
} from '@devhub/core'
import * as selectors from './selectors'
import { RootState } from './types'

export default {
  0: (state: any) => state,
  1: (state: any) => state,
  2: (state: any) =>
    immer(state, draft => {
      const columns: Column[] = draft.columns && draft.columns.columns
      if (!columns) return

      draft.columns.byId = {}
      draft.columns.allIds = columns.map(column => {
        draft.columns.byId![column.id] = column
        return column.id
      })
    }),
  3: (state: RootState) =>
    immer(state, draft => {
      let columns = selectors
        .columnsArrSelector(state)
        .filter(Boolean) as Column[]
      if (!columns) return

      draft.subscriptions = draft.subscriptions || {}
      draft.subscriptions.allIds = []
      draft.subscriptions.byId = {}
      columns = columns.map((oldColumn: any) => {
        const subscription: ColumnSubscription = {
          id: guid(),
          type: oldColumn.type,
          subtype: oldColumn.subtype,
          params: oldColumn.params,
          data: {},
          createdAt: oldColumn.createdAt || new Date().toISOString(),
          updatedAt: oldColumn.updatedAt || new Date().toISOString(),
        }

        draft.subscriptions.allIds.push(subscription.id)
        draft.subscriptions.byId[subscription.id] = subscription

        const column: Column = {
          id: oldColumn.id,
          type: oldColumn.type,
          subscriptionIds: [subscription.id],
          createdAt: oldColumn.createdAt || new Date().toISOString(),
          updatedAt: oldColumn.updatedAt || new Date().toISOString(),
        }

        return column
      })

      draft.columns.byId = {}
      draft.columns.allIds = columns.map(column => {
        draft.columns.byId![column.id] = column
        return column.id
      })
    }),
  4: (state: RootState) =>
    immer(state, draft => {
      const oldAuth = (draft.auth as any) as {
        appToken: string | null
        githubScope: string[] | null
        githubToken: string | null
        githubTokenType: string | null
        githubTokenCreatedAt: string | null
        isLoggingIn: boolean
        lastLoginAt: string | null
        user: GraphQLGitHubUser
      }

      draft.auth = {
        appToken: oldAuth.appToken,
        error: null,
        isDeletingAccount: false,
        isLoggingIn: false,
        user:
          oldAuth.user &&
          ({
            _id: '',
            github: {
              scope: oldAuth.githubScope || [],
              token: oldAuth.githubToken || '',
              tokenType: oldAuth.githubTokenType || '',
              tokenCreatedAt: oldAuth.githubTokenCreatedAt || '',
              user: oldAuth.user,
            } as any,
            createdAt: '',
            updatedAt: '',
            lastLoginAt: oldAuth.lastLoginAt || '',
          } as any),
      } as any
    }),
  5: (state: RootState) =>
    immer(state, draft => {
      draft.subscriptions = draft.subscriptions || {}
      draft.subscriptions.allIds = draft.subscriptions.allIds || []
      draft.subscriptions.byId = draft.subscriptions.byId || {}

      const byId: Record<string, ColumnSubscription | undefined> = {}

      selectors.allSubscriptionsArrSelector(draft).forEach(subscription => {
        const {
          data: items,
          loadState,
          errorMessage,
          canFetchMore,
          lastFetchedAt,
          ...restSubscription
        } = subscription as any

        const newSubscription = {
          ...restSubscription,
          data: {
            canFetchMore,
            errorMessage,
            items,
            lastFetchedAt,
            loadState,
          },
        }

        byId[newSubscription.id] = newSubscription
      })

      draft.subscriptions.byId = byId
    }),
  6: (state: RootState) =>
    immer(state, draft => {
      draft.subscriptions = draft.subscriptions || {}
      draft.subscriptions.allIds = draft.subscriptions.allIds || []
      draft.subscriptions.byId = draft.subscriptions.byId || {}

      selectors.allSubscriptionsArrSelector(draft).forEach(subscription => {
        if (
          !(
            subscription &&
            subscription.data &&
            subscription.data.items &&
            subscription.data.items.length
          )
        )
          return

        subscription.data.items = (subscription.data.items as any[]).map(
          removeUselessURLsFromResponseItem,
        )
      })
    }),
  7: (state: RootState) =>
    immer(state, draft => {
      draft.columns = draft.columns || {}
      draft.columns.allIds = draft.columns.allIds || []
      draft.columns.byId = draft.columns.byId || {}

      const keys = Object.keys(draft.columns.byId)

      keys.forEach(columnId => {
        const column = draft.columns.byId![columnId]
        const oldFilters = (column && column.filters) as any
        if (!(oldFilters && oldFilters.inbox)) return

        oldFilters.saved = oldFilters.inbox.saved
        delete oldFilters.inbox
      })
    }),
  8: (state: RootState) =>
    immer(state, draft => {
      delete (draft as any).app

      const githubAPIHeaders = (state as any).api && (state as any).api.github
      draft.github = draft.github || {}
      draft.github.api = draft.github.api || {}
      draft.github.api.headers = githubAPIHeaders
      delete (draft as any).api

      const auth = (state.auth || {}) as {
        appToken: string | null
        error: any
        isLoggingIn: boolean
        user: {
          _id: any
          columns?: any
          subscriptions?: any
          github?: {
            scope?: string[] | undefined
            token?: string | undefined
            tokenType?: string | undefined
            tokenCreatedAt?: string | undefined
            user: GraphQLGitHubUser
          }
          createdAt: string
          updatedAt: string
          lastLoginAt: string
        } | null
      }

      if (!auth.user) return
      ;(draft.auth as any).user = {
        _id: auth.user._id,
        createdAt: auth.user.createdAt,
        lastLoginAt: auth.user.lastLoginAt,
        updatedAt: auth.user.updatedAt,
      } as typeof auth['user']

      if (!(auth.user.github && auth.user.github.token)) return
      draft.github = draft.github || {}
      draft.github.auth = draft.github.auth || {}

      draft.github.auth.oauth = {
        login: '',
        scope: auth.user.github.scope,
        token: auth.user.github.token,
        tokenCreatedAt: auth.user.github.tokenCreatedAt!,
        tokenType: auth.user.github.tokenType,
      }
      draft.github.auth.user = auth.user.github.user
    }),
  9: (state: RootState) =>
    immer(state, draft => {
      draft.config = draft.config || {}
      ;(draft.config as any).appViewMode =
        (draft.config as any).appViewMode === 'single-column'
          ? 'single-column'
          : 'multi-column'
    }),
  10: (state: RootState) =>
    immer(state, draft => {
      draft.columns = draft.columns || {}
      draft.columns.byId = draft.columns.byId || {}

      const columnIds = Object.keys(draft.columns.byId)
      columnIds.forEach(columnId => {
        const column = draft.columns.byId![columnId] as ActivityColumn

        if (
          !(
            column &&
            column.filters &&
            'activity' in column.filters &&
            column.filters.activity &&
            filterRecordHasAnyForcedValue(
              (column.filters.activity as any).types,
            )
          )
        )
          return

        const oldTypesFilter: Partial<
          Record<GitHubEvent['type'], boolean>
        > = (column.filters!.activity as any).types

        column.filters.subjectTypes = column.filters.subjectTypes || {}
        column.filters.activity.actions = column.filters.activity.actions || {}

        Object.keys(oldTypesFilter).forEach((type: any) => {
          if (typeof (oldTypesFilter as any)[type] !== 'boolean') return

          try {
            const { action } = getEventMetadata({ type, payload: {} } as any)
            if (!action) return

            column.filters!.activity!.actions![
              action
            ] = (oldTypesFilter as any)[type]
          } catch (error) {
            //
          }
        })

        // Keeping for now, to minimize sync issues
        // TODO: Delete this field later in the future
        // delete (column.filters.activity as any).types
      })
    }),
  11: (state: RootState) =>
    immer(state, draft => {
      draft.columns = draft.columns || {}
      draft.columns.byId = draft.columns.byId || {}
      draft.subscriptions = draft.subscriptions || {}
      draft.subscriptions.byId = draft.subscriptions.byId || {}

      const columnIds = Object.keys(draft.columns.byId)
      columnIds.forEach(columnId => {
        const column = draft.columns.byId![columnId] as ActivityColumn

        // we only wanna change User Dashboard columns
        if (!(column && column.type === 'activity')) return
        const subscription = draft.subscriptions.byId[column.subscriptionIds[0]]
        if (
          !(
            subscription &&
            subscription.type === 'activity' &&
            subscription.subtype === 'USER_RECEIVED_EVENTS'
          )
        )
          return

        // if column has some custom filters, let's not touch it
        if (
          column &&
          column.filters &&
          (filterRecordHasAnyForcedValue(column.filters.subjectTypes) ||
            (column.filters.activity &&
              (filterRecordHasAnyForcedValue(column.filters.activity.actions) ||
                filterRecordHasAnyForcedValue(
                  (column.filters.activity as any).types,
                ))))
        )
          return

        // change default column filters to match github's dashboard
        column.filters = column.filters || {}
        column.filters.subjectTypes = {
          Release: true,
          Repository: true,
          Tag: true,
          User: true,
        }
      })
    }),
  12: (state: RootState) =>
    immer(state, draft => {
      draft.subscriptions = draft.subscriptions || {}
      draft.subscriptions.byId = draft.subscriptions.byId || {}

      const subscriptionIds = Object.keys(draft.subscriptions.byId)
      subscriptionIds.forEach(subscriptionId => {
        const subscription = draft.subscriptions.byId![subscriptionId]

        // we only wanna change Issues & PRs columns
        if (!(subscription && subscription.type === 'issue_or_pr')) return

        const s = subscription as IssueOrPullRequestColumnSubscription
        s.params = s.params || {}

        const subscriptionParams = s.params as ({
          repoFullName?: string
          owners?: Partial<
            Record<
              string,
              {
                value: boolean | undefined
                repos: Partial<Record<string, boolean>> | undefined
              }
            >
          >
        })

        if (!subscriptionParams.repoFullName) return

        const { owner, repo } = getOwnerAndRepo(subscriptionParams.repoFullName)
        if (!(owner && repo)) return

        subscriptionParams.owners = subscriptionParams.owners || {}
        subscriptionParams.owners[owner] = subscriptionParams.owners[owner] || {
          value: true,
          repos: undefined,
        }

        subscriptionParams.owners[owner]!.repos =
          subscriptionParams.owners[owner]!.repos || {}

        subscriptionParams.owners[owner]!.repos![repo] = true

        delete subscriptionParams.repoFullName
      })
    }),
  13: (state: RootState) =>
    immer(state, draft => {
      draft.auth = draft.auth || {}
      draft.counters = draft.counters || {}

      const loginCount = (draft.auth as any).loginCount || 0
      draft.counters.loginSuccess = loginCount || 0
    }),
}
