// @flow

import React from 'react'
import codePush from 'react-native-code-push'
import styled from 'styled-components/native'

import { contentPadding } from '../styles/variables'
import {
  appDisplayName,
  appVersionText,
  getStatusText,
  isCodePushRunningSomeTask,
} from '../utils/helpers/code-push'

const Button = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding-horizontal: ${contentPadding}px;
`

const Text = styled.Text`
  color: ${({ theme }) => theme.base05};
  text-align: center;
`

export default class AppVersion extends React.PureComponent {
  static defaultProps = {
    buttonProps: {},
    containerStyle: undefined,
    showAppName: false,
  }

  state = { status: -1 }
  timeout = null

  checkForAppUpdate = () => {
    codePush.sync(
      {
        updateDialog: true,
        installMode: codePush.InstallMode.IMMEDIATE,
      },
      status => {
        clearTimeout(this.timeout)

        this.setState({ status }, () => {
          if (isCodePushRunningSomeTask(status)) return

          this.timeout = setTimeout(() => {
            this.setState({ status: -1 })
          }, 2000)
        })
      },
    )
  }

  props: {
    showAppName?: ?boolean,
    containerStyle?: ?Object,
    buttonProps?: Object,
  }

  render() {
    const { status } = this.state
    const { containerStyle, buttonProps, showAppName, ...props } = this.props

    const statusText = getStatusText(status)

    return (
      <Button
        onPress={this.checkForAppUpdate}
        style={containerStyle}
        {...buttonProps}
      >
        {showAppName &&
          statusText === appVersionText && (
            <Text {...props}>{appDisplayName} </Text>
          )}
        <Text {...props}>{statusText}</Text>
      </Button>
    )
  }
}
