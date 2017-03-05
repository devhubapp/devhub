// @flow

import { Platform } from 'react-native';

import LoginScreen from '../containers/screens/LoginScreen';
import { StackNavigator } from '../libs/navigation';

export const routes = { login: { path: 'login', screen: LoginScreen } };
export const config = { headerMode: 'none' };

export default (Platform.OS === 'ios' || Platform.OS === 'android'
  ? StackNavigator(routes, config)
  : LoginScreen);
