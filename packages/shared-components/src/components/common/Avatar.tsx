import React, { SFC } from 'react'
import { StyleProp, TouchableOpacityProps, View } from 'react-native'

import {
  getUserAvatarByAvatarURL,
  getUserAvatarByEmail,
  getUserAvatarByUsername,
} from 'shared-core/dist/utils/helpers/github/shared'
import { avatarSize, radius, smallAvatarSize } from '../../styles/variables'
import { fixURL } from '../../utils/helpers/github/url'
import { getRepositoryURL, getUserURL } from '../cards/partials/rows/helpers'
import { ThemeConsumer } from '../context/ThemeContext'
import { ConditionalWrap } from './ConditionalWrap'
import { ImageWithLoading, ImageWithLoadingProps } from './ImageWithLoading'
import { Link } from './Link'

export interface AvatarProps extends Partial<ImageWithLoadingProps> {
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

export const Avatar: SFC<AvatarProps> = ({
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
  ...props
}) => {
  const finalSize = _size || (small ? smallAvatarSize : avatarSize)
  const isBot = _isBot || Boolean(_username && _username.indexOf('[bot]') >= 0)
  const username = isBot ? _username!.replace('[bot]', '') : _username

  const avatarURL = _avatarURL
    ? getUserAvatarByAvatarURL(_avatarURL, { size: finalSize })
    : ''

  const uri =
    avatarURL ||
    (username && getUserAvatarByUsername(username, { size: finalSize })) ||
    (email && getUserAvatarByEmail(email, { size: finalSize }))

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
    <ThemeConsumer>
      {({ theme }) => (
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
          <ImageWithLoading
            backgroundColorFailed="#FFFFFF"
            backgroundColorLoaded="#FFFFFF"
            backgroundColorLoading={theme.backgroundColorLess08}
            {...props}
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
      )}
    </ThemeConsumer>
  )
}
