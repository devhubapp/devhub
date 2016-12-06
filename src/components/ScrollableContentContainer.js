// @flow

import React from 'react';
import styled from 'styled-components/native';

const StyledScrollView = styled.ScrollView`
  flex: 1;
  flex-direction: row;
  align-self: stretch;
`;


type Props = {
  contentContainerStyle?: Object,
  style?: Object,
};

export default ({ contentContainerStyle, style, ...props }: Props) => (
  <StyledScrollView
    style={style}
    contentContainerStyle={[{
      alignItems: 'center',
    }, contentContainerStyle]}
    alwaysBounceVertical={false}
    alwaysBounceHorizontal={false}
    horizontal
    {...props}
  />
);
