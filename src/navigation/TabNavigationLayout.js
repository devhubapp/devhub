// @flow

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigation, TabNavigation, TabNavigationItem } from '@exponent/ex-navigation';
import Icon from 'react-native-vector-icons/Octicons';

import Router from './Router';

export default class TabNavigationLayout extends React.Component {
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
          renderIcon={isSelected => this._renderIcon('Feed', 'mark-github', isSelected, theme.base07)}>
          <StackNavigation initialRoute={Router.getRoute('home')} />
        </TabNavigationItem>

        <TabNavigationItem
          id="trending"
          renderIcon={isSelected => this._renderIcon('Trending', 'flame', isSelected, theme.base08)}>
          <StackNavigation initialRoute={Router.getRoute('view')} />
        </TabNavigationItem>

        <TabNavigationItem
          id="notifications"
          renderIcon={isSelected => this._renderIcon('Notifications', 'globe', isSelected, theme.base08)}>
          <StackNavigation initialRoute={Router.getRoute('view')} />
        </TabNavigationItem>

        <TabNavigationItem
          id="settings"
          renderIcon={isSelected => this._renderIcon('Settings', 'gear', isSelected, theme.base08)}>
          <StackNavigation initialRoute={Router.getRoute('settings')} />
        </TabNavigationItem>
      </TabNavigation>
    );
  }

  _renderIcon(title: string, iconName: string, isSelected?: bool, selectedColor?: ?string, color?: ?string): ReactElement<any> {
    const { theme } = this.props;
    const _color = isSelected ? (selectedColor || theme.base07) : (color || theme.base05);

    return (
      <View style={styles.tabItemContainer}>
        <Icon name={iconName} size={28} color={_color} />
        <Text style={[styles.tabTitleText, { color: _color}]} numberOfLines={1}>{title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
    borderTopWidth: 0,
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitleText: {
    fontSize: 11,
  },
});
