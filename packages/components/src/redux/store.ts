import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  createMigrate,
  getStoredState,
  PersistConfig,
  persistReducer,
  persistStore,
  purgeStoredState,
} from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { registerSelectors } from 'reselect-tools'

import { Platform } from '../libs/platform'
import { analyticsMiddleware } from './middlewares/analytics'
import { electronMiddleware } from './middlewares/electron'
import migrations from './migrations'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import * as selectors from './selectors'
import storage from './storage'

let reactotron: any
if (__DEV__) {
  reactotron = require('./ReactotronConfig').default // tslint:disable-line no-var-requires
  registerSelectors(selectors)
}

export function configureStore(key = 'root') {
  const persistConfig: PersistConfig<any> = {
    blacklist: ['navigation'],
    key,
    migrate: async (state, currentVersion) => {
      if (!state && Platform.OS === 'web') {
        try {
          const previousConfig: PersistConfig<any> = {
            key,
            storage: require('react-native').AsyncStorage,
          }

          const previousState = await getStoredState(previousConfig)
          if (previousState) {
            const newState = createMigrate(migrations as any, {
              debug: __DEV__,
            })(previousState as any, currentVersion)
            purgeStoredState(previousConfig)
            return newState
          }
        } catch (error) {
          console.error(error)
        }
      }

      return createMigrate(migrations as any, { debug: __DEV__ })(
        state,
        currentVersion,
      )
    },
    storage,
    throttle: 500,
    version: 14,
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
      ...[
        applyMiddleware(
          analyticsMiddleware,
          sagaMiddleware,
          electronMiddleware,
        ),
        reactotron && reactotron.createEnhancer(),
      ].filter(Boolean),
    ),
  )

  const persistor = persistStore(store)

  sagaMiddleware.run(rootSaga as any)

  return { store, persistor }
}
