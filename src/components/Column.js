// @flow

import React from 'react';
import { AlertIOS, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';

import Card, { iconRightMargin } from './Card';
import Themable from './hoc/Themable';
import TransparentTextOverlay from './TransparentTextOverlay';
import { getDateFromNow } from '../utils/helpers';
import { contentPadding } from '../styles/variables';
import { requestTypes } from '../api/github';
import { generateSubscriptionId } from '../reducers/entities/subscriptions';
import type { ActionCreator, Column, ThemeObject } from '../utils/types';

const Root = styled.View`
  background-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
`;

const StyledTextOverlay = styled(TransparentTextOverlay)`
  border-radius: ${({ radius }) => radius || 0};
`;

const HeaderButtonsContainer = styled.View`
  flex-direction: row;
  padding-right: ${iconRightMargin};
`;

const Title = styled.Text`
  font-size: 20;
  color: ${({ theme }) => theme.base04};
`;

const HeaderButton = styled.TouchableOpacity`
  margin-left: ${contentPadding};
`;

const HeaderButtonText = styled.Text`
  font-size: 14;
  color: ${({ theme }) => theme.base04};
`;

const FixedHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${contentPadding};
  padding-vertical: ${contentPadding};
  border-width: 0;
  border-bottom-width: 1;
  border-color: ${({ theme }) => theme.base01};
`;

// const HiddenHeader = styled.View`
//   margin-top: -16;
//   align-items: center;
//   justify-content: center;
//   overflow: visible;
// `;
//
// const SubHeaderText = styled.Text`
//   text-align: center;
//   font-size: 14;
//   color: ${({ theme }) => theme.base05};
// `;

@Themable
export default class extends React.PureComponent {
  // TODO: refactor this and do it the right way
  onCreateColumnButtonPress = () => {
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

  onRefresh = () => {
    const { column, actions: { updateColumnSubscriptions } } = this.props;
    updateColumnSubscriptions(column.get('id'));
  };

  props: {
    actions: {
      createColumn: ActionCreator,
      createSubscription: ActionCreator,
      deleteColumn: ActionCreator,
      loadSubscriptionDataRequest: ActionCreator,
      loadUserReceivedEvents: ActionCreator,
      starRepo: ActionCreator,
      unstarRepo: ActionCreator,
      updateColumnSubscriptions: ActionCreator,
    },
    column: Column,
    radius?: number,
    style?: ?Object,
    theme: ThemeObject,
  };

  renderRow = (event) => (
    <Card
      key={`card-${event.get('id')}`}
      event={event}
      starRepo={this.props.actions.starRepo}
      unstarRepo={this.props.actions.unstarRepo}
    />
  );

  render() {
    const { actions, radius, theme, ...props } = this.props;

    const { id, events, loading = false, title, updatedAt } = {
      id: this.props.column.get('id'),
      events: this.props.column.get('events'),
      loading: this.props.column.get('loading'),
      title: this.props.column.get('title'),
      updatedAt: this.props.column.get('updatedAt'),
    };

    const updatedText = getDateFromNow(updatedAt) ? `Updated ${getDateFromNow(updatedAt)}` : '';

    return (
      <Root radius={radius} {...props}>
        <FixedHeader>
          <Title>
            <Icon name="home" size={20} />&nbsp;&nbsp;{title}
          </Title>

          <HeaderButtonsContainer>
            <HeaderButton onPress={this.onCreateColumnButtonPress}>
              <HeaderButtonText><Icon name="plus" size={20} /></HeaderButtonText>
            </HeaderButton>

            <HeaderButton onPress={() => actions.deleteColumn(id)}>
              <HeaderButtonText><Icon name="trashcan" size={20} /></HeaderButtonText>
            </HeaderButton>
          </HeaderButtonsContainer>
        </FixedHeader>

        <StyledTextOverlay color={theme.base02} size={contentPadding} from="bottom" radius={radius}>
          <ImmutableListView
            immutableData={events}
            initialListSize={5}
            renderRow={this.renderRow}
            refreshControl={
              <RefreshControl
                refreshing={loading || false}
                onRefresh={this.onRefresh}
                colors={[theme.base08]}
                tintColor={theme.base08}
                title={(loading ? 'Loading...' : (updatedText || ' ')).toLowerCase()}
                titleColor={theme.base05}
                progressBackgroundColor={theme.base02}
              />
            }
          />
        </StyledTextOverlay>
      </Root>
    );
  }
}
