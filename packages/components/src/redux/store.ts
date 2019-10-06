import { AsyncStorage } from 'react-native'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  createMigrate,
  PersistConfig,
  persistReducer,
  persistStore,
} from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { registerSelectors } from 'reselect-tools'

import { analyticsMiddleware } from './middlewares/analytics'
import { electronMiddleware } from './middlewares/electron'
import migrations from './migrations'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import * as selectors from './selectors'

if (__DEV__) {
  registerSelectors(selectors)
}

export function configureStore(key = 'root') {
  const persistConfig: PersistConfig<any> = {
    blacklist: ['navigation'],
    key,
    migrate: createMigrate(migrations as any, { debug: __DEV__ }),
    storage: AsyncStorage,
    throttle: 500,
    version: 13,
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
      applyMiddleware(analyticsMiddleware, sagaMiddleware, electronMiddleware),
    ),
  )

  const persistor = persistStore(store)

  sagaMiddleware.run(rootSaga)

  return { store, persistor }
}
