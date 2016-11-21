// @flow

import React from 'react';
import styled from 'styled-components/native';

export const paddingHorizontal = 10;

const Column = styled.View`
  background-color: ${({ theme }) => theme.base02};
`;

const Header = styled.View`
  padding-horizontal: ${paddingHorizontal};
  padding-vertical: 12;
  border-width: 0;
  border-bottom-width: 2;
  border-color: ${({ theme }) => theme.base01};
`;

const Title = styled.Text`
  font-size: 20;
  color: ${({ theme }) => theme.base04};
`;

type Props = {
  title: string,
};

export default ({ title, ...props }: Props) => (
  <Column {...props}>
    <Header>
      <Title>{title}</Title>
    </Header>
  </Column>
);
