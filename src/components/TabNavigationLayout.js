// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import { Platform, StyleSheet } from 'react-native';
import { StackNavigation, TabNavigation, TabNavigationItem } from '@exponent/ex-navigation';
import Icon from 'react-native-vector-icons/Octicons';

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
      <Icon name={iconName} size={24} color={color} />
      <TabItemText color={color} numberOfLines={1}>{title.toLowerCase()}</TabItemText>
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

@withTheme
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
            renderIcon('Feed', 'home', isSelected, theme.base08, theme.base05)
          )}
        >
          <StackNavigation initialRoute="home" />
        </TabNavigationItem>

        {/*<TabNavigationItem*/}
          {/*id="trending"*/}
          {/*renderIcon={isSelected => (*/}
            {/*renderIcon('Trending', 'pulse', isSelected, theme.base08, theme.base05)*/}
          {/*)}*/}
        {/*>*/}
          {/*<StackNavigation initialRoute="empty"/>*/}
        {/*</TabNavigationItem>*/}

        {
          Platform.OS !== 'ios' ? <TabNavigationItem /> :
          <TabNavigationItem
            id="notifications"
            renderIcon={isSelected => (
              renderIcon('Notifications', 'bell', isSelected, theme.base08, theme.base05)
            )}
          >
            <StackNavigation initialRoute="notifications" />
          </TabNavigationItem>
        }

        <TabNavigationItem
          id="settings"
          renderIcon={isSelected => (
            renderIcon('Me', 'octoface', isSelected, theme.base08, theme.base05)
          )}
        >
          <StackNavigation initialRoute="settings" />
        </TabNavigationItem>
      </TabNavigation>
    );
  }
}
