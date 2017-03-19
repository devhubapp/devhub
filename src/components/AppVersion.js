// @flow

import React from 'react';
import codePush from 'react-native-code-push';
import styled from 'styled-components/native';

import { contentPadding } from '../styles/variables';
import { getStatusText, isCodePushRunningSomeTask } from '../utils/helpers/code-push';

const Button = styled.TouchableOpacity`
  padding-horizontal: ${contentPadding}px;
`;

const Text = styled.Text`
  color: ${({ theme }) => theme.base05};
  text-align: center;
`;

export default class extends React.PureComponent {
  static defaultProps = {
    buttonProps: {},
    containerStyle: undefined,
  };

  state = { status: -1 };
  timeout = null;

  checkForAppUpdate = () => {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
    }, status => {
      clearTimeout(this.timeout);

      this.setState({ status }, () => {
        if (isCodePushRunningSomeTask(status)) return;

        this.timeout = setTimeout(() => {
          this.setState({ status: -1 });
        }, 2000);
      });
    });
  };

  props: {
    containerStyle?: ?Object,
    buttonProps?: Object,
  };

  render() {
    const { status } = this.state;
    const { containerStyle, buttonProps, ...props } = this.props;

    return (
      <Button onPress={this.checkForAppUpdate} style={containerStyle} {...buttonProps}>
        <Text {...props}>{getStatusText(status)}</Text>
      </Button>
    );
  }
}
