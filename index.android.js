// @flow

import codePush from 'react-native-code-push';
import { AppRegistry } from 'react-native';

import { name as appName } from './package.json';

import App from './src/';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
};

AppRegistry.registerComponent(appName, () => codePush(codePushOptions)(App));
