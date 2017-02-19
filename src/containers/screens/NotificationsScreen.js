// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import NotificationColumnsContainer from '../NotificationColumnsContainer';
import Screen from '../../components/Screen';
import TabIcon from '../../components/TabIcon';
import { rehydratedSelector } from '../../selectors/app';
import type { State, ThemeObject } from '../../utils/types';

const CenterView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const mapStateToProps = (state: State) => ({
  rehydrated: rehydratedSelector(state),
});

@connect(mapStateToProps)
@withTheme
class NotificationsScreen extends React.PureComponent {
  static navigationOptions;

  props: {
    rehydrated: boolean,
    theme: ThemeObject,
  };

  render() {
    const { rehydrated, theme } = this.props;

    return (
      <Screen>
        {!rehydrated &&
          <CenterView>
            <ActivityIndicator color={theme.base04} />
          </CenterView>}

        {rehydrated && <NotificationColumnsContainer />}
      </Screen>
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
