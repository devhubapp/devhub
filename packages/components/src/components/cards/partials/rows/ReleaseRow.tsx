import React from 'react'
import { View } from 'react-native'

import {
  getGitHubURLForRelease,
  Omit,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { fixURL } from '../../../../utils/helpers/github/url'
import { SpringAnimatedIcon } from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { BranchRow } from './BranchRow'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface ReleaseRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  avatarUrl: string
  body: string
  branch?: string
  isRead: boolean
  name: string | undefined
  ownerName: string
  repositoryName: string
  tagName: string | undefined
  url: string
  userLinkURL: string
  username: string
}

export interface ReleaseRowState {}

export const ReleaseRow = React.memo((props: ReleaseRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    avatarUrl,
    body: _body,
    branch,
    isRead,
    name: _name,
    ownerName,
    repositoryName,
    tagName: _tagName,
    url,
    userLinkURL,
    username,
    ...otherProps
  } = props

  const body = trimNewLinesAndSpaces(_body)
  const name = trimNewLinesAndSpaces(_name)
  const tagName = trimNewLinesAndSpaces(_tagName)

  const repoFullName =
    ownerName && repositoryName ? `${ownerName}/${repositoryName}` : ''
  const fixedURL = fixURL(
    url && !url.includes('api.')
      ? url
      : getGitHubURLForRelease(repoFullName, tagName),
  )

  return (
    <View>
      {!!branch && (
        <BranchRow
          key={`branch-row-${branch}`}
          {...otherProps}
          branch={branch}
          isBranchMainEvent={false}
          isRead={isRead}
          ownerName={ownerName || ''}
          repositoryName={repositoryName || ''}
        />
      )}

      {!!(name || tagName) && (
        <BaseRow
          {...otherProps}
          left={
            <Avatar
              isBot={Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)}
              linkURL=""
              small
              style={cardStyles.avatar}
              username={ownerName}
            />
          }
          right={
            <Link href={fixedURL} style={cardRowStyles.mainContentContainer}>
              <SpringAnimatedText
                style={[
                  getCardStylesForTheme(springAnimatedTheme).normalText,
                  isRead &&
                    getCardStylesForTheme(springAnimatedTheme).mutedText,
                ]}
              >
                <SpringAnimatedText numberOfLines={1}>
                  <SpringAnimatedIcon
                    name="tag"
                    size={13}
                    style={[
                      getCardStylesForTheme(springAnimatedTheme).normalText,
                      getCardStylesForTheme(springAnimatedTheme).icon,
                      isRead &&
                        getCardStylesForTheme(springAnimatedTheme).mutedText,
                    ]}
                  />{' '}
                </SpringAnimatedText>
                {name || tagName}
              </SpringAnimatedText>
            </Link>
          }
        />
      )}

      {!!(body && body !== name && body !== tagName) && (
        <BaseRow
          {...otherProps}
          left={
            <Avatar
              avatarUrl={avatarUrl}
              isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
              linkURL={userLinkURL}
              small
              style={cardStyles.avatar}
              username={username}
            />
          }
          right={
            <Link href={fixedURL} style={cardRowStyles.mainContentContainer}>
              <SpringAnimatedText
                style={[
                  getCardStylesForTheme(springAnimatedTheme).normalText,
                  isRead &&
                    getCardStylesForTheme(springAnimatedTheme).mutedText,
                ]}
              >
                <SpringAnimatedText numberOfLines={1}>
                  <SpringAnimatedIcon
                    name="megaphone"
                    size={13}
                    style={[
                      getCardStylesForTheme(springAnimatedTheme).normalText,
                      getCardStylesForTheme(springAnimatedTheme).icon,
                      isRead &&
                        getCardStylesForTheme(springAnimatedTheme).mutedText,
                    ]}
                  />{' '}
                </SpringAnimatedText>
                {body}
              </SpringAnimatedText>
            </Link>
          }
        />
      )}
    </View>
  )
})
