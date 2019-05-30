import React from 'react'
import { PixelRatio, StyleProp, View } from 'react-native'

import {
  getGitHubURLForRepo,
  getGitHubURLForUser,
  getUserAvatarByAvatarURL,
  getUserAvatarByEmail,
  getUserAvatarByUsername,
} from '@devhub/core'
import { avatarSize, radius, smallAvatarSize } from '../../styles/variables'
import { fixURL } from '../../utils/helpers/github/url'
import {
  ThemedImageWithLoading,
  ThemedImageWithLoadingProps,
} from '../themed/ThemedImageWithLoading'
import { ConditionalWrap } from './ConditionalWrap'
import { Link } from './Link'
import { TouchableOpacityProps } from './TouchableOpacity'

export interface AvatarProps
  extends Partial<Omit<ThemedImageWithLoadingProps, 'tooltip'>> {
  avatarUrl?: string
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
  tooltip?: string
  username?: string
}

export const size = avatarSize

export function Avatar(props: AvatarProps) {
  const {
    avatarUrl: _avatarUrl,
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
    tooltip: _tooltip,
    username: _username,
    ...otherProps
  } = props

  const finalSize = _size || (small ? smallAvatarSize : avatarSize)
  const isBot = _isBot || Boolean(_username && _username.indexOf('[bot]') >= 0)
  const username = isBot ? _username!.replace('[bot]', '') : _username

  const avatarUrl = _avatarUrl
    ? getUserAvatarByAvatarURL(
        _avatarUrl,
        { size: finalSize },
        PixelRatio.getPixelSizeForLayoutSize,
      )
    : ''

  const uri =
    avatarUrl ||
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

  const tooltip = _tooltip === null ? '' : _tooltip || `@${username}`

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
      <ThemedImageWithLoading
        backgroundColorFailed="#FFFFFF"
        backgroundColorLoaded="#FFFFFF"
        backgroundColorLoading="backgroundColorLess1"
        {...otherProps}
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
        tooltip={tooltip}
      />
    </ConditionalWrap>
  )
}
