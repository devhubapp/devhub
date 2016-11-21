// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import Column from './Column';
import { contentPadding } from '../themes/variables';

const margin = 2;

const getWidth = ({ first, last } = {}) => {
  const onlyOne = first && last;
  const { width } = Dimensions.get('window');

  if (onlyOne) return width;
  if (first || last) return width - contentPadding;

  return width - (2 * contentPadding);
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
  margin: ${margin};
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
