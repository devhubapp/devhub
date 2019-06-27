import React, { ReactElement, ReactNode, useState } from 'react'
import { View } from 'react-native'

import { CardViewMode, mergeMaxLength } from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import {
  contentPadding,
  smallAvatarSize,
  smallerTextSize,
} from '../../../../styles/variables'
import { Link } from '../../../common/Link'
import {
  ScrollViewWithOverlay,
  ScrollViewWithOverlayProps,
} from '../../../common/ScrollViewWithOverlay'
import { Spacer } from '../../../common/Spacer'
import { spacingBetweenLeftAndRightColumn } from '../../styles'
import { innerCardSpacing, topCardMargin } from './styles'

export type RenderItem<T> = (params: { item: T; index: number }) => ReactNode

export interface RowListProps<T> {
  data: T[]
  maxHeight?: number
  maxLength?: number
  overlayThemeColor: ScrollViewWithOverlayProps['overlayThemeColor']
  renderItem: RenderItem<T>
  viewMode: CardViewMode
}

export const rowListProps: Array<keyof RowListProps<any>> = [
  'data',
  'maxHeight',
  'maxLength',
  'overlayThemeColor',
  'renderItem',
  'viewMode',
]

export const RowList = React.memo((props: RowListProps<any>) => {
  const [showAll, setShowAll] = useState(false)

  const {
    data,
    maxHeight = mergeMaxLength * (20 + topCardMargin) * (showAll ? 2 : 1),
    maxLength = mergeMaxLength,
    overlayThemeColor,
    renderItem,
  } = props

  if (!(data && data.length > 0)) return null

  if (data.length === 1)
    return renderItem({ item: data[0], index: 0 }) as ReactElement<{}>

  const slicedData =
    showAll || !(maxLength >= 1 && data.length > maxLength)
      ? data
      : data.slice(0, maxLength - 1)

  const isSliced = data.length > slicedData.length

  return (
    <View>
      <ScrollViewWithOverlay
        alwaysBounceVertical={false}
        overlayThemeColor={overlayThemeColor}
        style={{ maxHeight }}
      >
        {slicedData.map((item, index) => renderItem({ item, index }))}
      </ScrollViewWithOverlay>

      {(isSliced || showAll) && (
        <>
          <Spacer height={contentPadding / 2} />

          <View style={sharedStyles.horizontal}>
            <Spacer
              width={smallAvatarSize + spacingBetweenLeftAndRightColumn}
            />

            <Link
              onPress={() => setShowAll(!showAll)}
              textProps={{
                color: 'foregroundColorMuted60',
                style: { fontSize: smallerTextSize },
              }}
            >
              {showAll
                ? 'Show less'
                : `Show more (${data.length - slicedData.length})`}
            </Link>
          </View>

          <Spacer height={innerCardSpacing} />
        </>
      )}
    </View>
  )
})

RowList.displayName = 'RowList'
