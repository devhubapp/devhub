import React from 'react'
import { View } from 'react-native'

import { Omit, trimNewLinesAndSpaces } from '@devhub/core'
import { fixURL } from '../../../../utils/helpers/github/url'
import { Link } from '../../../common/Link'
import { ThemedIcon } from '../../../themed/ThemedIcon'
import { ThemedText } from '../../../themed/ThemedText'
import { cardStyles } from '../../styles'
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
            enableTextWrapper
            href={showMoreItemsIndicator ? undefined : fixURL(url)}
            style={cardRowStyles.mainContentContainer}
            textProps={{
              color: isRead ? 'foregroundColorMuted50' : 'foregroundColor',
              // color: 'foregroundColor',
              numberOfLines: 1,
              style: [
                cardStyles.normalText,
                bold && cardStyles.boldText,
                // isRead && { fontWeight: undefined },
              ],
            }}
          >
            <>
              {!hideIcon && (
                <>
                  <ThemedIcon name="book" size={13} style={cardStyles.icon} />{' '}
                </>
              )}
              {showMoreItemsIndicator ? '' : title}
              {!!showMoreItemsIndicator && (
                <ThemedText color="foregroundColorMuted50" numberOfLines={1}>
                  ...
                </ThemedText>
              )}
            </>
          </Link>
        </View>
      }
    />
  )
})
