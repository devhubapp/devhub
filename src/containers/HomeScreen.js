// @flow

import React from 'react';
import { connect } from 'react-redux';
import { arrayOf } from 'normalizr';
import { denormalize } from 'denormalizr';

import Columns from '../components/Columns';
import Screen from '../components/Screen';
import ThemeProvider from '../components/ThemeProvider';
import { ColumnSchema } from '../utils/normalizr/schemas';
import { createColumn, loadUserFeedRequest } from '../actions';
import { loadTheme } from '../reducers/config';
import type { State, ThemeObject } from '../utils/types';

class Page extends React.Component {
  componentDidMount() {
    this.props.createColumn('sibelius', ['/users/sibelius/received_events']);
    this.props.loadUserFeedRequest('sibelius');

    this.props.createColumn('brunolemos', ['/users/brunolemos/received_events']);
    this.props.loadUserFeedRequest('brunolemos');
  }

  props: State & {
    createColumn: Function,
    loadUserFeedRequest: Function,
    theme: ThemeObject,
  };

  render() {
    const { columns, theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Screen>
          <Columns columns={columns}/>
        </Screen>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = ({ entities, config }: State) => ({
  columns: denormalize(Object.keys(entities.columns), entities, arrayOf(ColumnSchema)),
  theme: loadTheme(config),
});

const mapDispatchToProps = { createColumn, loadUserFeedRequest };

export default connect(mapStateToProps, mapDispatchToProps)(Page);
