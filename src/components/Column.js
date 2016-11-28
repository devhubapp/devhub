// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled, { ThemeProvider } from 'styled-components/native';
import TransparentTextOverlay from './TransparentTextOverlay';

import Card from './Card';
import Themable from './hoc/Themable';
import ListView from './lists/ListView';
import { contentPadding } from '../styles/variables';
import type { ThemeObject } from '../utils/types';

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

const renderHeader = (title, icon = 'home') => (
  <Header>
    <Title>
      <Icon name={icon} size={20}/>&nbsp;&nbsp;
      {title}
    </Title>
  </Header>
);

const renderRow = (item, sectionID, rowID) => (
  <Card key={`column-${sectionID}-${rowID}-card-${item.id}`} event={item} />
);

type Props = {
  id: string,
  title: string,
  items: Array<Object>,
  theme: ThemeObject,
  style?: ?Object,
};

const Component = ({ id, title, items, theme, ...props }: Props): React.Element<*> => (
  <Column {...props}>
    {renderHeader(title)}

    <TransparentTextOverlay color={theme.base02} size={contentPadding} from="bottom">
      <ListView
        data={items}
        renderRow={renderRow}
        initialListSize={5}
      />
    </TransparentTextOverlay>
  </Column>
);

export default Themable(Component);
