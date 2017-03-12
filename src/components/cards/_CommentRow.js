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

import { openOnGithub } from '../../utils/helpers/github/url';
import { trimNewLinesAndSpaces } from '../../utils/helpers';
import { withNavigation } from '../../libs/navigation';
import type { GithubUser } from '../../utils/types';

@withNavigation
export default class extends React.PureComponent {
  props: {
    body: string,
    narrow?: boolean,
    navigation: Object,
    numberOfLines?: number,
    read?: boolean,
    url?: string,
    user: GithubUser,
  };

  render() {
    const { user, body: _body, narrow, navigation, numberOfLines = 4, read, url, ...props } = this.props;

    const body = trimNewLinesAndSpaces(_body, 400);
    if (!body) return null;

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn muted={read}>
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
            onPress={url ? (() => openOnGithub(navigation, url)) : null}
            muted={read}
          >{body}</CardText>
        </MainColumnRowContent>
      </ContentRow>
    );
  }
}
