// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import TouchableRow from './__TouchableRow';

import {
  StyledText,
} from './__CardComponents';

import { getGitHubURLForBranch } from '../../utils/helpers';
import type { GithubEventType } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    branch: string,
    narrow: boolean,
    repoFullName: string,
    type: GithubEventType,
  };

  render() {
    const { branch: _branch, repoFullName, type, ...props } = this.props;

    const branch = (_branch || '').replace('refs/heads/', '');
    if (!branch) return null;

    const isBranchMainEventAction = type === 'CreateEvent' || type === 'DeleteEvent';
    if (branch === 'master' && !isBranchMainEventAction) return null;

    return (
      <TouchableRow
        url={getGitHubURLForBranch(repoFullName, branch)}
        {...props}
      >
        <StyledText numberOfLines={1} muted={!isBranchMainEventAction}>
          <Icon name="git-branch" />&nbsp;
          {branch}
        </StyledText>
      </TouchableRow>
    );
  }
}
