// @flow

import React from 'react';
import { AsyncStorage } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'remote-redux-devtools';

import reducer from './reducers';
import { registerScreens } from './screens';
import { DEFAULT_THEME } from './utils/constants/defaults';
import { loadTheme } from './utils/helpers';
import { iconsMap, iconsLoaded } from './utils/helpers/icon-loader';

const composeEnhancers = composeWithDevTools({ realtime: true });
const store = createStore(reducer, composeEnhancers(autoRehydrate()));
persistStore(store, { storage: AsyncStorage, blacklist: ['theme'] });

function startApp() {
  const theme = loadTheme(DEFAULT_THEME);

  const navigatorStyle = {
    screenBackgroundColor: theme.base00,
    navBarHidden: true,
  };

  Navigation.startTabBasedApp({
    tabs: [
      {
        screen: 'devhub.App',
        label: 'Feed',
        icon: iconsMap['mark-github'],
        selectedIcon: iconsMap['mark-github__inverted'],
        navigatorStyle,
      },
      {
        screen: 'devhub.View',
        label: 'Discover',
        icon: iconsMap.flame,
        selectedIcon: iconsMap.flame__inverted,
        navigatorStyle,
      },
      {
        screen: 'devhub.View',
        label: 'Notifications',
        icon: iconsMap.globe,
        selectedIcon: iconsMap.globe__inverted,
        navigatorStyle,
      },
      {
        screen: 'devhub.View',
        label: 'More',
        icon: iconsMap.gear,
        selectedIcon: iconsMap.gear__inverted,
        navigatorStyle,
      },
    ],
    tabsStyle: {
      tabBarButtonColor: theme.base05, // change the color of the tab icons and text
      tabBarSelectedButtonColor: theme.base07, // change the color of the selected tab icon and text
      tabBarBackgroundColor: theme.base00, // change the background color of the tab bar
      borderTopWidth: 0,
    },
  });
}

registerScreens(store, Provider);

iconsLoaded.then(() => {
  startApp();
});
