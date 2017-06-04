// @flow
/* eslint-env browser */

import React, { PureComponent } from 'react'
import styled, { withTheme } from 'styled-components/native'

import Platform from '../libs/platform'
import { Helmet } from '../libs/helmet'

const getBackgroundColorFromProps = ({ backgroundColor, theme }) =>
  backgroundColor || (theme || {}).base00

const BaseScreen = styled.View`
  flex: 1;
  padding-top: ${Platform.realOS === 'ios' && Platform.isStandalone ? 22 : 0}px;
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
    children?: ReactClass<any>,
    helmet?: Array<ReactClass<any>>,
    isCurrentRoute?: boolean,
    theme: { base00: string },
    title?: string,
  }
  /* eslint-enable */

  render() {
    const { children, helmet, isCurrentRoute, title, ...props } = this.props

    if (isCurrentRoute === false) return null

    return (
      <BaseScreen {...props}>
        {isCurrentRoute === true &&
          Array.isArray(helmet) &&
          <Helmet>
            {helmet}
            {Boolean(title) && <title>{title}</title>}
          </Helmet>}

        {children}
      </BaseScreen>
    )
  }
}
