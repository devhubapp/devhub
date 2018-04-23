import React, { ReactElement, ReactNode, SFC } from 'react'
import { ScrollView } from 'react-native'

import { contentPadding } from '../../../../styles/variables'
import { ITheme } from '../../../../types'
import TransparentTextOverlay from '../../../common/TransparentTextOverlay'

export type RenderItem<Item> = (
  {
    item,
    index,
    showMoreItemsIndicator,
  }: { item: Item; index: number; showMoreItemsIndicator?: boolean },
) => ReactNode

export interface RowListProperties<Item> {
  data: any[]
  maxHeight?: number
  maxLength?: number
  narrow?: boolean
  renderItem: RenderItem<Item>
  theme: ITheme
}

const RowList: SFC<RowListProperties<any>> = ({
  data,
  maxHeight = 220,
  maxLength = 5,
  narrow,
  renderItem,
  theme,
}) => {
  if (!(data && data.length > 0)) return null

  if (data.length === 1)
    return renderItem({ item: data[0], index: 0 }) as ReactElement<{}>

  const slicedData =
    maxLength >= 1 && data.length > maxLength
      ? data.slice(0, maxLength - 1)
      : data

  const isSliced = data.length > slicedData.length

  return (
    <TransparentTextOverlay
      color={theme.base02}
      size={narrow ? contentPadding / 2 : contentPadding}
      from="vertical"
      containerStyle={{ flex: 0 }}
    >
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={{
          paddingBottom: narrow ? contentPadding / 2 : contentPadding,
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
    </TransparentTextOverlay>
  )
}

export default RowList
