// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import RepositoryStarButtonContainer from '../../containers/RepositoryStarButtonContainer';
import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';
import UserAvatar from './_UserAvatar';

import {
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  RepositoryName,
  smallAvatarWidth,
  Text,
} from './';

import { contentPadding, radius } from '../../styles/variables';
import { getOrgAvatar, getOwnerAndRepo } from '../../utils/helpers/github';
import type { Repository, ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    forcePushed?: boolean,
    isFork?: boolean,
    narrow?: boolean,
    pushed?: boolean,
    repo: Repository,
    theme?: ThemeObject,
  };

  render() {
    const { forcePushed, isFork, narrow, pushed, repo, theme, ...props } = this.props;

    const repoFullName = repo.get('full_name') || repo.get('name') || '';
    const { owner: orgName, repo: repoName } = getOwnerAndRepo(repoFullName);

    // if (!repoName) return null;

    const repoIcon = (() => {
      if (forcePushed) return 'repo-force-push';
      if (pushed) return 'repo-push';
      if (isFork) return 'repo-forked';
      return 'repo';
    })();

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn center>
          <UserAvatar url={getOrgAvatar(orgName)} size={smallAvatarWidth} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <FullView>
              <TransparentTextOverlay
                color={theme.base01}
                size={contentPadding}
                from="horizontal"
                radius={radius}
              >
                <RepositoryContentContainer>
                  <Text muted><Icon name={repoIcon} />&nbsp;</Text>
                  <RepositoryName>{repoName}</RepositoryName>
                  
                  {orgName && <Text muted> {orgName}</Text>}

                </RepositoryContentContainer>
              </TransparentTextOverlay>
            </FullView>

            <RepositoryStarButtonContainer repoId={repo.get('id')} />
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  }
}
