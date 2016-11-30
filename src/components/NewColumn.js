// @flow

import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Octicons';
import { AlertIOS } from 'react-native';

import Themable from './hoc/Themable';

const Column = styled.View`
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
`;

const NewColumnButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 50;
  height: 50;
  background-color: ${({ theme }) => theme.base03};
  border-radius: 8;
`;

const NewColumnIcon = styled(Icon)`
  align-self: center;
  margin-right: -6;
  text-align: center;
  font-size: 24;
  color: ${({ theme }) => theme.base05};
`;

@Themable
export default class extends React.PureComponent {
  onPress = () => {
    const { createColumn, loadUserFeedRequest } = this.props;

    AlertIOS.prompt(
      'Enter a Github username:',
      null,
      username => {
        createColumn(username, [`/users/${username}/received_events`]);
        loadUserFeedRequest(username);
      },
    );
  };

  props: {
    createColumn: Function,
    loadUserFeedRequest: Function,
    radius?: number,
    style?: ?Object,
  };

  render() {
    const { radius, ...props } = this.props;

    return (
      <Column radius={radius} {...props}>
        <NewColumnButton onPress={this.onPress}>
          <NewColumnIcon name="plus" />
        </NewColumnButton>
      </Column>
    );
  }
}
