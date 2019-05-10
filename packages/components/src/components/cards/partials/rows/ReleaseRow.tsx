import React from 'react'
import { View } from 'react-native'

import {
  getGitHubURLForRelease,
  Omit,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { smallAvatarSize } from '../../../../styles/variables'
import { fixURL } from '../../../../utils/helpers/github/url'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { ThemedIcon } from '../../../themed/ThemedIcon'
import { cardStyles } from '../../styles'
import { BranchRow } from './BranchRow'
import { CommentRow } from './CommentRow'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface ReleaseRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  avatarUrl: string
  body: string
  bold?: boolean
  branch?: string
  hideIcon?: boolean
  isPrivate: boolean
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
  const {
    avatarUrl,
    body: _body,
    bold,
    branch,
    hideIcon,
    isPrivate,
    isRead,
    name: _name,
    ownerName,
    repositoryName,
    tagName: _tagName,
    url,
    userLinkURL,
    username,
    viewMode,
    ...otherProps
  } = props

  const body = trimNewLinesAndSpaces(_body)
  const name = trimNewLinesAndSpaces(_name)
  const tagName = trimNewLinesAndSpaces(_tagName)

  const fixedURL = fixURL(
    url && !url.includes('api.')
      ? url
      : getGitHubURLForRelease(ownerName, repositoryName, tagName),
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
          viewMode={viewMode}
        />
      )}

      {!!(name || tagName) && (
        <BaseRow
          {...otherProps}
          left={
            ownerName ? (
              <Avatar
                isBot={Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)}
                linkURL=""
                small
                style={cardStyles.avatar}
                username={ownerName}
              />
            ) : isPrivate ? (
              <ThemedIcon color="orange" name="lock" size={smallAvatarSize} />
            ) : null
          }
          right={
            <View style={cardRowStyles.mainContentContainer}>
              <Link
                enableTextWrapper
                href={fixedURL}
                textProps={{
                  color: isRead ? 'foregroundColorMuted60' : 'foregroundColor',
                  // color: 'foregroundColor',
                  numberOfLines: 1,
                  style: [
                    cardStyles.normalText,
                    bold && cardStyles.boldText,
                    // isRead && { fontWeight: undefined },
                  ],
                }}
              >
                <>
                  {!hideIcon && (
                    <>
                      <ThemedIcon
                        name="tag"
                        size={13}
                        style={[cardStyles.normalText, cardStyles.icon]}
                      />{' '}
                    </>
                  )}

                  {name || tagName}
                </>
              </Link>
            </View>
          }
          viewMode={viewMode}
        />
      )}

      {!!(body && body !== name && body !== tagName) && (
        <CommentRow
          avatarUrl={avatarUrl}
          body={body}
          isRead={isRead}
          leftContent="avatar"
          url={fixedURL}
          userLinkURL={userLinkURL}
          username={username}
          viewMode={viewMode}
          withTopMargin
        />
      )}
    </View>
  )
})
