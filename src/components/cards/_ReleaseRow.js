// @flow

import React from 'react';
import { View } from 'react-native';

import BranchRow from './_BranchRow';
import Icon from '../../libs/icon';
import OwnerAvatar from './_OwnerAvatar';
import TouchableRow from './__TouchableRow';

import {
  CardText,
  StyledText,
  smallAvatarWidth,
} from './__CardComponents';

import { trimNewLinesAndSpaces } from '../../utils/helpers';
import { getRepoFullNameFromUrl } from '../../utils/helpers/github/url';
import type { GithubEventType, GithubUser, ReleaseEvent } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    narrow: boolean,
    release: ReleaseEvent,
    read?: boolean,
    type: GithubEventType,
    user: GithubUser,
  };

  render() {
    const { release, read, type, user, ...props } = this.props;

    if (!release) return null;

    const {
      body,
      branch,
      name,
      tagName,
    } = {
      body: trimNewLinesAndSpaces(release.get('body')),
      branch: release.get('target_commitish'),
      name: trimNewLinesAndSpaces(release.get('name')),
      tagName: trimNewLinesAndSpaces(release.get('tag_name')),
    };

    const repoFullName = getRepoFullNameFromUrl(release.get('url'));

    return (
      <View>
        {
          !!branch &&
          <BranchRow branch={branch} type={type} repoFullName={repoFullName} narrow />
        }

        <TouchableRow
          left={
            !!user &&
            <OwnerAvatar
              avatarURL={user.get('avatar_url')}
              linkURL={user.get('html_url') || user.get('url')}
              size={smallAvatarWidth}
            />
          }
          read={read}
          url={release.get('html_url') || release.get('url')}
          {...props}
        >
          <StyledText numberOfLines={1} muted={read}>
            <Icon name="tag" />&nbsp;
            {name || tagName}
          </StyledText>
        </TouchableRow>

        {
          !!body &&
          <TouchableRow
            left={
              !!user &&
              <OwnerAvatar
                avatarURL={user.get('avatar_url')}
                linkURL={user.get('html_url') || user.get('url')}
                size={smallAvatarWidth}
              />
            }
            read={read}
            url={release.get('html_url') || release.get('url')}
            {...props}
          >
            <CardText numberOfLines={1} muted={read}>
              <StyledText muted={read}><Icon name="megaphone" />&nbsp;</StyledText>
              {body}
            </CardText>
          </TouchableRow>
        }
      </View>
    );
  }
}
