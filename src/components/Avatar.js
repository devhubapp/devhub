// @flow

import React from 'react';
import styled from 'styled-components/native';
import type ImageSourcePropType from 'react-native/Libraries/Image/ImageSourcePropType';

const Avatar = styled.Image`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: ${({ theme }) => theme.base03};
  border-radius: 4;
`;

type Props = {
  size?: number,
  source: ImageSourcePropType,
};

export default ({ size = 50, ...props }: Props) => (
  <Avatar size={size} {...props} />
);
