import React from 'react'

import { getGitHubURLForRepo, getGitHubURLForUser, Omit } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding } from '../../../../styles/variables'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { Spacer } from '../../../common/Spacer'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { getCardRowStylesForTheme } from './styles'

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
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

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
              numberOfLines: hideOwner ? 2 : 1,
              style: [
                getCardStylesForTheme(springAnimatedTheme).normalText,
                small && cardStyles.smallText,
                getCardRowStylesForTheme(springAnimatedTheme).repositoryText,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ],
            }}
          >
            {/* <SpringAnimatedIcon
              name={repoIcon}
              size={13}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardStylesForTheme(springAnimatedTheme).icon,
                { color: undefined },
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
                  numberOfLines: 1,
                  style: [
                    getCardStylesForTheme(springAnimatedTheme).normalText,
                    getCardRowStylesForTheme(springAnimatedTheme)
                      .repositorySecondaryText,
                    small && cardStyles.smallText,
                    (isRead || showMoreItemsIndicator) &&
                      getCardStylesForTheme(springAnimatedTheme).mutedText,
                  ],
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
