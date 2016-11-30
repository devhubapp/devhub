import createSagaMiddleware from 'redux-saga';
import { AsyncStorage } from 'react-native';
import { applyMiddleware, createStore } from 'redux'; // compose
import { persistStore, autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'remote-redux-devtools';
import { createNavigationEnabledStore } from '@exponent/ex-navigation';

import sagas from '../sagas';
import reducer from '../reducers';

export default (initialState) => {
  const createStoreWithNavigation = createNavigationEnabledStore({
    createStore,
    navigationStateKey: 'navigation',
  });

  const sagaMiddleware = createSagaMiddleware();

  const composeEnhancers = composeWithDevTools({ realtime: true });

  const store = createStoreWithNavigation(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware),
      autoRehydrate(),
    ),
  );

  sagaMiddleware.run(sagas);

  persistStore(store, { storage: AsyncStorage, blacklist: ['navigation'] });

  return store;
};
