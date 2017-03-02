// @flow

import React from 'react';

import CommitRow from './_CommitRow';
import RowList from './__RowList';

import type { Commit } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    commits: Array<Commit>,
    maxHeight?: number,
  };

  makeRenderItem = (passProps = {}) => ({ index, item: commit }) => (
    commit &&
    <CommitRow
      key={`commit-row-${commit.get('sha')}`}
      commit={commit}
      narrow
      {...passProps}
    />
  );

  render() {
    const { maxHeight, commits, ...props } = this.props;

    if (!(commits && commits.size > 0)) return null;

    return (
      <RowList data={commits} maxHeight={maxHeight} renderItem={this.makeRenderItem(props)} {...props} />
    );
  }
}
