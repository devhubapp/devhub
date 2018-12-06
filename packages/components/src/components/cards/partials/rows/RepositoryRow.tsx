import React from 'react'
import { Animated, View } from 'react-native'

import { useAnimatedTheme } from '../../../../hooks/use-animated-theme'
import { AnimatedIcon } from '../../../animated/AnimatedIcon'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { getCardStylesForTheme } from '../../styles'
import { getRepositoryURL } from './helpers'
import { getCardRowStylesForTheme } from './styles'

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
  const theme = useAnimatedTheme()

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
    <View style={getCardRowStylesForTheme(theme).container}>
      <View
        style={[
          getCardStylesForTheme(theme).leftColumn,
          smallLeftColumn
            ? getCardStylesForTheme(theme).leftColumn__small
            : getCardStylesForTheme(theme).leftColumn__big,
        ]}
      >
        <Avatar
          isBot={isBot}
          linkURL=""
          small
          style={getCardStylesForTheme(theme).avatar}
          username={ownerName}
        />
      </View>

      <View style={getCardStylesForTheme(theme).rightColumn}>
        <Link
          href={
            showMoreItemsIndicator
              ? undefined
              : getRepositoryURL(ownerName, repositoryName)
          }
          style={getCardRowStylesForTheme(theme).mainContentContainer}
        >
          <Animated.Text numberOfLines={1}>
            <AnimatedIcon
              name={repoIcon}
              style={[
                getCardStylesForTheme(theme).normalText,
                isRead && getCardStylesForTheme(theme).mutedText,
              ]}
            />{' '}
            <Animated.Text
              style={[
                getCardStylesForTheme(theme).normalText,
                getCardRowStylesForTheme(theme).repositoryText,
                isRead && getCardStylesForTheme(theme).mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '' : repositoryName}
            </Animated.Text>
            <Animated.Text
              style={[
                getCardStylesForTheme(theme).normalText,
                getCardRowStylesForTheme(theme).repositorySecondaryText,
                (isRead || showMoreItemsIndicator) &&
                  getCardStylesForTheme(theme).mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '...' : ` ${ownerName}`}
            </Animated.Text>
          </Animated.Text>
        </Link>
      </View>
    </View>
  )
})
