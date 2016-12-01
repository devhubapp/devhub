// @flow

import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Octicons';
import { AlertIOS } from 'react-native';

import Themable from './hoc/Themable';
import { generateSubscriptionId } from '../reducers/entities/subscriptions';
import { requestTypes } from '../api/github';

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
  font-size: 20;
  color: ${({ theme }) => theme.base05};
`;

@Themable
export default class extends React.PureComponent {
  onPress = () => {
    const { createColumn, createSubscription, loadUserReceivedEvents } = this.props.actions;

    AlertIOS.prompt(
      'Enter a Github username:',
      null,
      username => {
        const params = { username };
        const subscriptionId = generateSubscriptionId(requestTypes.USER_RECEIVED_EVENTS, params);
        createSubscription(subscriptionId, requestTypes.USER_RECEIVED_EVENTS, params);
        createColumn(username, [subscriptionId]);
        loadUserReceivedEvents(username);
      },
    );
  };

  props: {
    actions: {
      createColumn: Function,
      createSubscription: Function,
      loadUserReceivedEvents: Function,
    },
    radius?: number,
    style?: ?Object,
  };

  render() {
    const { radius, ...props } = this.props;

    return (
      <Column radius={radius} {...props}>
        <NewColumnButton onPress={this.onPress}>
          <NewColumnText>
            <Icon name="plus" size={30} />{'\n'}
            add new column
          </NewColumnText>
        </NewColumnButton>
      </Column>
    );
  }
}
