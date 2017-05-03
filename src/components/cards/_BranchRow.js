// @flow

import React from 'react'

import Icon from '../../libs/icon'
import TouchableRow from './__TouchableRow'

import { StyledText } from './__CardComponents'

import { getGitHubURLForBranch } from '../../utils/helpers/github/url'
import type { GithubEventType } from '../../utils/types'

export default class BranchRow extends React.PureComponent {
  props: {
    branch: string,
    narrow: boolean,
    repoFullName: string,
    read?: boolean,
    type: GithubEventType,
  }

  render() {
    const { branch: _branch, repoFullName, read, type, ...props } = this.props

    const branch = (_branch || '').replace('refs/heads/', '')
    if (!branch) return null

    const isBranchMainEventAction =
      type === 'CreateEvent' || type === 'DeleteEvent'
    if (branch === 'master' && !isBranchMainEventAction) return null

    return (
      <TouchableRow
        url={getGitHubURLForBranch(repoFullName, branch)}
        read={read}
        {...props}
      >
        <StyledText numberOfLines={1} muted={!isBranchMainEventAction || read}>
          <StyledText muted={read}><Icon name="git-branch" />&nbsp;</StyledText>
          {branch}
        </StyledText>
      </TouchableRow>
    )
  }
}
