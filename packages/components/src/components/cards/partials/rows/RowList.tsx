import React, { ReactElement, ReactNode } from 'react'

import { CardViewMode, mergeMaxLength } from '@devhub/core'
import { ScrollView, View } from 'react-native'
import { topCardMargin } from './styles'

export type RenderItem<T> = (params: {
  item: T
  index: number
  showMoreItemsIndicator?: boolean
}) => ReactNode

export interface RowListProps<T> {
  data: T[]
  maxHeight?: number
  maxLength?: number
  renderItem: RenderItem<T>
  viewMode: CardViewMode
}

export const RowList = React.memo((props: RowListProps<any>) => {
  const {
    data,
    maxHeight = 220,
    maxLength = mergeMaxLength,
    renderItem,
  } = props
  if (!(data && data.length > 0)) return null

  if (data.length === 1)
    return renderItem({ item: data[0], index: 0 }) as ReactElement<{}>

  const slicedData =
    maxLength >= 1 && data.length > maxLength
      ? data.slice(0, maxLength - 1)
      : data

  const isSliced = data.length > slicedData.length

  return (
    <View
      style={{
        // flex: 0,
        // flexBasis: 'auto',
        // flexGrow: 1,
        marginBottom: -topCardMargin,
      }}
    >
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={{
          paddingBottom: topCardMargin,
        }}
        style={{ maxHeight }}
      >
        {slicedData.map((item, index) => renderItem({ item, index }))}
        {isSliced &&
          renderItem({
            index: slicedData.length,
            item: data[slicedData.length],
            showMoreItemsIndicator: true,
          })}
      </ScrollView>
    </View>
  )
})
