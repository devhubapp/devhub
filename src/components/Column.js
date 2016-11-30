// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
import TransparentTextOverlay from './TransparentTextOverlay';

import Card from './Card';
import Themable from './hoc/Themable';
import ListView from './lists/ListView';
import { contentPadding } from '../styles/variables';
import type { ThemeObject } from '../utils/types';

const Column = styled.View`
  background-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
`;

const StyledTextOverlay = styled(TransparentTextOverlay)`
  border-radius: ${({ radius }) => radius || 0};
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
      <Icon name={icon} size={20} />&nbsp;&nbsp;
      {title}
    </Title>
  </Header>
);

const renderRow = (item, sectionID, rowID) => (
  <Card key={`column-${sectionID}-${rowID}-card-${item.id}`} event={item} />
);

@Themable
export default class extends React.PureComponent {
  props: {
    id: string,
    title: string,
    items: Array<Object>,
    radius?: number,
    style?: ?Object,
    theme: ThemeObject,
  };

  render() {
    const { title, items, radius, theme, ...props } = this.props;

    return (
      <Column radius={radius} {...props}>
        {renderHeader(title)}

        <StyledTextOverlay color={theme.base02} size={contentPadding} from="bottom" radius={radius}>
          <ListView
            data={items}
            renderRow={renderRow}
            initialListSize={5}
          />
        </StyledTextOverlay>
      </Column>
    );
  }
}
