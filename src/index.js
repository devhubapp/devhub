import React, { Component } from 'react';
import { Provider } from 'react-redux';

import './utils/services';
import AppContainer from './containers/AppContainer';
import store from './store';
import DeepLinkWatcher from './navigation/DeepLinkWatcher';

// ps: codepush needs this to be a class instead of a stateless function
// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <DeepLinkWatcher>
          <AppContainer {...this.props} />
        </DeepLinkWatcher>
      </Provider>
    );
  }
}
