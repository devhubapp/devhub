// @flow

import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Octicons';
import { AlertIOS } from 'react-native';

import Themable from './hoc/Themable';

const Column = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
`;

const NewColumnButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const NewColumnText = styled.Text`
  align-self: center;
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
          <NewColumnText>
            <Icon name="plus" size={40} />{'\n'}
            add new column
          </NewColumnText>
        </NewColumnButton>
      </Column>
    );
  }
}
