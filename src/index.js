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
import { iconsMap, iconsLoaded } from './utils/helpers/icon-loader';
import darkTheme from './themes/dark';

const composeEnhancers = composeWithDevTools({ realtime: true });
const store = createStore(reducer, composeEnhancers(autoRehydrate()));
persistStore(store, { storage: AsyncStorage, blacklist: ['theme'] });

const navigatorStyle = {
  screenColor: darkTheme.base00,
  navBarHidden: true,
};

function startApp() {
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
      tabBarButtonColor: '#3f3f3f', // change the color of the tab icons and text (also unselected)
      tabBarSelectedButtonColor: '#ffffff', // change the color of the selected tab icon and text (only selected)
      tabBarBackgroundColor: '#111111', // change the background color of the tab bar
    },
  });
}

registerScreens(store, Provider);

iconsLoaded.then(() => {
  startApp();
});
