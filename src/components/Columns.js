// @flow

import React from 'react';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { List } from 'immutable';
import { AlertIOS, Dimensions } from 'react-native';

import Column from './Column';
import NewColumn from './NewColumn';
// import ListView from './lists/ListView';
import { contentPadding } from '../styles/variables';
import type { ActionCreators, Column as ColumnType } from '../utils/types';

const margin = 2;
const radius = 4;

const getFullWidth = () => Dimensions.get('window').width;
const getWidth = () => getFullWidth() - (2 * (contentPadding + margin));

const StyledImmutableListViewListView = styled(ImmutableListView)`
  flex: 1;
  overflow: visible;
  background-color: ${({ theme }) => theme.base00};
`;

const ColumnContainer = styled.View`
  flex: 1;
  align-self: center;
  width: ${getWidth};
`;

const StyledColumn = styled(Column)`
  flex: 1;
  margin-horizontal: ${margin};
  margin-vertical: ${margin * 2};
`;

const StyledNewColumn = styled(NewColumn)`
  flex: 1;
  margin-horizontal: ${margin};
  margin-vertical: ${margin * 2};
`;

export default class extends React.PureComponent {
  onPress = () => {
    const { createColumn, loadSubscriptionDataRequest } = this.props.actions;

    AlertIOS.prompt(
      'Enter a Github username:',
      null,
      username => {
        createColumn(username, [`/users/${username}/received_events`]);
        loadSubscriptionDataRequest(username);
      },
    );
  };

  props: {
    actions: ActionCreators,
    columns: Array<ColumnType>,
  };

  renderRow = (column) => {
    if (!column) return null;

    const { id } = column;

    return (
      <ColumnContainer key={`column-${id}`}>
        <StyledColumn
          actions={this.props.actions}
          column={column}
          radius={radius}
        />
      </ColumnContainer>
    );
  };

  render() {
    const { actions, columns = List(), ...props } = this.props;

    if (!(columns.size > 0)) {
      return (
        <ColumnContainer>
          <StyledNewColumn actions={actions} radius={radius} />
        </ColumnContainer>
      );
    }

    return (
      <StyledImmutableListViewListView
        immutableData={columns}
        renderRow={this.renderRow}
        width={getWidth()}
        contentContainerStyle={{ marginHorizontal: contentPadding + margin }}
        horizontal
        pagingEnabled
        {...props}
      />
    );
  }
}
