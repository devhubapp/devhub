import React from 'react'
import { View } from 'react-native'

import { getGitHubURLForBranch } from '@devhub/core'
import { smallAvatarSize } from '../../../../styles/variables'
import { Link } from '../../../common/Link'
import { ThemedIcon } from '../../../themed/ThemedIcon'
import { cardStyles } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface BranchRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  branch: string
  isBranchMainEvent: boolean
  isRead: boolean
  ownerName: string
  repositoryName: string
}

export interface BranchRowState {}

export const BranchRow = React.memo((props: BranchRowProps) => {
  const {
    branch,
    isBranchMainEvent,
    isRead,
    ownerName,
    repositoryName,
    ...otherProps
  } = props

  if (!branch) return null
  if (branch === 'master' && !isBranchMainEvent) return null

  const hideIcon = true
  const muted = isRead || !isBranchMainEvent // || branch === 'master'

  return (
    <BaseRow
      {...otherProps}
      left={
        // <Avatar
        //   isBot={Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)}
        //   linkURL=""
        //   small
        //   style={cardStyles.avatar}
        //   username={ownerName}
        //   repo={repositoryName}
        // />
        <ThemedIcon
          color={muted ? 'foregroundColorMuted60' : 'foregroundColor'}
          name="git-branch"
          size={smallAvatarSize}
          style={[{ alignSelf: 'flex-end' }, cardStyles.normalText]}
        />
      }
      right={
        <View style={cardRowStyles.mainContentContainer}>
          <Link
            enableTextWrapper
            href={getGitHubURLForBranch(ownerName, repositoryName, branch)}
            textProps={{
              color: muted ? 'foregroundColorMuted60' : 'foregroundColor',
              numberOfLines: 1,
              style: [cardStyles.normalText, cardStyles.smallText],
            }}
          >
            {!hideIcon && (
              <>
                <ThemedIcon
                  name="git-branch"
                  size={13}
                  style={[cardStyles.normalText, cardStyles.icon]}
                />{' '}
              </>
            )}
            {branch}
          </Link>
        </View>
      }
    />
  )
})
