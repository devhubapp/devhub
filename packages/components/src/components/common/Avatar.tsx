import React from 'react'
import { PixelRatio, StyleProp, View } from 'react-native'

import {
  getUserAvatarByAvatarURL,
  getUserAvatarByEmail,
  getUserAvatarByUsername,
} from '@devhub/core/src/utils/helpers/github/shared'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { avatarSize, radius, smallAvatarSize } from '../../styles/variables'
import { fixURL } from '../../utils/helpers/github/url'
import {
  AnimatedImageWithLoading,
  AnimatedImageWithLoadingProps,
} from '../animated/AnimatedImageWithLoading'
import { getRepositoryURL, getUserURL } from '../cards/partials/rows/helpers'
import { ConditionalWrap } from './ConditionalWrap'
import { Link } from './Link'
import { TouchableOpacityProps } from './TouchableOpacity'

export interface AvatarProps extends Partial<AnimatedImageWithLoadingProps> {
  avatarURL?: string
  disableLink?: boolean
  email?: string
  hitSlop?: TouchableOpacityProps['hitSlop']
  isBot?: boolean
  linkURL?: string
  repo?: string
  shape?: 'circle' | 'rounded' | 'square'
  size?: number
  small?: boolean
  style?: StyleProp<any>
  username?: string
}

export const size = avatarSize

export function Avatar(props: AvatarProps) {
  const theme = useAnimatedTheme()

  const {
    avatarURL: _avatarURL,
    disableLink,
    email,
    hitSlop,
    isBot: _isBot,
    linkURL,
    repo,
    shape,
    size: _size,
    small,
    style,
    username: _username,
    ...oherProps
  } = props

  const finalSize = _size || (small ? smallAvatarSize : avatarSize)
  const isBot = _isBot || Boolean(_username && _username.indexOf('[bot]') >= 0)
  const username = isBot ? _username!.replace('[bot]', '') : _username

  const avatarURL = _avatarURL
    ? getUserAvatarByAvatarURL(
        _avatarURL,
        { size: finalSize },
        PixelRatio.getPixelSizeForLayoutSize,
      )
    : ''

  const uri =
    avatarURL ||
    (username &&
      getUserAvatarByUsername(
        username,
        { size: finalSize },
        PixelRatio.getPixelSizeForLayoutSize,
      )) ||
    (email &&
      getUserAvatarByEmail(
        email,
        { size: finalSize },
        PixelRatio.getPixelSizeForLayoutSize,
      ))

  if (!uri) return null

  const linkUri = disableLink
    ? undefined
    : linkURL && !isBot
    ? fixURL(linkURL)
    : username
    ? repo
      ? getRepositoryURL(username, repo)
      : getUserURL(username, { isBot })
    : undefined

  return (
    <ConditionalWrap
      condition
      wrap={children =>
        linkUri ? (
          <Link hitSlop={hitSlop} href={linkUri}>
            {children}
          </Link>
        ) : (
          <View>{children}</View>
        )
      }
    >
      <AnimatedImageWithLoading
        backgroundColorFailed="#FFFFFF"
        backgroundColorLoaded="#FFFFFF"
        backgroundColorLoading={theme.backgroundColorLess08}
        {...oherProps}
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
    </ConditionalWrap>
  )
}
