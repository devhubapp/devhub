// @flow
/* eslint-disable import/prefer-default-export */

import React from 'react';
import { View } from 'react-native';
import { Navigation } from 'react-native-navigation';

// public screens
import App from '../containers/App';

export function registerScreens(store, provider) {
  Navigation.registerComponent('devhub.App', () => App, store, provider);
  Navigation.registerComponent('devhub.View', () => () => <View />, store, provider);
}
