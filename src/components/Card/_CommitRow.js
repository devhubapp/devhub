// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';
import UserAvatar from './_UserAvatar';

import {
  avatarWidth,
  CardText,
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
} from './';

import { contentPadding, radius } from '../../styles/variables';
import type { Commit, ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    commit: Commit,
    narrow?: boolean,
    theme?: ThemeObject,
  };

  render() {
    const { commit, narrow, theme } = this.props;

    if (!commit) return null;

    const message = (commit.get('message') || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!message) return null;

    const author = commit.get('author');

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn center>
          <UserAvatar url={author.get('avatar_url')} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <FullView>
              <TransparentTextOverlay
                color={theme.base01}
                size={contentPadding}
                from="right"
                radius={radius}
              >
                <RepositoryContentContainer>
                  <CardText numberOfLines={1}>
                    <Icon name="git-commit" />&nbsp;
                    {message}
                  </CardText>
                </RepositoryContentContainer>
              </TransparentTextOverlay>
            </FullView>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  }
}
