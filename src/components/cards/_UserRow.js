// @flow

import React from 'react'

import Icon from '../../libs/icon'
import TouchableRow from './__TouchableRow'
import OwnerAvatar from './_OwnerAvatar'

import { smallAvatarWidth, StyledText } from './__CardComponents'

import { trimNewLinesAndSpaces } from '../../utils/helpers'
import type { User } from '../../utils/types'

export default class UserRow extends React.PureComponent {
  props: {
    user: User,
    additionalInfo?: ?string,
    narrow?: boolean,
    read?: boolean,
  }

  render() {
    const { additionalInfo, read, user, ...props } = this.props

    if (!user) return null

    const _login = trimNewLinesAndSpaces(user.get('login'))
    if (!_login) return null

    return (
      <TouchableRow
        left={
          <OwnerAvatar
            avatarURL={user.get('avatar_url')}
            linkURL={user.get('html_url') || user.get('url')}
            size={smallAvatarWidth}
            username={user.get('login')}
          />
        }
        read={read}
        url={user.get('html_url') || user.get('url')}
        {...props}
      >
        <StyledText numberOfLines={1} muted={read}>
          <StyledText muted={read}>
            <Icon name="person" />&nbsp;
          </StyledText>
          {_login}
          {!!additionalInfo && <StyledText muted> {additionalInfo}</StyledText>}
        </StyledText>
      </TouchableRow>
    )
  }
}
