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

import { openOnGithub, trimNewLinesAndSpaces } from '../../utils/helpers';
import type { GithubUser } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    body: string,
    narrow?: boolean,
    numberOfLines?: number,
    url?: string,
    user: GithubUser,
  };

  render() {
    const { user, body: _body, narrow, numberOfLines = 4, url, ...props } = this.props;
    if (!_body) return null;

    const body = trimNewLinesAndSpaces(_body);
    if (!body) return null;

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn>
          <OwnerAvatar
            avatarURL={user.get('avatar_url')}
            linkURL={user.get('html_url') || user.get('url')}
            size={smallAvatarWidth}
          />
        </LeftColumn>

        <MainColumnRowContent center>
          <CardText
            numberOfLines={numberOfLines}
            onPress={url ? (() => openOnGithub(url)) : null}
          >{body}</CardText>
        </MainColumnRowContent>
      </ContentRow>
    );
  }
}
