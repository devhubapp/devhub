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

import { Column, ColumnSubscription, RootState } from '../types'
import { guid } from '../utils/helpers/shared'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import * as selectors from './selectors'

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
}

export function configureStore(key = 'root') {
  const persistConfig: PersistConfig = {
    blacklist: ['navigation'],
    key,
    migrate: createMigrate(migrations as any, { debug: __DEV__ }),
    storage,
    version: 3,
  }
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
  )
  const persistor = persistStore(store)

  sagaMiddleware.run(rootSaga)

  return { store, persistor }
}
