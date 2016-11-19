// @flow

import React from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'remote-redux-devtools';

import App from './containers/App';
import reducer from './reducers';

const composeEnhancers = composeWithDevTools({ realtime: true });
const store = createStore(reducer, composeEnhancers(autoRehydrate()));
persistStore(store, { storage: AsyncStorage, blacklist: ['theme'] });

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
