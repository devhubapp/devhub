import React from 'react';
import { Provider } from 'react-redux';
import { NavigationProvider, StackNavigation } from '@exponent/ex-navigation';

import App from './containers/App';
import store from './store';
import Router from './navigation/Router';

export default () => (
  <Provider store={store}>
    <NavigationProvider router={Router}>
      <App>
        <StackNavigation initialRoute={Router.getRoute('app')} />
      </App>
    </NavigationProvider>
  </Provider>
);
