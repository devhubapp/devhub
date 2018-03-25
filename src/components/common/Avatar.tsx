import React, { SFC } from 'react'
import {
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

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
import ImageWithLoading from './ImageWithLoading'

export interface IProps {
  avatarURL?: string
  email?: string
  isBot?: boolean
  linkURL: string
  size?: number
  small?: boolean
  style?: ImageStyle
  username?: string
}

export const size = avatarSize

const styles = StyleSheet.create({
  image: {
    borderRadius: radius,
  } as ViewStyle,
})

const Avatar: SFC<IProps> = ({
  avatarURL: _avatarURL,
  email,
  isBot: _isBot,
  linkURL,
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
          : username ? getUserPressHandler(username, { isBot }) : undefined
      }
    >
      <ImageWithLoading
        {...props}
        backgroundColorFailed="#FFFFFF"
        backgroundColorLoaded="#FFFFFF"
        backgroundColorLoading={theme.base09}
        source={{ uri }}
        style={[
          styles.image,
          {
            height: finalSize,
            width: finalSize,
          },
          style,
        ]}
      />
    </TouchableOpacity>
  )
}

export default Avatar
