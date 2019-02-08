import React from 'react'
import { PixelRatio, StyleProp, View } from 'react-native'

import {
  getGitHubURLForRepo,
  getGitHubURLForUser,
  getUserAvatarByAvatarURL,
  getUserAvatarByEmail,
  getUserAvatarByUsername,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { avatarSize, radius, smallAvatarSize } from '../../styles/variables'
import { fixURL } from '../../utils/helpers/github/url'
import {
  SpringAnimatedImageWithLoading,
  SpringAnimatedImageWithLoadingProps,
} from '../animated/spring/SpringAnimatedImageWithLoading'
import { ConditionalWrap } from './ConditionalWrap'
import { Link } from './Link'
import { TouchableOpacityProps } from './TouchableOpacity'

export interface AvatarProps
  extends Partial<SpringAnimatedImageWithLoadingProps> {
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
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

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
      ? getGitHubURLForRepo(username, repo)
      : getGitHubURLForUser(username, { isBot })
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
      <SpringAnimatedImageWithLoading
        backgroundColorFailed="#FFFFFF"
        backgroundColorLoaded="#FFFFFF"
        backgroundColorLoading={springAnimatedTheme.backgroundColorLess1}
        {...oherProps}
        source={{ uri, width: finalSize + 1, height: finalSize + 1 }}
        style={[
          {
            height: finalSize,
            width: finalSize,
            borderWidth: 0,
            borderRadius:
              !shape || shape === 'circle'
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
