import immer from 'immer'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  createMigrate,
  PersistConfig,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'

import {
  Column,
  ColumnSubscription,
  GraphQLGitHubUser,
  guid,
  removeUselessURLsFromResponseItem,
} from '@devhub/core'
import { analyticsMiddleware } from './middlewares/analytics'
import { bugsnagMiddleware } from './middlewares/bugsnag'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import * as selectors from './selectors'
import { RootState } from './types'

const migrations = {
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
      let columns: Column[] = selectors.columnsArrSelector(state)
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

      selectors.subscriptionsArrSelector(draft).forEach(subscription => {
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

      selectors.subscriptionsArrSelector(draft).forEach(subscription => {
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

      draft.auth.user = {
        _id: auth.user._id,
        createdAt: auth.user.createdAt,
        lastLoginAt: auth.user.lastLoginAt,
        updatedAt: auth.user.updatedAt,
      }

      if (!(auth.user.github && auth.user.github.token)) return
      draft.github = draft.github || {}
      draft.github.auth = draft.github.auth || {}

      draft.github.auth.oauth = {
        scope: auth.user.github.scope,
        token: auth.user.github.token,
        tokenCreatedAt: auth.user.github.tokenCreatedAt!,
        tokenType: auth.user.github.tokenType,
      }
      draft.github.auth.user = auth.user.github.user
    }),
}

export function configureStore(key = 'root') {
  const persistConfig: PersistConfig = {
    blacklist: ['navigation'],
    key,
    migrate: createMigrate(migrations as any, { debug: __DEV__ }),
    storage,
    throttle: 500,
    version: 8,
  }
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  /*
  // TODO: Fix this
  // Make it keep the current open modal opened
  // Also make sure the middlewares (persist, saga, devtools, etc)
  // keep working as expected
  if (__DEV__) {
    if ((module as any).hot) {
      ;(module as any).hot.accept(() => {
        store.replaceReducer(persistedReducer)
      })
    }
  }
  */

  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    persistedReducer,
    composeWithDevTools(
      applyMiddleware(bugsnagMiddleware, analyticsMiddleware, sagaMiddleware),
    ),
  )

  const persistor = persistStore(store)

  sagaMiddleware.run(rootSaga)

  return { store, persistor }
}
