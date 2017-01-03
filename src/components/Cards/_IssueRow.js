// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import OwnerAvatar from './_OwnerAvatar';
import TouchableRow from './__TouchableRow';

import {
  renderItemId,
  CardText,
  RightOfScrollableContent,
  smallAvatarWidth,
  StyledText,
} from './__CardComponents';

import { getIssueIconAndColor, trimNewLinesAndSpaces } from '../../utils/helpers';
import type { Issue, ThemeObject } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    issue: Issue,
    narrow?: boolean,
    theme?: ThemeObject,
  };

  render() {
    const { issue, theme, ...props } = this.props;

    if (!issue) return null;

    const user = issue.get('user');
    const number = issue.get('number');
    const title = issue.get('title');

    const _title = trimNewLinesAndSpaces(title);
    if (!_title) return null;

    const { icon, color } = getIssueIconAndColor(issue, theme);

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
            {renderItemId(number, null, issue.get('html_url') || issue.get('url'))}
          </RightOfScrollableContent>
        }
        url={issue.get('html_url') || issue.get('url')}
        {...props}
      >
        <CardText numberOfLines={1}>
          <Icon name={icon} color={color} />&nbsp;
          {_title}
          {byText && <StyledText muted small> by {byText}</StyledText>}
        </CardText>
      </TouchableRow>
    );
  }
}
