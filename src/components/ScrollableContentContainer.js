// @flow

import React from 'react';
import styled from 'styled-components/native';

import { contentPadding } from '../styles/variables';

const StyledScrollView = styled.ScrollView`
  flex: 1;
  flex-direction: row;
  align-self: stretch;
`;


type Props = {
  contentContainerStyle?: Object,
  padding?: number,
  style?: Object,
};

export default ({ contentContainerStyle, padding, style, ...props }: Props) => (
  <StyledScrollView
    style={style}
    contentContainerStyle={[{
      marginHorizontal: -padding || -contentPadding,
      paddingHorizontal: padding || contentPadding,
      alignItems: 'center',
    }, contentContainerStyle]}
    alwaysBounceVertical={false}
    alwaysBounceHorizontal={false}
    horizontal
    {...props}
  />
);
