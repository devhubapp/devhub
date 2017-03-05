// @flow

import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import { resetAppDataRequest } from '../../actions';

import Screen from '../../components/Screen';
import { contentPadding, splashScreenBackgroundColor } from '../../styles/variables';
import { base00 } from '../../styles/themes/dark';

const Root = styled(Screen)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ResetButton = styled.TouchableOpacity`
  position: absolute;
  left: ${contentPadding}px;
  right: ${contentPadding}px;
  bottom: ${contentPadding}px;
  opacity: 0.3;
`;

const ResetButtonText = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.base00 || '#000000'};
`;

const mapDispatchToProps = ({ resetAppData: resetAppDataRequest });

type Props = { resetAppData: Function };
const SplashScreen = ({ resetAppData }: Props) => (
  <Root backgroundColor={splashScreenBackgroundColor}>
    {(Platform.OS === 'ios' || Platform.OS === 'android') &&
      <StatusBar hidden />}

    <ActivityIndicator color={base00} />

    <ResetButton onPress={() => resetAppData()} activeOpacity={0.1} focusedOpacity={1}>
      <ResetButtonText>Reset app data</ResetButtonText>
    </ResetButton>
  </Root>
);

export default connect(null, mapDispatchToProps)(SplashScreen);
