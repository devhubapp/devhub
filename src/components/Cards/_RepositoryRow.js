// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import OwnerAvatar from './_OwnerAvatar';
import TouchableRow from './__TouchableRow';
import RepositoryStarButtonContainer from '../../containers/RepositoryStarButtonContainer';

import {
  RepositoryName,
  smallAvatarWidth,
  StyledText,
} from './__CardComponents';

import { getOrgAvatar, getOwnerAndRepo } from '../../utils/helpers/github';
import type { GithubRepo } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    forcePushed?: boolean,
    isFork?: boolean,
    narrow?: boolean,
    pushed?: boolean,
    repo: GithubRepo,
  };

  render() {
    const { forcePushed, isFork, pushed, repo, ...props } = this.props;

    if (!repo) return null;

    const repoFullName = repo.get('full_name') || repo.get('name') || '';
    const { owner: orgName, repo: repoName } = getOwnerAndRepo(repoFullName);

    if (!repoName) return null;

    const repoIcon = (() => {
      if (forcePushed) return 'repo-force-push';
      if (pushed) return 'repo-push';
      if (isFork) return 'repo-forked';
      return 'repo';
    })();

    const isPrivate = repo.get('private') || repo.get('public') === false;

    return (
      <TouchableRow
        left={
          <OwnerAvatar
            avatarURL={getOrgAvatar(orgName)}
            linkURL={repo.get('html_url') || repo.get('url')}
            size={smallAvatarWidth}
          />
        }
        right={
          <RepositoryStarButtonContainer repoId={repo.get('id')} />
        }
        url={repo.get('html_url') || repo.get('url')}
        {...props}
      >
        {isPrivate && <StyledText muted><Icon name="lock" />&nbsp;</StyledText>}
        <StyledText muted><Icon name={repoIcon} />&nbsp;</StyledText>
        <RepositoryName>{repoName}</RepositoryName>

        {orgName && <StyledText muted small> {orgName}</StyledText>}
      </TouchableRow>
    );
  }
}
