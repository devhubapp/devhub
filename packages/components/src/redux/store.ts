import { applyMiddleware, compose, createStore } from 'redux'
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
import { devhubMiddleware } from './middlewares/devhub'
import { electronMiddleware } from './middlewares/electron'
import { createFlipperMiddleware } from './middlewares/flipper'
import migrations from './migrations'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import * as selectors from './selectors'
import storage from './storage'

if (__DEV__) {
  registerSelectors(selectors)
}

const composeFn: typeof composeWithDevTools = __DEV__
  ? composeWithDevTools
  : compose

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
    version: 17,
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
  const flipperMiddleware = createFlipperMiddleware()

  const store = createStore(
    persistedReducer,
    composeFn(
      applyMiddleware(
        analyticsMiddleware,
        sagaMiddleware,
        electronMiddleware,
        flipperMiddleware,
        devhubMiddleware,
      ),
    ),
  )

  const persistor = persistStore(store)

  sagaMiddleware.run(rootSaga as any)

  return { store, persistor }
}
