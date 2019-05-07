import React from 'react'

import { getGitHubURLForRepo, getGitHubURLForUser, Omit } from '@devhub/core'
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
  isRead: boolean
  ownerName: string
  repositoryName: string
  showMoreItemsIndicator?: boolean
  small?: boolean
}

export interface RepositoryRowState {}

export const RepositoryRow = React.memo((props: RepositoryRowProps) => {
  const {
    hideOwner,
    // isForcePush,
    // isFork,
    // isPush,
    isRead,
    ownerName,
    repositoryName,
    rightContainerStyle,
    showMoreItemsIndicator,
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
            href={
              showMoreItemsIndicator
                ? undefined
                : getGitHubURLForRepo(ownerName, repositoryName)
            }
            textProps={{
              color: isRead ? 'foregroundColorMuted50' : 'foregroundColor',
              // color: 'foregroundColor',
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
            {showMoreItemsIndicator ? '' : repositoryName}
          </Link>

          {!!(ownerName && !hideOwner) && (
            <>
              {!!repositoryName && <Spacer width={contentPadding / 3} />}

              <Link
                href={
                  showMoreItemsIndicator
                    ? undefined
                    : getGitHubURLForUser(ownerName)
                }
                textProps={{
                  color: 'foregroundColorMuted50',
                  numberOfLines: 1,
                  style: [cardStyles.normalText, small && cardStyles.smallText],
                }}
              >
                {showMoreItemsIndicator ? '...' : ownerName}
              </Link>
            </>
          )}
        </>
      }
    />
  )
})
