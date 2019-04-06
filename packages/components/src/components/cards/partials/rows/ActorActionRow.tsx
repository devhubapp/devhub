import React, { Fragment } from 'react'
import { View } from 'react-native'

import {
  getGitHubURLForBranch,
  getGitHubURLForRelease,
  getGitHubURLForUser,
  Omit,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { smallAvatarSize } from '../../../../styles/variables'
import { genericParseText } from '../../../../utils/helpers/shared'
import {
  SpringAnimatedText,
  SpringAnimatedTextProps,
} from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { Spacer } from '../../../common/Spacer'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'

export interface ActorActionRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  avatarUrl: string | undefined
  body: string
  branch: string | undefined
  isBot: boolean
  isRead: boolean
  numberOfLines?: number
  ownerName: string
  repositoryName: string
  tag: string | undefined
  textStyle?: SpringAnimatedTextProps['style']
  url?: string
  userLinkURL: string | undefined
  username: string
}

export const ActorActionRow = React.memo((props: ActorActionRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    avatarUrl,
    body: _body,
    branch,
    isBot,
    isRead,
    numberOfLines = props.numberOfLines || 1,
    ownerName,
    repositoryName,
    tag,
    textStyle,
    url,
    userLinkURL: _userLinkURL,
    username: _username,
    viewMode,
    ...otherProps
  } = props

  const username = isBot ? _username!.replace('[bot]', '') : _username
  const userLinkURL = _userLinkURL || getGitHubURLForUser(username, { isBot })

  const body =
    (branch || tag) && ownerName && repositoryName
      ? genericParseText(
          `${_body || ''}`.toLowerCase(),
          new RegExp(`${branch || tag}`.toLowerCase()),
          match => {
            return (
              <Link
                href={
                  branch
                    ? getGitHubURLForBranch(ownerName, repositoryName, branch)
                    : tag
                    ? getGitHubURLForRelease(ownerName, repositoryName, tag)
                    : undefined
                }
                openOnNewTab
              >
                <SpringAnimatedText>{match}</SpringAnimatedText>
              </Link>
            )
          },
        ).map((item, index) => (
          <Fragment
            key={`action-branchOrTag-${ownerName}-${repositoryName}-${branch ||
              tag}-${index}`}
          >
            {item}
          </Fragment>
        ))
      : `${_body || ''}`.toLowerCase()

  return (
    <BaseRow
      {...otherProps}
      left={
        <Avatar
          avatarUrl={avatarUrl}
          isBot={isBot}
          linkURL={userLinkURL}
          small
          style={cardStyles.avatar}
          username={username}
        />
      }
      right={
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Link href={userLinkURL} openOnNewTab>
            <SpringAnimatedText
              numberOfLines={numberOfLines}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                cardStyles.boldText,
                cardStyles.smallText,
                { lineHeight: smallAvatarSize },
                textStyle,
              ]}
            >
              {`@${username}`}
            </SpringAnimatedText>
          </Link>

          <Spacer width={4} />

          <SpringAnimatedText
            numberOfLines={numberOfLines}
            style={[
              getCardStylesForTheme(springAnimatedTheme).normalText,
              cardStyles.smallText,
              { lineHeight: smallAvatarSize },
              textStyle,
            ]}
          >
            {body}
          </SpringAnimatedText>
        </View>
      }
      viewMode={viewMode}
    />
  )
})
