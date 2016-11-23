// @flow

import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';

import Columns from '../components/Columns';
import Screen from '../components/Screen';
import { loadTheme } from '../reducers/config';
import { setTheme } from '../actions';
import type { State, ThemeObject } from '../utils/types';

class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    }
  };

  props: {
    setTheme: Function,
    theme: ThemeObject,
  };

  render() {
    const { theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Screen>
          <Columns />
        </Screen>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = ({ config }: State) => ({ config, theme: loadTheme(config) });
const mapDispatchToProps = { setTheme };

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
