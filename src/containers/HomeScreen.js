// @flow

import React from 'react';
import { connect } from 'react-redux';

import Columns from '../components/Columns';
import Screen from '../components/Screen';
import ThemeProvider from '../components/ThemeProvider';
import { loadUserFeedRequest } from '../actions';
import { loadTheme } from '../reducers/config';
import type { State, ThemeObject } from '../utils/types';

class Page extends React.Component {
  componentDidMount() {
    this.props.loadUserFeedRequest('brunolemos');
  }

  props: State & {
    theme: ThemeObject,
    loadUserFeedRequest: Function,
  };

  render() {
    const { feed, theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Screen>
          <Columns columns={feed} />
        </Screen>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = ({ feed, config }: State) => ({ feed, theme: loadTheme(config) });
const mapDispatchToProps = { loadUserFeedRequest };

export default connect(mapStateToProps, mapDispatchToProps)(Page);
