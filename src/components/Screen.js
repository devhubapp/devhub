/* eslint-env browser */

import styled from 'styled-components/native'
import { SafeAreaView } from 'react-native'

import Platform from '../libs/platform'

const getBackgroundColorFromProps = ({ backgroundColor, theme }) =>
  backgroundColor || (theme || {}).base00

export default styled(SafeAreaView)`
  flex: 1;
  padding-top: ${Platform.realOS === 'ios' && Platform.isStandalone ? 22 : 0}px;
  background-color: ${getBackgroundColorFromProps};
`
