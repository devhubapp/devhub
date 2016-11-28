// @flow

import React from 'react';
import { connect } from 'react-redux';
import { arrayOf } from 'normalizr';
import { denormalize } from 'denormalizr';

import Columns from '../components/Columns';
import Screen from '../components/Screen';
import ThemeProvider from '../components/ThemeProvider';
import { EventSchema } from '../api/normalizr/schemas';
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
          <Columns columns={feed}/>
        </Screen>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = ({ entities, feed, config }: State) => ({
  feed: (
    feed.map(column => ({
      ...column,
      data: denormalize(column.data, entities, arrayOf(EventSchema)),
    }))
  ),
  theme: loadTheme(config),
});

const mapDispatchToProps = { loadUserFeedRequest };

export default connect(mapStateToProps, mapDispatchToProps)(Page);
