import React from 'react'
import { View } from 'react-native'

import { Omit, trimNewLinesAndSpaces } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { fixURL } from '../../../../utils/helpers/github/url'
import { SpringAnimatedIcon } from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface WikiPageRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  bold?: boolean
  hideIcon?: boolean
  isRead: boolean
  name?: string
  showMoreItemsIndicator?: boolean
  title: string
  url: string
}

export interface WikiPageRowState {}

export const WikiPageRow = React.memo((props: WikiPageRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    bold,
    hideIcon,
    isRead,
    name,
    showMoreItemsIndicator,
    title: _title,
    url,
    ...otherProps
  } = props

  const title = trimNewLinesAndSpaces(_title || name)
  if (!title) return null

  return (
    <BaseRow
      {...otherProps}
      left={null}
      right={
        <View style={cardRowStyles.mainContentContainer}>
          <Link
            href={showMoreItemsIndicator ? undefined : fixURL(url)}
            style={cardRowStyles.mainContentContainer}
          >
            <SpringAnimatedText
              numberOfLines={1}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                bold && cardStyles.boldText,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            >
              {!hideIcon && (
                <>
                  <SpringAnimatedIcon
                    name="book"
                    size={13}
                    style={[
                      getCardStylesForTheme(springAnimatedTheme).normalText,
                      getCardStylesForTheme(springAnimatedTheme).icon,
                      isRead &&
                        getCardStylesForTheme(springAnimatedTheme).mutedText,
                    ]}
                  />{' '}
                </>
              )}
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
      }
    />
  )
})
