// @flow

import React from 'react';

import UserAvatar from './_UserAvatar';

import {
  CardText,
  ContentRow,
  LeftColumn,
  MainColumnRowContent,
  smallAvatarWidth,
} from './EventCard';

import { trimNewLinesAndSpaces } from '../../utils/helpers';
import type { Comment, User } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    actor: User,
    comment: Comment,
    narrow?: boolean,
  };

  render() {
    const { actor, comment, narrow, ...props } = this.props;
    if (!comment) return null;

    const body = trimNewLinesAndSpaces(comment.get('body'));
    if (!body) return null;

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn>
          <UserAvatar url={actor.get('avatar_url')} size={smallAvatarWidth} />
        </LeftColumn>

        <MainColumnRowContent center>
          <CardText numberOfLines={2}>{body}</CardText>
        </MainColumnRowContent>
      </ContentRow>
    );
  }
}
