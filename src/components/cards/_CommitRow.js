// @flow

import React from 'react';

import Icon from '../../libs/icon';
import TouchableRow from './__TouchableRow';
import OwnerAvatar from './_OwnerAvatar';

import {
  CardText,
  smallAvatarWidth,
  StyledText,
} from './__CardComponents';

import { trimNewLinesAndSpaces } from '../../utils/helpers';

import {
  getGitHubURLForUser,
  getGitHubSearchURL,
} from '../../utils/helpers/github/url';

import { tryGetUsernameFromGithubEmail } from '../../utils/helpers/github/shared';

import type { Commit, ThemeObject } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    commit: Commit,
    narrow?: boolean,
    read?: boolean,
    theme?: ThemeObject,
  };

  render() {
    const { commit, read, ...props } = this.props;

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
      <TouchableRow
        left={
          !!authorEmail &&
          <OwnerAvatar
            email={authorEmail}
            size={smallAvatarWidth}
            linkURL={
              authorUsername
                ? getGitHubURLForUser(authorUsername)
                : getGitHubSearchURL({ q: authorEmail, type: 'Users' })
            }
          />
        }
        read={read}
        url={commit.get('html_url') || commit.get('url')}
        {...props}
      >
        <CardText numberOfLines={1} muted={read}>
          <StyledText muted={read}><Icon name="git-commit" />&nbsp;</StyledText>
          {message}
          {!!byText && <StyledText muted small> by {byText}</StyledText>}
        </CardText>
      </TouchableRow>
    );
  }
}
