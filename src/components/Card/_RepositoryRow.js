// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import RepositoryStarButtonContainer from '../../containers/RepositoryStarButtonContainer';
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
    const { forcePushed, isFork, narrow, pushed, repo, theme } = this.props;

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

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn center>
          <UserAvatar url={avatarUrl} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <FullView>
              <TransparentTextOverlay color={theme.base01} size={contentPadding} from="horizontal">
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
