// @flow

import React from 'react';
import styled from 'styled-components/native';

const Avatar = styled.View`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 4;
`;

type Props = {
  size?: number,
};

export default ({ size = 80, ...props }: Props) => (
  <Avatar size={size} {...props} />
);
