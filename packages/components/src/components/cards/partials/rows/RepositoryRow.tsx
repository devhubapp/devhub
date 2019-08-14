import React from 'react'

import { getGitHubURLForRepo, getGitHubURLForUser } from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding } from '../../../../styles/variables'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { Spacer } from '../../../common/Spacer'
import { cardStyles } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'

export interface RepositoryRowProps
  extends Omit<BaseRowProps, 'contentContainerStyle' | 'left' | 'right'> {
  hideOwner?: boolean
  isForcePush?: boolean
  isFork?: boolean
  isPush?: boolean
  muted: boolean
  ownerName: string
  repositoryName: string
  small?: boolean
}

export interface RepositoryRowState {}

export const RepositoryRow = React.memo((props: RepositoryRowProps) => {
  const {
    hideOwner,
    // isForcePush,
    // isFork,
    // isPush,
    muted,
    ownerName,
    repositoryName,
    rightContainerStyle,
    small,
    ...otherProps
  } = props

  // const repoIcon =
  //   (isForcePush && 'repo-force-push') ||
  //   (isPush && 'repo-push') ||
  //   (isFork && 'repo-forked') ||
  //   'repo'

  const isBot = Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)

  return (
    <BaseRow
      {...otherProps}
      left={
        <Avatar
          isBot={isBot}
          linkURL=""
          muted={muted}
          small
          style={cardStyles.avatar}
          username={ownerName}
        />
      }
      rightContainerStyle={[
        sharedStyles.flex,
        sharedStyles.horizontalAndVerticallyAligned,
        rightContainerStyle,
      ]}
      right={
        <>
          <Link
            href={getGitHubURLForRepo(ownerName, repositoryName)}
            textProps={{
              color: muted ? 'foregroundColorMuted65' : 'foregroundColor',
              numberOfLines: hideOwner ? 2 : 1,
              style: [cardStyles.normalText, small && cardStyles.smallText],
            }}
          >
            {/* <ThemedIcon
              name={repoIcon}
              size={13}
              style={[
                cardStyles.normalText,
                cardStyles.icon,
              ]}
            />{' '} */}
            {repositoryName}
          </Link>

          {!!(ownerName && !hideOwner) && (
            <>
              {!!repositoryName && <Spacer width={contentPadding / 3} />}

              <Link
                href={getGitHubURLForUser(ownerName)}
                textProps={{
                  color: 'foregroundColorMuted65',
                  numberOfLines: 1,
                  style: [cardStyles.normalText, small && cardStyles.smallText],
                }}
              >
                {ownerName}
              </Link>
            </>
          )}
        </>
      }
    />
  )
})

RepositoryRow.displayName = 'RepositoryRow'
