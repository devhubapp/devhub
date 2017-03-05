// @flow

import React from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import debounce from '../../utils/hoc/debounce';
import withIsCurrentRoute from '../../utils/hoc/withIsCurrentRoute';
import NotificationColumnsContainer from '../NotificationColumnsContainer';
import Screen from '../../components/Screen';
import TabIcon from '../../components/TabIcon';
import { getMainNavigationState, isReadySelector } from '../../selectors';
import type { State, ThemeObject } from '../../utils/types';

const CenterView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const mapStateToProps = (state: State) => ({
  ready: isReadySelector(state),
});

@connect(mapStateToProps)
@withTheme
@withIsCurrentRoute(getMainNavigationState)
@debounce(({ isCurrentRoute }) => (isCurrentRoute ? 0 : 10))
class NotificationsScreen extends React.PureComponent {
  static navigationOptions;

  props: {
    ready: boolean,
    theme: ThemeObject,
  };

  render() {
    const { ready, theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Screen>
          {!ready &&
            <CenterView>
              <ActivityIndicator color={theme.base04} />
            </CenterView>}

          {ready && <NotificationColumnsContainer />}
        </Screen>
      </ThemeProvider>
    );
  }
}

NotificationsScreen.navigationOptions = {
  tabBar: {
    label: 'Notifications',
    icon: ({ tintColor }: { tintColor: 'string' }) => (
      <TabIcon icon="bell" color={tintColor} />
    ),
  },
};

export default NotificationsScreen;
