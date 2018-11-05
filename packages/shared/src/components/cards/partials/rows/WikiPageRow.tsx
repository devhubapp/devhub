import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import { Octicons as Icon } from '../../../../libs/vector-icons'
import { fixURL } from '../../../../utils/helpers/github/url'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import { Link } from '../../../common/Link'
import { ThemeConsumer } from '../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../styles'
import { getCardRowStylesForTheme } from './styles'

export interface WikiPageRowProps {
  isRead: boolean
  name?: string
  showMoreItemsIndicator?: boolean
  title: string
  url: string
}

export interface WikiPageRowState {}

export const WikiPageRow: SFC<WikiPageRowProps> = ({
  isRead,
  name,
  showMoreItemsIndicator,
  title: _title,
  url,
}) => {
  const title = trimNewLinesAndSpaces(_title || name)
  if (!title) return null

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View style={getCardRowStylesForTheme(theme).container}>
          <View style={getCardStylesForTheme(theme).leftColumn} />

          <View style={getCardStylesForTheme(theme).rightColumn}>
            <Link
              href={showMoreItemsIndicator ? undefined : fixURL(url)}
              style={getCardRowStylesForTheme(theme).mainContentContainer}
            >
              <Text
                numberOfLines={1}
                style={[
                  getCardStylesForTheme(theme).normalText,
                  isRead && getCardStylesForTheme(theme).mutedText,
                ]}
              >
                <Icon name="book" /> {showMoreItemsIndicator ? '' : title}
                {!!showMoreItemsIndicator && (
                  <Text
                    numberOfLines={1}
                    style={[
                      getCardStylesForTheme(theme).normalText,
                      getCardStylesForTheme(theme).mutedText,
                    ]}
                  >
                    ...
                  </Text>
                )}
              </Text>
            </Link>
          </View>
        </View>
      )}
    </ThemeConsumer>
  )
}
