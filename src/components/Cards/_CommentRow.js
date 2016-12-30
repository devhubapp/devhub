// @flow

import React from 'react';

import OwnerAvatar from './_OwnerAvatar';

import {
  CardText,
  ContentRow,
  LeftColumn,
  MainColumnRowContent,
  smallAvatarWidth,
} from './__CardComponents';

import { trimNewLinesAndSpaces } from '../../utils/helpers';
import type { User } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    user: User,
    body: string,
    narrow?: boolean,
    numberOfLines?: number,
  };

  render() {
    const { user, body: _body, narrow, numberOfLines = 4, ...props } = this.props;
    if (!_body) return null;

    const body = trimNewLinesAndSpaces(_body);
    if (!body) return null;

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn>
          <OwnerAvatar url={user.get('avatar_url')} size={smallAvatarWidth} />
        </LeftColumn>

        <MainColumnRowContent center>
          <CardText numberOfLines={numberOfLines}>{body}</CardText>
        </MainColumnRowContent>
      </ContentRow>
    );
  }
}
