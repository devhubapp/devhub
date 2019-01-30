import React from 'react'
import { View } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedIcon } from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { getRepositoryURL } from './helpers'
import { cardRowStyles, getCardRowStylesForTheme } from './styles'

export interface RepositoryRowProps {
  isForcePush?: boolean
  isFork?: boolean
  isPush?: boolean
  isRead: boolean
  ownerName: string
  repositoryName: string
  showMoreItemsIndicator?: boolean
  smallLeftColumn?: boolean
}

export interface RepositoryRowState {}

export const RepositoryRow = React.memo((props: RepositoryRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    isForcePush,
    isFork,
    isPush,
    isRead,
    ownerName,
    repositoryName,
    showMoreItemsIndicator,
    smallLeftColumn,
  } = props

  const repoIcon =
    (isForcePush && 'repo-force-push') ||
    (isPush && 'repo-push') ||
    (isFork && 'repo-forked') ||
    'repo'

  const isBot = Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)

  return (
    <View style={cardRowStyles.container}>
      <View
        style={[
          cardStyles.leftColumn,
          smallLeftColumn
            ? cardStyles.leftColumn__small
            : cardStyles.leftColumn__big,
        ]}
      >
        <Avatar
          isBot={isBot}
          linkURL=""
          small
          style={cardStyles.avatar}
          username={ownerName}
        />
      </View>

      <View style={cardStyles.rightColumn}>
        <Link
          href={
            showMoreItemsIndicator
              ? undefined
              : getRepositoryURL(ownerName, repositoryName)
          }
          style={cardRowStyles.mainContentContainer}
        >
          <SpringAnimatedText numberOfLines={1}>
            <SpringAnimatedIcon
              name={repoIcon}
              size={13}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardStylesForTheme(springAnimatedTheme).icon,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            />{' '}
            <SpringAnimatedText
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardRowStylesForTheme(springAnimatedTheme).repositoryText,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '' : repositoryName}
            </SpringAnimatedText>
            <SpringAnimatedText
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardRowStylesForTheme(springAnimatedTheme)
                  .repositorySecondaryText,
                (isRead || showMoreItemsIndicator) &&
                  getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '...' : ` ${ownerName}`}
            </SpringAnimatedText>
          </SpringAnimatedText>
        </Link>
      </View>
    </View>
  )
})
