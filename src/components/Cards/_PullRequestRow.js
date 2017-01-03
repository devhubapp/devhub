// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import OwnerAvatar from './_OwnerAvatar';
import TouchableRow from './__TouchableRow';
import { openOnGithub } from '../../utils/helpers';

import {
  renderItemId,
  CardText,
  RightOfScrollableContent,
  smallAvatarWidth,
  StyledText,
} from './__CardComponents';

import { getPullRequestIconAndColor, trimNewLinesAndSpaces } from '../../utils/helpers';
import type { PullRequest } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    narrow: boolean,
    pullRequest: PullRequest,
  };

  render() {
    const { pullRequest, theme, ...props } = this.props;

    if (!pullRequest) return null;

    const title = trimNewLinesAndSpaces(pullRequest.get('title'));
    if (!title) return null;

    const number = pullRequest.get('number');
    const user = pullRequest.get('user');

    const { icon, color } = getPullRequestIconAndColor(pullRequest, theme);

    const byText = user && user.get('login') ? `@${user.get('login')}` : '';

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
        right={
          <RightOfScrollableContent>
            {renderItemId(number, null, pullRequest.get('html_url') || pullRequest.get('url'))}
          </RightOfScrollableContent>
        }
        url={pullRequest.get('html_url') || pullRequest.get('url')}
        {...props}
      >
        <CardText numberOfLines={1}>
          <Icon name={icon} color={color} />&nbsp;
          {title}
          {byText && <StyledText muted small> by {byText}</StyledText>}
        </CardText>
      </TouchableRow>
    );
  }
}
