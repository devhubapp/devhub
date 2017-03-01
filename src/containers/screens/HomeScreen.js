// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import EventColumnsContainer from '../EventColumnsContainer';
import Screen from '../../components/Screen';
import TabIcon from '../../components/TabIcon';
import { isReadySelector } from '../../selectors/app';
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
class HomeScreen extends React.PureComponent {
  static navigationOptions;

  props: {
    ready: boolean,
    theme: ThemeObject,
  };

  render() {
    const { ready, theme } = this.props;

    return (
      <Screen>
        {!ready &&
          <CenterView>
            <ActivityIndicator color={theme.base04} />
          </CenterView>}

        {ready && <EventColumnsContainer />}
      </Screen>
    );
  }
}

HomeScreen.navigationOptions = {
  tabBar: {
    label: 'Feed',
    icon: ({ tintColor }: { tintColor: 'string' }) => (
      <TabIcon icon="home" color={tintColor} />
    ),
  },
};

export default HomeScreen;
