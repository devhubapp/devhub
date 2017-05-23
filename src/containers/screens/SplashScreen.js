// @flow

import React from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator, Platform, StatusBar } from 'react-native'
import { connect } from 'react-redux'

import { resetAppData } from '../../actions'

import Screen from '../../components/Screen'
import {
  contentPadding,
  splashScreenBackgroundColor,
} from '../../styles/variables'
import { base04 } from '../../styles/themes/light'

const Root = styled(Screen)`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const ResetButton = styled.TouchableOpacity`
  position: absolute;
  left: ${contentPadding}px;
  right: ${contentPadding}px;
  bottom: ${contentPadding}px;
  opacity: 0.3;
`

const ResetButtonText = styled.Text`
  text-align: center;
  color: ${base04};
`

const mapDispatchToProps = { onResetAppData: resetAppData }

type Props = { onResetAppData: Function }
const SplashScreen = ({ onResetAppData }: Props) => (
  <Root backgroundColor={splashScreenBackgroundColor}>
    {(Platform.OS === 'ios' || Platform.OS === 'android') &&
      <StatusBar hidden />}

    <ActivityIndicator color={base04} />

    <ResetButton
      onPress={() => onResetAppData()}
      activeOpacity={0.1}
      focusedOpacity={1}
    >
      <ResetButtonText>Reset account data</ResetButtonText>
    </ResetButton>
  </Root>
)

export default connect(null, mapDispatchToProps)(SplashScreen)
