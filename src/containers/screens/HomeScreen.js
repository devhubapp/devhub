// @flow

import React from 'react';
import { isEqual } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { arrayOf } from 'normalizr';
import { denormalize } from 'denormalizr';

import Columns from '../../components/Columns';
import Screen from '../../components/Screen';
import { ColumnSchema } from '../../utils/normalizr/schemas';
import * as actionCreators from '../../actions';
import type { ActionCreators, Column, State } from '../../utils/types';

let previousIds = [];
let previousEntities = {};
let previousDenormalizedData = [];
const denormalizeWithCache = (ids = [], entities = {}, ...args) => {
  const hasChanged = !(isEqual(ids, previousIds) && isEqual(entities, previousEntities));
  previousIds = ids;
  previousEntities = entities;

  if (hasChanged) previousDenormalizedData = denormalize(ids, entities, ...args);
  return previousDenormalizedData;
};

const mapStateToProps = ({ app, entities }: State) => ({
  columns: denormalizeWithCache(Object.keys(entities.columns), entities, arrayOf(ColumnSchema)),
  rehydrated: app.rehydrated,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columns: Array<Column>,
  };

  render() {
    const { actions, columns, rehydrated } = this.props;

    return (
      <Screen>
        {rehydrated ? <Columns columns={columns} actions={actions} /> : null}
      </Screen>
    );
  }
}
