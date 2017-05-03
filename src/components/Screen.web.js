// @flow
/* eslint-env browser */

import React, { PureComponent } from 'react'
import styled, { withTheme } from 'styled-components/native'
import { Platform } from 'react-native'

const getBackgroundColorFromProps = ({ backgroundColor, theme }) =>
  backgroundColor || (theme || {}).base00

const BaseScreen = styled.View`
  flex: 1;
  padding-top: ${Platform.OS === 'ios' ? 22 : 0}px;
  background-color: ${getBackgroundColorFromProps};
`

@withTheme
export default class Screen extends PureComponent {
  static defaultProps = {
    backgroundColor: undefined,
  }

  componentDidMount() {
    this.updateBodyBackgroundColor(this.props)
  }

  componentWillReceiveProps(props) {
    this.updateBodyBackgroundColor(props)
  }

  updateBodyBackgroundColor = props => {
    const backgroundColor = getBackgroundColorFromProps(props)
    if (backgroundColor) document.body.bgColor = backgroundColor
  }

  /* eslint-disable react/no-unused-prop-types */
  props: {
    backgroundColor?: string,
    theme: { base00: string },
  }
  /* eslint-enable */

  render() {
    return <BaseScreen {...this.props} />
  }
}
