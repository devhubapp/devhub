// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import { Button } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Screen from '../../components/Screen';
import * as actionCreators from '../../actions';
import type { ActionCreators, ThemeObject } from '../../utils/types';

const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const Main = styled.View`
  flex: 1;
`;

const Footer = styled.View`
  justify-content: center;
`;

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@withTheme
@connect(null, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    theme: ThemeObject,
  };

  render() {
    const { actions: { clearAppData, logout, setTheme }, theme } = this.props;

    return (
      <Screen>
        <Wrapper>
          <Main>
            <Button title="Clear app data" color={theme.red} onPress={() => clearAppData()} />
          </Main>

          <Footer>
            <Button title="Auto" color={theme.base04} onPress={() => setTheme('auto')} />
            <Button title="Light" color={theme.base04} onPress={() => setTheme('light')} />
            <Button title="Dark" color={theme.base04} onPress={() => setTheme('dark')} />
            <Button title="Dark Blue" color={theme.base04} onPress={() => setTheme('dark-blue')} />
            <Button title="Logout" color={theme.red} onPress={() => logout()} />
          </Footer>
        </Wrapper>
      </Screen>
    );
  }
}
