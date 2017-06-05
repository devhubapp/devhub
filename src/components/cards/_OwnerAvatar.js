// @flow

import React from 'react'
import { TouchableOpacity } from 'react-native'

import Avatar from '../Avatar'
import {
  getUserAvatarByEmail,
  getUserAvatarByUsername,
} from '../../utils/helpers/github/shared'
import { openOnGithub } from '../../utils/helpers/github/url'

export default class OwnerAvatar extends React.PureComponent {
  props: {
    cache?: ?string,
    linkURL: string,
    navigation: Object,
    size?: ?number,
  } & (
    | {
        username?: ?string,
      }
    | {
        avatarURL: string,
      }
    | {
        email?: ?string,
      })

  render() {
    const {
      avatarURL,
      cache,
      email,
      linkURL,
      size,
      username,
      ...props
    } = this.props

    const uri =
      (username && getUserAvatarByUsername(username, size)) ||
      avatarURL ||
      getUserAvatarByEmail(email, { size })
    if (!uri) return null

    return (
      <TouchableOpacity
        onPress={() => openOnGithub(linkURL)}
        alt="Open on Github"
      >
        <Avatar
          size={size}
          source={{ uri, cache: typeof cache === 'string' ? cache : undefined }}
          alt="User avatar"
          {...props}
        />
      </TouchableOpacity>
    )
  }
}

OwnerAvatar.defaultProps = {
  cache: 'force-cache',
}
