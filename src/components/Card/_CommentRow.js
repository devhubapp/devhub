// @flow

import React from 'react';

import UserAvatar from './_UserAvatar';

import {
  avatarWidth,
  CardText,
  ContentRow,
  LeftColumn,
  MainColumnRowContent,
} from './';

import type { Comment, User } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    actor: User,
    comment: Comment,
    narrow?: boolean,
  };

  render() {
    const { actor, comment, narrow } = this.props;
    if (!comment) return null;

    const body = (comment.get('body') || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!body) return null;

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn>
          <UserAvatar url={actor.get('avatar_url')} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumnRowContent center>
          <CardText numberOfLines={2}>{body}</CardText>
        </MainColumnRowContent>
      </ContentRow>
    );
  }
}
