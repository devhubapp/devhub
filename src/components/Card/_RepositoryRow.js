// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import StarButton from '../buttons/StartButton';
import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';
import UserAvatar from './_UserAvatar';

import {
  avatarWidth,
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  RepositoryName,
  Text,
} from './';

import { contentPadding } from '../../styles/variables';
import type { ActionCreators, Repository, ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    forcePushed?: boolean,
    isFork?: boolean,
    narrow?: boolean,
    pushed?: boolean,
    repo: Repository,
    theme?: ThemeObject,
  };

  render() {
    const { actions, forcePushed, isFork, narrow, pushed, repo, theme } = this.props;

    const repoFullName = repo.get('full_name') || repo.get('name') || '';
    const orgName = repoFullName.split('/')[0];
    const repoName = orgName ? repoFullName.split('/')[1] : repoFullName;

    // if (!repoName) return null;

    const avatarUrl = orgName ? `https://github.com/${orgName}.png` : '';

    const repoIcon = (() => {
      if (forcePushed) return 'repo-force-push';
      if (pushed) return 'repo-push';
      if (isFork) return 'repo-forked';
      return 'repo';
    })();

    const starRepo = actions.starRepo.bind(null, repo.get('id'));
    const unstarRepo = actions.unstarRepo.bind(null, repo.get('id'));

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn center>
          <UserAvatar url={avatarUrl} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <FullView>
              <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
                <RepositoryContentContainer>
                  <Text muted><Icon name={repoIcon} />&nbsp;</Text>
                  {orgName && <Text muted>{orgName}/</Text>}

                  <RepositoryName>{repoName}</RepositoryName>
                </RepositoryContentContainer>
              </TransparentTextOverlay>
            </FullView>

            <StarButton
              starred={repo.get('isStarred')}
              starRepoFn={starRepo}
              unstarRepoFn={unstarRepo}
            />
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  }
}
