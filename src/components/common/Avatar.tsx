import React, { SFC } from 'react'
import { ImageStyle, StyleProp, TouchableOpacityProps } from 'react-native'

import { avatarSize, radius, smallAvatarSize } from '../../styles/variables'
import {
  getUserAvatarByAvatarURL,
  getUserAvatarByEmail,
  getUserAvatarByUsername,
} from '../../utils/helpers/github/shared'
import { fixURL } from '../../utils/helpers/github/url'
import { getRepositoryURL, getUserURL } from '../cards/partials/rows/helpers'
import { ThemeConsumer } from '../context/ThemeContext'
import { ImageWithLoading } from './ImageWithLoading'
import { Link } from './Link'

export interface AvatarProps {
  avatarURL?: string
  email?: string
  hitSlop?: TouchableOpacityProps['hitSlop']
  isBot?: boolean
  linkURL?: string
  repo?: string
  shape?: 'circle' | 'rounded' | 'square'
  size?: number
  small?: boolean
  style?: StyleProp<ImageStyle>
  username?: string
}

export const size = avatarSize

export const Avatar: SFC<AvatarProps> = ({
  avatarURL: _avatarURL,
  email,
  hitSlop,
  isBot: _isBot,
  linkURL,
  repo,
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
    <ThemeConsumer>
      {({ theme }) => (
        <Link
          hitSlop={hitSlop}
          href={
            linkURL
              ? fixURL(linkURL)
              : username
                ? repo
                  ? getRepositoryURL(username, repo)
                  : getUserURL(username, { isBot })
                : undefined
          }
        >
          <ImageWithLoading
            {...props}
            backgroundColorFailed="#FFFFFF"
            backgroundColorLoaded="#FFFFFF"
            backgroundColorLoading={theme.backgroundColorLess08}
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
        </Link>
      )}
    </ThemeConsumer>
  )
}
