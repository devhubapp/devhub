// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import Column from './Column';
import ListView from './lists/ListView';
import { contentPadding } from '../styles/variables';
import type { Column as ColumnType } from '../utils/types';

const margin = 2;

const getWidth = () => { // { first, last } = {}
  const { width } = Dimensions.get('window');

  // if (first && last) return width;
  // if (first || last) return width - contentPadding - margin;

  return width - (2 * (contentPadding + margin));
};

const StyledListView = styled(ListView)`
  overflow: visible;
`;

const StyledView = styled.View`
  flex: 1;
  width: ${getWidth};
`;

const StyledColumn = styled(Column)`
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
    columns: Array<ColumnType>,
  };

  render() {
    const { columns = [], ...props } = this.props;

    return (
      <StyledListView
        data={columns}
        renderRow={this.renderRow}
        width={getWidth()}
        loop={false}
        removeClippedSubviews={false}
        contentContainerStyle={{ marginHorizontal: contentPadding + margin }}
        initialListSize={1}
        horizontal
        pagingEnabled
        {...props}
      />
    );
  }
}
