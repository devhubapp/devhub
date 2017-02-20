// @flow

import React from 'react';
import { ActivityIndicator, Platform, StatusBar } from 'react-native';
import styled from 'styled-components/native';

import { splashScreenBackgroundColor } from '../../styles/variables';
import { base00 } from '../../styles/themes/dark';

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${splashScreenBackgroundColor};
`;

export default () => (
  <Screen>
    {(Platform.OS === 'ios' || Platform.OS === 'android') &&
      <StatusBar hidden />}
    <ActivityIndicator color={base00} />
  </Screen>
);
