// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, ScrollView } from 'react-native';

import Column, { paddingHorizontal } from './Column';

const getWidth = ({ first, last } = {}) => {
  const onlyOne = first && last;
  const { width } = Dimensions.get('window');

  if (onlyOne) return width;
  if (first || last) return width - paddingHorizontal;

  return width - (2 * paddingHorizontal);
};

const StyledScrollView = styled.ScrollView`
  overflow: visible;
`;

const StyledView = styled.View`
  flex: 1;
  width: ${getWidth};
`;

const StyledColumn = styled(Column)`
  flex: 1;
  margin-horizontal: 1;
`;

export default () => (
  <StyledScrollView
    width={getWidth()}
    loop={false}
    removeClippedSubviews={false}
    horizontal
    pagingEnabled
    {...this.props}
  >
    <StyledView first><StyledColumn title="React" /></StyledView>
    <StyledView><StyledColumn title="Redux" /></StyledView>
    <StyledView><StyledColumn title="GraphQL" /></StyledView>
    <StyledView><StyledColumn title="Node.js" /></StyledView>
    <StyledView last><StyledColumn title="PHP" /></StyledView>
  </StyledScrollView>
);
