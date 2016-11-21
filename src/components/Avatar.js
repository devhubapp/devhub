// @flow

import React from 'react';
import styled from 'styled-components/native';

const Avatar = styled.View`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: ${({ theme }) => theme.base03};
  border-radius: 4;
`;

type Props = {
  size?: number,
};

export default ({ size = 50, ...props }: Props) => (
  <Avatar size={size} {...props} />
);
