// @flow

import React from 'react'
import styled from 'styled-components/native'

import WebView from '../../components/WebView'
import Screen from '../../components/Screen'

const StyledWebView = styled(WebView)`
  flex: 1;
`

type Props = { navigation: Object }

const BrowserScreen = ({
  navigation: { state: { params: { uri, ...params } } },
  ...props
}: Props) => (
  <Screen>
    <StyledWebView source={{ uri }} {...params} {...props} />
  </Screen>
)

export default BrowserScreen
