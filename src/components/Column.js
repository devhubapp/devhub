// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled, { ThemeProvider } from 'styled-components/native';

import Card from './Card';
import ListView from './lists/ListView';
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

type Props = {
  title: string,
};

const renderHeader = (title, icon = 'home') => (
  <Header>
    <Title>
      <Icon name={icon} size={20}/>&nbsp;&nbsp;
      {title}
    </Title>
  </Header>
);

const renderRow = (item, sectionID, rowID) => (
  <Card key={`column-${sectionID}-${rowID}-card-${item.id}`} {...item} />
);

export default ({ id, title, data, style, ...props }: Props) => (
  <Column style={style}>
    {renderHeader(title)}

    <ListView
      data={data}
      renderRow={renderRow}
    />
  </Column>
);
