import createSagaMiddleware from 'redux-saga'
import createMigration from 'redux-persist-migrate';
import { AsyncStorage } from 'react-native';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'remote-redux-devtools';
import { createNavigationEnabledStore } from '@exponent/ex-navigation';

import sagas from './sagas';
import reducer from './reducers';

const manifest = {
  1: state => state,
  2: state => ({ ...state, app: { ...state.app, feed: undefined } }),
};

// reducerKey is the key of the reducer you want to store the state version in
// in this example after migrations run `state.app.version` will equal `2`
let reducerKey = 'app';
const migration = createMigration(manifest, reducerKey);

const createStoreWithNavigation = createNavigationEnabledStore({
  createStore,
  navigationStateKey: 'navigation',
});

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({ realtime: true });
const store = createStoreWithNavigation(
  reducer,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    migration,
    autoRehydrate()
  )
);

sagaMiddleware.run(sagas);

persistStore(store, { storage: AsyncStorage, blacklist: ['navigation'] });

export default store;
