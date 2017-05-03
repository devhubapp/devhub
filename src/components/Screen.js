/* eslint-env browser */

import React, { PropTypes, PureComponent } from 'react'
import styled, { withTheme } from 'styled-components/native'
import { Platform, StatusBar } from 'react-native'

const getBackgroundColorFromProps = ({ backgroundColor, theme }) =>
  backgroundColor || (theme || {}).base00

export default styled.View`
  flex: 1;
  padding-top: ${Platform.OS === 'ios' ? 22 : 0}px;
  background-color: ${getBackgroundColorFromProps};
`
