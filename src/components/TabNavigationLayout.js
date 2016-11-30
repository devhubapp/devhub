// @flow

import React from 'react';
import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { StackNavigation, TabNavigation, TabNavigationItem } from '@exponent/ex-navigation';
import Icon from 'react-native-vector-icons/Octicons';

import Router from '../navigation/Router';
import Themable from './hoc/Themable';
import type { ThemeObject } from '../utils/types';

const TabItemContainer = styled.View`
    align-items: center;
    justify-content: center;
`;

const TabItemText = styled.Text`
    font-size: 11;
    color: ${({ color }) => color};
`;

const renderIcon = (title: string,
                    iconName: string,
                    isSelected: bool,
                    selectedColor: string,
                    normalColor: string): React.Element<any> => {
  const color = isSelected ? selectedColor : normalColor;

  return (
    <TabItemContainer>
      <Icon name={iconName} size={28} color={color} />
      <TabItemText color={color} numberOfLines={1}>{title}</TabItemText>
    </TabItemContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
    borderTopWidth: 0,
  },
});

@Themable
export default class extends React.PureComponent {
  props: {
    theme: ThemeObject,
  };

  render() {
    const { theme } = this.props;

    return (
      <TabNavigation
        tabBarHeight={56}
        initialTab="home"
        tabBarStyle={[styles.container, { backgroundColor: theme.base00 }]}
      >
        <TabNavigationItem
          id="home"
          renderIcon={isSelected => (
            renderIcon('Feed', 'mark-github', isSelected, theme.base07, theme.base05)
          )}
        >
          <StackNavigation initialRoute={Router.getRoute('home')} />
        </TabNavigationItem>

        <TabNavigationItem
          id="trending"
          renderIcon={isSelected => (
            renderIcon('Trending', 'flame', isSelected, theme.base08, theme.base05)
          )}
        >
          <StackNavigation initialRoute={Router.getRoute('view')} />
        </TabNavigationItem>

        <TabNavigationItem
          id="notifications"
          renderIcon={isSelected => (
            renderIcon('Notifications', 'globe', isSelected, theme.base08, theme.base05)
          )}
        >
          <StackNavigation initialRoute={Router.getRoute('view')} />
        </TabNavigationItem>

        <TabNavigationItem
          id="settings"
          renderIcon={isSelected => (
            renderIcon('Settings', 'gear', isSelected, theme.base08, theme.base05)
          )}
        >
          <StackNavigation initialRoute={Router.getRoute('settings')} />
        </TabNavigationItem>
      </TabNavigation>
    );
  }
}
