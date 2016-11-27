import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContext, NavigationProvider, StackNavigation } from '@exponent/ex-navigation';

import App from './containers/App';
import store from './store';
import Router from './navigation/Router';

const navigationContext = new NavigationContext({ router: Router, store });

export default () => (
  <Provider store={store}>
    <NavigationProvider context={navigationContext}>
      <App>
        <StackNavigation initialRoute={Router.getRoute('app')} />
      </App>
    </NavigationProvider>
  </Provider>
);
