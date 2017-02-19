// @flow

import { StackNavigator } from 'react-navigation';

import LoginScreen from '../containers/screens/LoginScreen';

export default StackNavigator(
  {
    Login: { path: 'login', screen: LoginScreen },
  },
  {
    headerMode: 'none',
  },
);
