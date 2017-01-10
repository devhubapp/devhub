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
    seen?: boolean,
    url?: string,
    user: GithubUser,
  };

  render() {
    const { user, body: _body, narrow, numberOfLines = 4, seen, url, ...props } = this.props;

    const body = trimNewLinesAndSpaces(_body, 400);
    if (!body) return null;

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn>
          {
            user &&
            <OwnerAvatar
              avatarURL={user.get('avatar_url')}
              linkURL={user.get('html_url') || user.get('url')}
              size={smallAvatarWidth}
            />
          }
        </LeftColumn>

        <MainColumnRowContent center>
          <CardText
            numberOfLines={numberOfLines}
            onPress={url ? (() => openOnGithub(url)) : null}
            muted={seen}
          >{body}</CardText>
        </MainColumnRowContent>
      </ContentRow>
    );
  }
}
