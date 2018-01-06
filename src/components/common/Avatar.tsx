import React, { SFC } from 'react'
import {
  Image,
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

import { avatarSize, radius, smallAvatarSize } from '../../styles/variables'
import {
  getUserAvatarByEmail,
  getUserAvatarByUsername,
} from '../../utils/helpers/github/shared'
import { getUserPressHandler } from '../cards/partials/rows/helpers'

export interface IProps {
  avatarURL?: string
  email?: string
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
  avatarURL,
  email,
  size: _size,
  small,
  style,
  username,
  ...props
}) => {
  const finalSize = _size || (small ? smallAvatarSize : avatarSize)
  const uri =
    (username && getUserAvatarByUsername(username, { size: finalSize })) ||
    avatarURL ||
    (email && getUserAvatarByEmail(email, { size: finalSize }))
  if (!uri) return null

  return (
    <TouchableOpacity onPress={getUserPressHandler(username)}>
      <Image
        {...props}
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
