// @flow

import React from 'react';

import RepoRow from './_RepositoryRow';
import RowList from './__RowList';

import type { GithubRepo } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    repos: Array<GithubRepo>,
    maxHeight?: number,
  };

  renderRow = (passProps = {}) => repo => (
    <RepoRow
      key={`repo-row-${repo.get('id')}`}
      repo={repo}
      narrow
      {...passProps}
    />
  );

  render() {
    const { maxHeight, repos, ...props } = this.props;

    if (!(repos && repos.size > 0)) return null;

    return (
      <RowList data={repos} maxHeight={maxHeight} renderRow={this.renderRow(props)} {...props} />
    );
  }
}
