// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, ScrollView } from 'react-native';

import Column from './Column';
import NewColumn from './NewColumn';
import ListView from './lists/ListView';
import { contentPadding } from '../styles/variables';
import type { Column as ColumnType } from '../utils/types';

const margin = 2;

const getFullWidth = () => Dimensions.get('window').width;
const getWidth = () => getFullWidth() - (2 * (contentPadding + margin));

const FullView = styled.View`
  flex: 1;
  width: ${getFullWidth};
`;

const StyledView = styled.View`
  flex: 1;
  width: ${getWidth};
`;

const StyledListView = styled(ListView)`
  overflow: visible;
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
  renderRow = (item, sectionID, rowID) => (
    <StyledView key={`column-${item.id}-${sectionID}-${rowID}`}>
      <StyledColumn
        id={item.id}
        title={item.title}
        items={item.events}
        radius={4}
        actions={this.props.actions}
      />
    </StyledView>
  );

  props: {
    actions: Object<Function>,
    columns: Array<ColumnType>,
  };

  render() {
    const { columns = [], ...props } = this.props;

    return (
      <ScrollView
        horizontal
        pagingEnabled
        contentContainerStyle={{ marginHorizontal: contentPadding + margin }}
        contentOffset={{ x: columns.length > 0 ? getFullWidth() : 0 }}
      >
        <FullView>
          <StyledView>
            <StyledNewColumn
              createColumn={this.props.actions.createColumn}
              loadUserFeedRequest={this.props.actions.loadUserFeedRequest}
              radius={4}
            />
          </StyledView>
        </FullView>

        <FullView>
          <StyledListView
            data={columns}
            renderRow={this.renderRow}
            width={getWidth()}
            removeClippedSubviews={false}
            bounces={false}
            initialListSize={1}
            horizontal
            pagingEnabled
            {...props}
          />
        </FullView>
      </ScrollView>
    );
  }
}
