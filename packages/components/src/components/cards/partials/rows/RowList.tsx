import React, { ReactElement, ReactNode } from 'react'

import { contentPadding } from '../../../../styles/variables'
import { ScrollViewWithOverlay } from '../../../common/ScrollViewWithOverlay'

export type RenderItem<T> = (
  params: { item: T; index: number; showMoreItemsIndicator?: boolean },
) => ReactNode

export interface RowListProps<T> {
  data: T[]
  maxHeight?: number
  maxLength?: number
  narrow?: boolean
  renderItem: RenderItem<T>
}

export const RowList = React.memo((props: RowListProps<any>) => {
  const { data, maxHeight = 220, maxLength = 5, narrow, renderItem } = props
  if (!(data && data.length > 0)) return null

  if (data.length === 1)
    return renderItem({ item: data[0], index: 0 }) as ReactElement<{}>

  const slicedData =
    maxLength >= 1 && data.length > maxLength
      ? data.slice(0, maxLength - 1)
      : data

  const isSliced = data.length > slicedData.length

  return (
    <ScrollViewWithOverlay
      alwaysBounceVertical={false}
      containerStyle={{
        flex: 0,
        flexBasis: 'auto',
        flexGrow: 1,
        marginBottom: -(narrow ? contentPadding / 2 : contentPadding),
      }}
      contentContainerStyle={{
        paddingBottom: narrow ? contentPadding / 2 : contentPadding,
      }}
      overlaySize={narrow ? contentPadding / 2 : contentPadding}
      overlaySpacing={0}
      style={{ maxHeight }}
    >
      {slicedData.map((item, index) => renderItem({ item, index }))}
      {isSliced &&
        renderItem({
          index: slicedData.length,
          item: data[slicedData.length],
          showMoreItemsIndicator: true,
        })}
    </ScrollViewWithOverlay>
  )
})
