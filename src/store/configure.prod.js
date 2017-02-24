/* eslint-env browser */

import createSagaMiddleware from 'redux-saga';
import { Map } from 'immutable';
import { AsyncStorage, Platform } from 'react-native';
import { applyMiddleware, compose, createStore } from 'redux';
import { autoRehydrate, persistStore } from 'redux-persist-immutable';

import sagas from '../sagas';
import reducer from '../reducers';

export default (initialState = Map()) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducer,
    initialState,
    compose(applyMiddleware(sagaMiddleware), autoRehydrate()),
  );

  sagaMiddleware.run(sagas);

  const storage = Platform.OS === 'web' ? undefined : AsyncStorage;
  persistStore(store, { debounce: 500, storage });

  return store;
};
