// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Button } from 'react-native';
import { connect } from 'react-redux';

import Themable from '../components/hoc/Themable';
import Screen from '../components/Screen';
import { setTheme as setThemeAction } from '../actions';
import type { State, ThemeObject } from '../utils/types';

const Footer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const mapStateToProps = ({ config }: State) => ({ config });
const mapDispatchToProps = { setTheme: setThemeAction };

@Themable
@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    setTheme: Function,
    theme: ThemeObject,
  };

  render() {
    const { setTheme, theme } = this.props;

    return (
      <Screen>
        <Footer>
          <Button title="Auto" color={theme.base04} onPress={() => setTheme('auto')} />
          <Button title="Light" color={theme.base04} onPress={() => setTheme('light')} />
          <Button title="Dark" color={theme.base04} onPress={() => setTheme('dark')} />
          <Button title="Dark Blue" color={theme.base04} onPress={() => setTheme('dark-blue')} />
        </Footer>
      </Screen>
    );
  }
}
