import React, { Fragment } from 'react'
import { View } from 'react-native'

import {
  getGitHubURLForBranch,
  getGitHubURLForRelease,
  getGitHubURLForRepo,
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
  forkOwnerName: string | undefined
  forkRepositoryName: string | undefined
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
    forkOwnerName,
    forkRepositoryName,
    isBot,
    isRead,
    numberOfLines = props.numberOfLines || 1,
    ownerName,
    repositoryName,
    smallLeftColumn = true,
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

  const fragmentMapper = (item: React.ReactNode, index: number) => (
    <Fragment
      key={`action-row-${ownerName}-${repositoryName}-${body}-${index}`}
    >
      {item}
    </Fragment>
  )

  const bodyStr = `${_body || ''}`.replace(_body[0], _body[0].toLowerCase())

  const body =
    bodyStr && (branch || tag) && ownerName && repositoryName
      ? genericParseText(
          bodyStr,
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
                {match}
              </Link>
            )
          },
        ).map(fragmentMapper)
      : bodyStr && forkOwnerName && forkRepositoryName
      ? genericParseText(
          bodyStr,
          new RegExp(`${forkOwnerName}/${forkRepositoryName}`, 'i'),
          match => {
            return (
              <Link
                href={getGitHubURLForRepo(forkOwnerName, forkRepositoryName)}
                openOnNewTab
              >
                {match}
              </Link>
            )
          },
        ).map(fragmentMapper)
      : bodyStr

  return (
    <BaseRow
      {...otherProps}
      left={
        <Avatar
          avatarUrl={avatarUrl}
          isBot={isBot}
          linkURL={userLinkURL}
          small={smallLeftColumn}
          style={cardStyles.avatar}
          username={username}
        />
      }
      right={
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
          }}
        >
          <Link
            href={userLinkURL}
            openOnNewTab
            textProps={{
              numberOfLines,
              style: [
                getCardStylesForTheme(springAnimatedTheme).normalText,
                cardStyles.boldText,
                cardStyles.smallText,
                { lineHeight: smallAvatarSize },
                textStyle,
              ],
            }}
          >
            {`@${username}`}
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
      smallLeftColumn={smallLeftColumn}
      viewMode={viewMode}
    />
  )
})
