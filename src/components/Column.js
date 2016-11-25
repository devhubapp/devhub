// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled, { ThemeProvider } from 'styled-components/native';

import Card from './Card';
import { contentPadding } from '../styles/variables';

const Column = styled.View`
  background-color: ${({ theme }) => theme.base02};
`;

const Header = styled.View`
  padding-horizontal: ${contentPadding};
  padding-vertical: ${contentPadding};
  border-width: 0;
  border-bottom-width: 1;
  border-color: ${({ theme }) => theme.base01};
`;

const Title = styled.Text`
  font-size: 20;
  color: ${({ theme }) => theme.base04};
`;

const CardsContainer = styled.ScrollView`
`;

type Props = {
  title: string,
};

export default ({ id, title, data, style, ...props }: Props) => (
  <Column style={style}>
    <Header>
      <Title>
        <Icon name="home" size={20}/>&nbsp;&nbsp;
        {title}
      </Title>
    </Header>

    <CardsContainer>
      {
        data.map(item => (
          <Card key={`column-${id}-card-${item.id}`} {...item} />
        ))
      }
    </CardsContainer>
  </Column>
);
