import React from 'react'
import { View } from 'react-native'

import { getGitHubURLForUser } from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import { smallAvatarSize } from '../../../../styles/variables'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { Spacer } from '../../../common/Spacer'
import { ThemedTextProps } from '../../../themed/ThemedText'
import { cardStyles } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'

export interface ActorActionRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  ActionTextComponent: React.ReactNode
  avatarUrl?: string
  bold: boolean
  isBot: boolean
  muted: boolean
  numberOfLines?: number
  textStyle?: ThemedTextProps['style']
  url?: string
  userLinkURL: string | undefined
  username: string
}

export const ActorActionRow = React.memo((props: ActorActionRowProps) => {
  const {
    ActionTextComponent,
    avatarUrl,
    bold,
    isBot,
    muted,
    numberOfLines: _numberOfLines,
    textStyle,
    url,
    userLinkURL: _userLinkURL,
    username: _username,
    smallLeftColumn = true,
    ...otherProps
  } = props

  const numberOfLines = _numberOfLines || 1
  const username = isBot ? _username!.replace('[bot]', '') : _username
  const userLinkURL = _userLinkURL || getGitHubURLForUser(username, { isBot })

  return (
    <BaseRow
      {...otherProps}
      left={
        <Avatar
          avatarUrl={avatarUrl}
          isBot={isBot}
          linkURL={userLinkURL}
          muted={muted}
          small={smallLeftColumn}
          style={cardStyles.avatar}
          username={username}
        />
      }
      right={
        <View
          style={[
            sharedStyles.horizontal,
            sharedStyles.flexNoWrap,
            sharedStyles.alignItemsCenter,
          ]}
        >
          <Link
            href={userLinkURL}
            openOnNewTab
            textProps={{
              color: (muted && 'foregroundColorMuted65') || 'foregroundColor',
              numberOfLines,
              style: [
                cardStyles.normalText,
                bold && cardStyles.boldText,
                cardStyles.smallText,
                { lineHeight: smallAvatarSize },
                textStyle,
              ],
            }}
          >
            {`@${username}`}
          </Link>

          <Spacer width={4} />

          {ActionTextComponent}
        </View>
      }
      smallLeftColumn={smallLeftColumn}
    />
  )
})

ActorActionRow.displayName = 'ActorActionRow'
