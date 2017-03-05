/* eslint-env browser */

import createSagaMiddleware from 'redux-saga';
import { Map } from 'immutable';
import { AsyncStorage, Platform } from 'react-native';
import { applyMiddleware, compose, createStore } from 'redux';
import { autoRehydrate, persistStore } from 'redux-persist-immutable';
import { composeWithDevTools } from 'remote-redux-devtools';

import sagas from '../sagas';
import reducer from '../reducers';

export default (initialState = Map()) => {
  const sagaMiddleware = createSagaMiddleware();

  const devToolsOptions = { realtime: true, hostname: 'localhost', port: 8800 };
  const composeEnhancers = Platform.OS === 'web'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : composeWithDevTools(devToolsOptions);

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware), autoRehydrate()),
  );

  sagaMiddleware.run(sagas);

  const storage = Platform.OS === 'web' ? undefined : AsyncStorage;
  persistStore(store, { debounce: 500, blacklist: ['navigation'], storage });

  return store;
};
