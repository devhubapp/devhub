// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import { withTheme } from 'styled-components/native';
import TransparentTextOverlay from '../TransparentTextOverlay';
import UserAvatar from './_UserAvatar';

import {
  CardText,
  ContentRow,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  smallAvatarWidth,
  Text,
} from './EventCard';

import { contentPadding, radius } from '../../styles/variables';
import { trimNewLinesAndSpaces, tryGetUsernameFromGithubEmail } from '../../utils/helpers';
import type { Commit, ThemeObject } from '../../utils/types';

@withTheme
export default class extends React.PureComponent {
  props: {
    commit: Commit,
    narrow?: boolean,
    theme?: ThemeObject,
  };

  render() {
    const { commit, narrow, theme, ...props } = this.props;

    if (!commit) return null;

    const message = trimNewLinesAndSpaces(commit.get('message'));
    if (!message) return null;

    const authorName = commit.getIn(['author', 'name']);
    const authorEmail = commit.getIn(['author', 'email']);
    const authorUsername = tryGetUsernameFromGithubEmail(authorEmail);

    let byText = authorName;
    if (authorUsername) byText += ` @${authorUsername}`;
    if (authorEmail && !authorUsername) byText += byText ? ` <${authorEmail}>` : ` ${authorEmail}`;
    byText = trimNewLinesAndSpaces(byText);

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn center>
          <UserAvatar email={authorEmail} size={smallAvatarWidth} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay
              color={theme.base01}
              size={contentPadding}
              from="horizontal"
              radius={radius}
            >
              <RepositoryContentContainer>
                <CardText numberOfLines={1}>
                  <Icon name="git-commit" />&nbsp;
                  {message}
                  {byText && <Text muted small> by {byText}</Text>}
                </CardText>
              </RepositoryContentContainer>
            </TransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  }
}
