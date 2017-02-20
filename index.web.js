/* eslint-env browser */

import 'babel-polyfill';
import { AppRegistry } from 'react-native';

import App from './src/';

AppRegistry.registerComponent('devhub', () => App);
AppRegistry.runApplication('devhub', {
  rootTag: document.getElementById('root'),
});
