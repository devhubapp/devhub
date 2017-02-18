/* eslint-env browser */

import React from 'react';
import { AppRegistry } from 'react-native';

const App = () => <p>web</p>;

AppRegistry.registerComponent('devhub', () => App);
AppRegistry.runApplication('devhub', {
  rootTag: document.getElementById('root'),
});
