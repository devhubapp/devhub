// @flow

import React from 'react';
import { AlertIOS, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
import TransparentTextOverlay from './TransparentTextOverlay';

import Card, { iconRightMargin } from './Card';
import Themable from './hoc/Themable';
import ListView from './lists/ListView';
import { getDateFromNow } from '../utils/helpers';
import { contentPadding } from '../styles/variables';
import type { ActionCreator, ThemeObject } from '../utils/types';

const Column = styled.View`
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
  state = {
    isRefreshing: false,
  };

  // TODO: refactor this and do it the right way
  onCreateColumnButtonPress = () => {
    const { createColumn } = this.props.actions;

    AlertIOS.prompt(
      'Enter a Github username:',
      null,
      username => {
        createColumn(username, [`/users/${username}/received_events`]);
      },
    );
  };

  _onRefresh = () => {
    this.setState({ isRefreshing: true });

    const { loadUserFeedRequest } = this.props.actions;
    loadUserFeedRequest('brunolemos');

    // loading indicator will always appear for at least 0,5s
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 1000);
  };

  props: {
    actions: {
      createColumn: ActionCreator,
      deleteColumn: ActionCreator,
      loadUserFeedRequest: ActionCreator,
      starRepo: ActionCreator,
      unstarRepo: ActionCreator,
    },
    events: Array<Object>,
    id: string,
    loading: boolean,
    radius?: number,
    style?: ?Object,
    title: string,
    theme: ThemeObject,
    updatedAt: string,
  };

  renderRow = (item) => (
    <Card
      key={`card-${item.id}`}
      event={item}
      starRepo={this.props.actions.starRepo}
      unstarRepo={this.props.actions.unstarRepo}
    />
  );

  render() {
    const {
      actions,
      id,
      events,
      loading = false,
      radius,
      theme,
      title,
      updatedAt,
      ...props,
    } = this.props;

    const updatedText = getDateFromNow(updatedAt) ? `Updated ${getDateFromNow(updatedAt)}` : '';

    return (
      <Column radius={radius} {...props}>
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
          <ListView
            data={events}
            initialListSize={5}
            renderRow={this.renderRow}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing || loading || false}
                onRefresh={this._onRefresh}
                colors={[theme.base08]}
                tintColor={theme.base08}
                title={(loading ? 'Loading...' : (updatedText || ' ')).toLowerCase()}
                titleColor={theme.base05}
                progressBackgroundColor={theme.base02}
              />
            }
          />
        </StyledTextOverlay>
      </Column>
    );
  }
}
