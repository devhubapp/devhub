import React, { ReactElement, ReactNode, SFC } from 'react'
import { ScrollView } from 'react-native'

import { contentPadding } from '../../../../styles/variables'
import TransparentTextOverlay from '../../../common/TransparentTextOverlay'
import { ThemeConsumer } from '../../../context/ThemeContext'

export type RenderItem<Item> = (
  {
    item,
    index,
    showMoreItemsIndicator,
  }: { item: Item; index: number; showMoreItemsIndicator?: boolean },
) => ReactNode

export interface RowListProps<Item> {
  data: any[]
  maxHeight?: number
  maxLength?: number
  narrow?: boolean
  renderItem: RenderItem<Item>
}

const RowList: SFC<RowListProps<any>> = ({
  data,
  maxHeight = 220,
  maxLength = 5,
  narrow,
  renderItem,
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
    <ThemeConsumer>
      {({ theme }) => (
        <TransparentTextOverlay
          color={theme.backgroundColor}
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
      )}
    </ThemeConsumer>
  )
}

export default RowList
