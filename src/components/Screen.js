/* eslint-env browser */

import styled from 'styled-components/native'
import { Platform } from 'react-native'

const getBackgroundColorFromProps = ({ backgroundColor, theme }) =>
  backgroundColor || (theme || {}).base00

export default styled.View`
  flex: 1;
  padding-top: ${Platform.OS === 'ios' ? 22 : 0}px;
  background-color: ${getBackgroundColorFromProps};
`
