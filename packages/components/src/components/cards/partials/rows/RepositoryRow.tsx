import React from 'react'
import { Text, View } from 'react-native'

import { Octicons as Icon } from '../../../../libs/vector-icons'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { useTheme } from '../../../context/ThemeContext'
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
  const theme = useTheme()

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
          <Text
            numberOfLines={1}
            style={[
              getCardStylesForTheme(theme).normalText,
              isRead && getCardStylesForTheme(theme).mutedText,
            ]}
          >
            <Icon name={repoIcon} />{' '}
            <Text
              style={[
                getCardRowStylesForTheme(theme).repositoryText,
                isRead && getCardStylesForTheme(theme).mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '' : repositoryName}
            </Text>
            <Text
              style={[
                getCardRowStylesForTheme(theme).repositorySecondaryText,
                (isRead || showMoreItemsIndicator) &&
                  getCardStylesForTheme(theme).mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '...' : ` ${ownerName}`}
            </Text>
          </Text>
        </Link>
      </View>
    </View>
  )
})
