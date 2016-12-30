// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import RepositoryStarButtonContainer from '../../containers/RepositoryStarButtonContainer';
import { withTheme } from 'styled-components/native';
import TransparentTextOverlay from '../TransparentTextOverlay';
import OwnerAvatar from './_OwnerAvatar';

import {
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  RepositoryName,
  smallAvatarWidth,
  StyledText,
} from './__CardComponents';

import { contentPadding, radius } from '../../styles/variables';
import { getOrgAvatar, getOwnerAndRepo } from '../../utils/helpers/github';
import type { Repository, ThemeObject } from '../../utils/types';

@withTheme
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
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn center>
          <OwnerAvatar url={getOrgAvatar(orgName)} size={smallAvatarWidth} />
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
                  {isPrivate && <StyledText muted><Icon name="lock" />&nbsp;</StyledText>}
                  <StyledText muted><Icon name={repoIcon} />&nbsp;</StyledText>
                  <RepositoryName>{repoName}</RepositoryName>
                  
                  {orgName && <StyledText muted small> {orgName}</StyledText>}

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
