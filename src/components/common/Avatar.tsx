import React, { SFC } from 'react'
import { ImageStyle, StyleProp, TouchableOpacity } from 'react-native'

import theme from '../../styles/themes/dark'
import { avatarSize, radius, smallAvatarSize } from '../../styles/variables'
import {
  getUserAvatarByAvatarURL,
  getUserAvatarByEmail,
  getUserAvatarByUsername,
} from '../../utils/helpers/github/shared'
import {
  getGithubURLPressHandler,
  getUserPressHandler,
} from '../cards/partials/rows/helpers'
import { ImageWithLoading } from './ImageWithLoading'

export interface AvatarProps {
  avatarURL?: string
  email?: string
  isBot?: boolean
  linkURL: string
  shape?: 'circle' | 'rounded' | 'square'
  size?: number
  small?: boolean
  style?: StyleProp<ImageStyle>
  username?: string
}

export const size = avatarSize

const Avatar: SFC<AvatarProps> = ({
  avatarURL: _avatarURL,
  email,
  isBot: _isBot,
  linkURL,
  shape,
  size: _size,
  small,
  style,
  username,
  ...props
}) => {
  const finalSize = _size || (small ? smallAvatarSize : avatarSize)
  const isBot = Boolean(username && username.indexOf('[bot]') >= 0)

  const avatarURL = _avatarURL
    ? getUserAvatarByAvatarURL(_avatarURL, { size: finalSize })
    : ''

  const uri =
    avatarURL ||
    (username && getUserAvatarByUsername(username, { size: finalSize })) ||
    (email && getUserAvatarByEmail(email, { size: finalSize }))

  if (!uri) return null

  return (
    <TouchableOpacity
      onPress={
        linkURL
          ? getGithubURLPressHandler(linkURL)
          : username
            ? getUserPressHandler(username, { isBot })
            : undefined
      }
    >
      <ImageWithLoading
        {...props}
        backgroundColorFailed="#FFFFFF"
        backgroundColorLoaded="#FFFFFF"
        backgroundColorLoading={theme.base09}
        source={{ uri }}
        style={[
          {
            height: finalSize,
            width: finalSize,
            borderRadius:
              shape === 'circle'
                ? finalSize / 2
                : shape === 'square'
                  ? 0
                  : radius,
          },
          style,
        ]}
      />
    </TouchableOpacity>
  )
}

export default Avatar
