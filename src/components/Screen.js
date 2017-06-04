// @flow
/* eslint-env browser */

import React, { PureComponent } from 'react'
import styled from 'styled-components/native'

import Platform from '../libs/platform'

const getBackgroundColorFromProps = ({ backgroundColor, theme }) =>
  backgroundColor || (theme || {}).base00

const StyledScreen = styled.View`
  flex: 1;
  padding-top: ${Platform.realOS === 'ios' && Platform.isStandalone ? 22 : 0}px;
  background-color: ${getBackgroundColorFromProps};
`
export default class Screen extends PureComponent {
  props: {
    children?: ReactClass<any>,
    isCurrentRoute?: boolean,
  }

  render() {
    const { children, isCurrentRoute, ...props } = this.props

    return (
      <StyledScreen {...props}>
        {isCurrentRoute === false ? null : children}
      </StyledScreen>
    )
  }
}
