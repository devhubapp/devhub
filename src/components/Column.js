// @flow

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
import TransparentTextOverlay from './TransparentTextOverlay';

import Card from './Card';
import Themable from './hoc/Themable';
import ListView from './lists/ListView';
import { contentPadding, mutedTextOpacity } from '../styles/variables';
import type { ThemeObject } from '../utils/types';

const Column = styled.View`
  background-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
`;

const StyledTextOverlay = styled(TransparentTextOverlay)`
  border-radius: ${({ radius }) => radius || 0};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

const HeaderButtonText = styled.Text`
  font-size: 14;
  color: ${({ theme }) => theme.base04};
  opacity: ${mutedTextOpacity};
`;

@Themable
export default class extends React.PureComponent {
  renderHeader = (title, icon = 'home') => (
    <Header>
      <Title>
        <Icon name={icon} size={20} />&nbsp;&nbsp;
        {title}

      </Title>

      <View>
        <TouchableOpacity onPress={() => this.props.actions.deleteColumn(this.props.id)}>
          <HeaderButtonText><Icon name="trashcan" size={20} /></HeaderButtonText>
        </TouchableOpacity>
      </View>
    </Header>
  );

  renderRow = (item, sectionID, rowID) => (
    <Card
      key={`column-${sectionID}-${rowID}-card-${item.id}`}
      event={item}
      starRepo={this.props.actions.starRepo}
      unstarRepo={this.props.actions.unstarRepo}
    />
  );

  props: {
    actions: {
      deleteColumn: Function,
      starRepo: Function,
      unstarRepo: Function,
    },
    id: string,
    items: Array<Object>,
    radius?: number,
    style?: ?Object,
    title: string,
    theme: ThemeObject,
  };

  render() {
    const { title, items, radius, theme, ...props } = this.props;

    return (
      <Column radius={radius} {...props}>
        {this.renderHeader(title)}

        <StyledTextOverlay color={theme.base02} size={contentPadding} from="bottom" radius={radius}>
          <ListView
            data={items}
            renderRow={this.renderRow}
            initialListSize={5}
          />
        </StyledTextOverlay>
      </Column>
    );
  }
}
