// @flow

import React from 'react';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import { arrayOf } from 'normalizr';
import { denormalize } from 'denormalizr';

import Columns from '../components/Columns';
import Screen from '../components/Screen';
import { ColumnSchema } from '../utils/normalizr/schemas';
import { createColumn, loadUserFeedRequest } from '../actions';
import type { Column, State } from '../utils/types';

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

const mapStateToProps = ({ entities }: State) => ({
  columns: denormalizeWithCache(Object.keys(entities.columns), entities, arrayOf(ColumnSchema)),
});

const mapDispatchToProps = { createColumn, loadUserFeedRequest };

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    columns: Array<Column>,
  };

  render() {
    const { columns } = this.props;

    return (
      <Screen>
        <Columns columns={columns} />
      </Screen>
    );
  }
}
