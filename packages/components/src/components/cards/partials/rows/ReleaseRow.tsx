import React from 'react'
import { View } from 'react-native'

import { getGitHubURLForRelease, trimNewLinesAndSpaces } from '@devhub/core'
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
  muted: boolean
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
    muted,
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
          muted={muted}
          ownerName={ownerName || ''}
          repositoryName={repositoryName || ''}
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
                muted={muted}
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
                  color: muted ? 'foregroundColorMuted65' : 'foregroundColor',
                  numberOfLines: 1,
                  style: [cardStyles.normalText, bold && cardStyles.boldText],
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
        />
      )}

      {!!(body && body !== name && body !== tagName) && (
        <CommentRow
          avatarUrl={avatarUrl}
          body={body}
          muted={muted}
          leftContent="avatar"
          url={fixedURL}
          userLinkURL={userLinkURL}
          username={username}
          withTopMargin
        />
      )}
    </View>
  )
})

ReleaseRow.displayName = 'ReleaseRow'
