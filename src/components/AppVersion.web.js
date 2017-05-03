// @flow

import React from 'react'
import styled from 'styled-components'

import { appVersionText } from '../utils/helpers/code-push'

const Text = styled.p`
  color: ${({ theme }) => theme.base05};
  text-align: center;
`

export default class extends React.PureComponent {
  render() {
    const { ...props } = this.props
    delete props.containerStyle
    delete props.buttonProps

    return <Text {...props}>{appVersionText}</Text>
  }
}
