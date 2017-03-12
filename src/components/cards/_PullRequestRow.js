// @flow

import React from 'react';

import OwnerAvatar from './_OwnerAvatar';
import TouchableRow from './__TouchableRow';

import {
  CardItemId,
  smallAvatarWidth,
  CardText,
  Icon,
  RightOfScrollableContent,
  StyledText,
} from './__CardComponents';

import { trimNewLinesAndSpaces } from '../../utils/helpers';
import { getPullRequestIconAndColor } from '../../utils/helpers/github/shared';

import type { GithubComment, GithubPullRequest, ThemeObject } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    comment: GithubComment,
    narrow: boolean,
    pullRequest: GithubPullRequest,
    read?: boolean,
    theme?: ThemeObject,
  };

  render() {
    const { comment, pullRequest, read, theme, ...props } = this.props;

    // TODO: Remove this typeof pullRequest.get === 'function' on next release
    if (!(pullRequest && typeof pullRequest.get === 'function')) return null;

    const title = trimNewLinesAndSpaces(pullRequest.get('title'));
    if (!title) return null;

    const number = pullRequest.get('number');
    const user = pullRequest.get('user');

    const { icon, color } = getPullRequestIconAndColor(pullRequest, theme);

    const byText = user && user.get('login') ? `@${user.get('login')}` : '';

    // pull request links will send to comment if comment was not loaded by app yet
    const url = comment && !comment.get('body') && comment.get('html_url')
      ? comment.get('html_url')
      : pullRequest.get('html_url') || pullRequest.get('url')
    ;

    return (
      <TouchableRow
        left={
          user &&
          <OwnerAvatar
            avatarURL={user.get('avatar_url')}
            linkURL={user.get('html_url') || user.get('url')}
            size={smallAvatarWidth}
          />
        }
        read={read}
        right={
          <RightOfScrollableContent>
            <CardItemId
              number={number}
              read={read}
              url={pullRequest.get('html_url') || pullRequest.get('url')}
            />
          </RightOfScrollableContent>
        }
        url={url}
        {...props}
      >
        <CardText numberOfLines={1} muted={read}>
          <StyledText muted>
            <Icon name={icon} color={color} muted={read} />&nbsp;
          </StyledText>
          {title}
          {!!byText && <StyledText muted small> by {byText}</StyledText>}
        </CardText>
      </TouchableRow>
    );
  }
}
