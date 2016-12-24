// @flow

import React from 'react';
import styled from 'styled-components/native';
import { List } from 'immutable';

import Columns, { columnMargin, ColumnWrapper } from './_Columns';
import ColumnContainer from '../../containers/EventColumnContainer';
import CreateColumnUtils from '../utils/CreateColumnUtils';
import { radius } from '../../styles/variables';
import type { ActionCreators, Column as ColumnType } from '../../utils/types';

const StyledColumnContainer = styled(ColumnContainer)`
  flex: 1;
  margin-horizontal: ${columnMargin};
  margin-vertical: ${columnMargin * 2};
`;

export default class extends React.PureComponent {
  addColumnFn = () => {
    CreateColumnUtils.showColumnTypeSelectAlert(this.props.actions);
  };

  props: {
    actions: ActionCreators,
    columns: Array<ColumnType>,
  };

  renderRow = (column) => {
    if (!column) return null;

    const columnId = column.get('id');
    if (!columnId) return null;

    return (
      <ColumnWrapper key={`event-column-${columnId}`}>
        <StyledColumnContainer
          columnId={columnId}
          radius={radius}
        />
      </ColumnWrapper>
    );
  };

  render() {
    const { columns = List(), ...props } = this.props;

    return (
      <Columns
        key="event-columns"
        addColumnFn={this.addColumnFn}
        columns={columns}
        renderRow={this.renderRow}
        {...props}
      />
    );
  }
}
