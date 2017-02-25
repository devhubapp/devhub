// @flow

import React from 'react';
import { ActivityIndicator, Platform, StatusBar } from 'react-native';
import styled from 'styled-components/native';

import Screen from '../../components/Screen';
import { splashScreenBackgroundColor } from '../../styles/variables';
import { base00 } from '../../styles/themes/dark';

const SplashScreen = styled(Screen)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default () => (
  <SplashScreen backgroundColor={splashScreenBackgroundColor}>
    {(Platform.OS === 'ios' || Platform.OS === 'android') &&
      <StatusBar hidden />}
    <ActivityIndicator color={base00} />
  </SplashScreen>
);
