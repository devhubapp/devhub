// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import Column from './Column';
import ListView from './lists/ListView';
import { contentPadding } from '../styles/variables';

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
  border-radius: 4;
`;

const renderRow = (item, sectionID, rowID) => (
  <StyledView key={`column-${item.id}-${sectionID}-${rowID}`}>
    <StyledColumn id={item.id} title={item.title} data={item.data} />
  </StyledView>
);

export default ({ data = [], ...props }) => (
  <StyledListView
    data={data}
    renderRow={renderRow}
    width={getWidth()}
    loop={false}
    removeClippedSubviews={false}
    contentContainerStyle={{ marginHorizontal: contentPadding + margin }}
    horizontal
    pagingEnabled
    {...props}
  />
);
