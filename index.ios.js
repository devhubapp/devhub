// @flow

import { AppRegistry } from 'react-native';

import { name as appName } from './package.json';

import App from './src/';

AppRegistry.registerComponent(appName, () => App);
