import React from 'react';
import { Provider } from 'react-redux';

import './utils/services';
import AppContainer from './containers/AppContainer';
import store from './store';
import DeepLinkWatcher from './navigation/DeepLinkWatcher';

export default (props) => (
  <Provider store={store}>
    <DeepLinkWatcher>
      <AppContainer {...props} />
    </DeepLinkWatcher>
  </Provider>
);
