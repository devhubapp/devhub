// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import TouchableRow from './__TouchableRow';
import OwnerAvatar from './_OwnerAvatar';

import {
  smallAvatarWidth,
  StyledText,
} from './__CardComponents';

import { trimNewLinesAndSpaces } from '../../utils/helpers';
import type { User, ThemeObject } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    user: User,
    additionalInfo?: ?string,
    narrow?: boolean,
  };

  render() {
    const { additionalInfo, user, ...props } = this.props;

    if (!user) return null;

    const _login = trimNewLinesAndSpaces(user.get('login'));
    if (!_login) return null;

    return (
      <TouchableRow
        left={
          <OwnerAvatar
            avatarURL={user.get('avatar_url')}
            linkURL={user.get('html_url') || user.get('url')}
            size={smallAvatarWidth}
          />
        }
        url={user.get('html_url') || user.get('url')}
        {...props}
      >
        <StyledText numberOfLines={1}>
          <Icon name="person" />&nbsp;
          {_login}
          {additionalInfo && <StyledText muted> {additionalInfo}</StyledText>}
        </StyledText>
      </TouchableRow>
    );
  }
}
