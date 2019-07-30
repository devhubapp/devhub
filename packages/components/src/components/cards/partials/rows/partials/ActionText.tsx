import React, { Fragment } from 'react'
import { View } from 'react-native'

import {
  getGitHubURLForBranch,
  getGitHubURLForRelease,
  getGitHubURLForRepo,
  ThemeColors,
} from '@devhub/core'
import { Platform } from '../../../../../libs/platform'
import { sharedStyles } from '../../../../../styles/shared'
import { smallAvatarSize } from '../../../../../styles/variables'
import { EMPTY_OBJ } from '../../../../../utils/constants'
import { genericParseText } from '../../../../../utils/helpers/shared'
import { Link } from '../../../../common/Link'
import { ThemedText, ThemedTextProps } from '../../../../themed/ThemedText'
import { cardStyles } from '../../../styles'

export interface ActionTextProps {
  body: string
  branch: string | undefined
  forkOwnerName: string | undefined
  forkRepositoryName: string | undefined
  muted: boolean
  numberOfLines?: number
  ownerName: string
  repositoryName: string
  tag: string | undefined
  textStyle?: ThemedTextProps['style']
}

export const ActionText = React.memo((props: ActionTextProps) => {
  const {
    body: _body,
    branch,
    forkOwnerName,
    forkRepositoryName,
    muted,
    numberOfLines = props.numberOfLines || 1,
    ownerName,
    repositoryName,
    tag,
    textStyle,
  } = props

  const color: keyof ThemeColors =
    (muted && 'foregroundColorMuted60') || 'foregroundColor'

  const bodyStr = `${_body || ''}`.replace(_body[0], _body[0].toLowerCase())

  const textProps: ThemedTextProps = {
    color,
    numberOfLines,
    style: [
      cardStyles.normalText,
      cardStyles.smallText,
      { lineHeight: smallAvatarSize },
      Platform.select({
        default: EMPTY_OBJ,
        web: {
          whiteSpace: 'pre',
          wordWrap: 'break-word',
        },
      } as any),
      textStyle,
    ],
  }

  const itemMapper = (item: React.ReactNode, index: number) =>
    typeof item === 'string' ? (
      <ThemedText
        key={`action-row-${ownerName}-${repositoryName}-${_body}-${index}`}
        {...textProps}
      >
        {item}
      </ThemedText>
    ) : (
      <Fragment
        key={`action-row-${ownerName}-${repositoryName}-${_body}-${index}`}
      >
        {item}
      </Fragment>
    )

  const bodyParts =
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
                textProps={textProps}
              >
                {match}
              </Link>
            )
          },
        ).map(itemMapper)
      : bodyStr && forkOwnerName && forkRepositoryName
      ? genericParseText(
          bodyStr,
          new RegExp(`${forkOwnerName}/${forkRepositoryName}`, 'i'),
          match => {
            return (
              <Link
                enableTextWrapper
                href={getGitHubURLForRepo(forkOwnerName, forkRepositoryName)}
                openOnNewTab
                textProps={textProps}
              >
                {match}
              </Link>
            )
          },
        ).map(itemMapper)
      : itemMapper(bodyStr, 0)

  return (
    <View
      style={[
        sharedStyles.flexGrow,
        sharedStyles.flexWrap,
        sharedStyles.horizontal,
      ]}
    >
      {bodyParts}
    </View>
  )
})

ActionText.displayName = 'ActionText'
