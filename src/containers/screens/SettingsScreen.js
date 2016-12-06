// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Button } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Themable from '../../components/hoc/Themable';
import Screen from '../../components/Screen';
import * as actionCreators from '../../actions';
import type { ActionCreators, ThemeObject } from '../../utils/types';

const Footer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@Themable
@connect(null, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    theme: ThemeObject,
  };

  render() {
    const { actions: { clearCache, setTheme }, theme } = this.props;

    return (
      <Screen>
        <Footer>
          <Button title="Clear cache" color={theme.base04} onPress={() => clearCache()} />
          <Button title="Auto" color={theme.base04} onPress={() => setTheme('auto')} />
          <Button title="Light" color={theme.base04} onPress={() => setTheme('light')} />
          <Button title="Dark" color={theme.base04} onPress={() => setTheme('dark')} />
          <Button title="Dark Blue" color={theme.base04} onPress={() => setTheme('dark-blue')} />
        </Footer>
      </Screen>
    );
  }
}
