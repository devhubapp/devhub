import React from 'react'
import { View } from 'react-native'

import { getGitHubURLForRepo, getGitHubURLForUser, Omit } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { contentPadding } from '../../../../styles/variables'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { Spacer } from '../../../common/Spacer'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { getCardRowStylesForTheme } from './styles'

export interface RepositoryRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  isForcePush?: boolean
  isFork?: boolean
  isPush?: boolean
  isRead: boolean
  ownerName: string
  repositoryName: string
  showMoreItemsIndicator?: boolean
}

export interface RepositoryRowState {}

export const RepositoryRow = React.memo((props: RepositoryRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    // isForcePush,
    // isFork,
    // isPush,
    isRead,
    ownerName,
    repositoryName,
    showMoreItemsIndicator,
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
      right={
        <View
          style={[cardStyles.flex, cardStyles.horizontalAndVerticallyAligned]}
        >
          <Link
            href={
              showMoreItemsIndicator
                ? undefined
                : getGitHubURLForRepo(ownerName, repositoryName)
            }
          >
            {/* <SpringAnimatedText numberOfLines={1}> */}
            {/* <SpringAnimatedIcon
              name={repoIcon}
              size={13}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardStylesForTheme(springAnimatedTheme).icon,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            />{' '} */}
            <SpringAnimatedText
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardRowStylesForTheme(springAnimatedTheme).repositoryText,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '' : repositoryName}
            </SpringAnimatedText>
            {/* </SpringAnimatedText> */}
          </Link>

          {!!(ownerName && repositoryName) && (
            <Spacer width={contentPadding / 4} />
          )}

          <Link
            href={
              showMoreItemsIndicator
                ? undefined
                : getGitHubURLForUser(ownerName)
            }
          >
            <SpringAnimatedText
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardRowStylesForTheme(springAnimatedTheme)
                  .repositorySecondaryText,
                (isRead || showMoreItemsIndicator) &&
                  getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '...' : ownerName}
            </SpringAnimatedText>
          </Link>
        </View>
      }
    />
  )
})
