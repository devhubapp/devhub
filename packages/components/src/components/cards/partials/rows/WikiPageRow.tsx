import React from 'react'
import { View } from 'react-native'

import { trimNewLinesAndSpaces } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { fixURL } from '../../../../utils/helpers/github/url'
import { SpringAnimatedIcon } from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { cardRowStyles } from './styles'

export interface WikiPageRowProps {
  isRead: boolean
  name?: string
  showMoreItemsIndicator?: boolean
  smallLeftColumn?: boolean
  title: string
  url: string
}

export interface WikiPageRowState {}

export const WikiPageRow = React.memo((props: WikiPageRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    isRead,
    name,
    showMoreItemsIndicator,
    smallLeftColumn,
    title: _title,
    url,
  } = props

  const title = trimNewLinesAndSpaces(_title || name)
  if (!title) return null

  return (
    <View style={cardRowStyles.container}>
      <View
        style={[
          cardStyles.leftColumn,
          smallLeftColumn
            ? cardStyles.leftColumn__small
            : cardStyles.leftColumn__big,
        ]}
      />

      <View style={cardStyles.rightColumn}>
        <Link
          href={showMoreItemsIndicator ? undefined : fixURL(url)}
          style={cardRowStyles.mainContentContainer}
        >
          <SpringAnimatedText
            numberOfLines={1}
            style={[
              getCardStylesForTheme(springAnimatedTheme).normalText,
              isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
            ]}
          >
            <SpringAnimatedIcon
              name="book"
              size={13}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardStylesForTheme(springAnimatedTheme).icon,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            />{' '}
            {showMoreItemsIndicator ? '' : title}
            {!!showMoreItemsIndicator && (
              <SpringAnimatedText
                numberOfLines={1}
                style={[
                  getCardStylesForTheme(springAnimatedTheme).normalText,
                  getCardStylesForTheme(springAnimatedTheme).mutedText,
                ]}
              >
                ...
              </SpringAnimatedText>
            )}
          </SpringAnimatedText>
        </Link>
      </View>
    </View>
  )
})
