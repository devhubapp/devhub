import React from 'react';
import { Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { withTheme } from 'styled-components/native';

const DefaultTabBar = TabNavigator.Presets.Default.tabBarComponent;

export default withTheme(({ theme, ...props }) => (
  <DefaultTabBar
    {...props}
    activeTintColor={theme.brand}
    inactiveTintColor={theme.base05}
    indicatorStyle={{
      backgroundColor: theme.brand,
    }}
    scrollEnabled={false}
    showLabel={Platform.OS !== 'android'}
    showIcon
    style={{
      backgroundColor: theme.base00,
      ...Platform.select({ ios: { padding: 3, borderTopColor: theme.base02 } }),
    }}
  />
));
