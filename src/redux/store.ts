import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { rootReducer } from './reducers'

export function configureStore(key = 'root') {
  const persistConfig = { key, storage }
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = createStore(persistedReducer, composeWithDevTools())
  const persistor = persistStore(store)

  return { store, persistor }
}
