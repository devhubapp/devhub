// @flow

import React from 'react';
import styled from 'styled-components/native';
import { AlertIOS, Dimensions } from 'react-native';

import Column from './Column';
import NewColumn from './NewColumn';
import ListView from './lists/ListView';
import { contentPadding } from '../styles/variables';
import type { ActionCreators, Column as ColumnType } from '../utils/types';

const margin = 2;
const radius = 4;

const getFullWidth = () => Dimensions.get('window').width;
const getWidth = () => getFullWidth() - (2 * (contentPadding + margin));

const StyledListView = styled(ListView)`
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
    const { createColumn, loadUserFeedRequest } = this.props.actions;

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
    actions: ActionCreators,
    columns: Array<ColumnType>,
  };

  renderRow = (item, sectionID, rowID) => (
    <ColumnContainer key={`column-${item.id}-${sectionID}-${rowID}`}>
      <StyledColumn
        id={item.id}
        title={item.title}
        events={item.events}
        loading={item.loading}
        updatedAt={item.updatedAt}
        radius={radius}
        actions={this.props.actions}
      />
    </ColumnContainer>
  );

  render() {
    const { actions, columns = [], ...props } = this.props;

    if (columns.length === 0) return (
      <ColumnContainer>
        <StyledNewColumn
          createColumn={actions.createColumn}
          loadUserFeedRequest={actions.loadUserFeedRequest}
          radius={radius}
        />
      </ColumnContainer>
    );

    return (
      <StyledListView
        data={columns}
        renderRow={this.renderRow}
        width={getWidth()}
        removeClippedSubviews={false}
        initialListSize={1}
        contentContainerStyle={{ marginHorizontal: contentPadding + margin }}
        horizontal
        pagingEnabled
        {...props}
      />
    );
  }
}
