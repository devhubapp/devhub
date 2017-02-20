// @flow

import { Platform } from 'react-native';

import LoginScreen from '../containers/screens/LoginScreen';
import { StackNavigator } from '../libs/navigation';

export const routes = { Login: { path: 'login', screen: LoginScreen } };
export const options = { headerMode: 'none' };

export default (Platform.OS === 'ios' || Platform.OS === 'android'
  ? StackNavigator(routes, options)
  : LoginScreen);
