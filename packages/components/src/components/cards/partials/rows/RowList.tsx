import React, { ReactElement, ReactNode } from 'react'
import { ScrollView } from 'react-native'

import { useAnimatedTheme } from '../../../../hooks/use-animated-theme'
import { contentPadding } from '../../../../styles/variables'
import { AnimatedTransparentTextOverlay } from '../../../animated/AnimatedTransparentTextOverlay'

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
  const theme = useAnimatedTheme()

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
    <AnimatedTransparentTextOverlay
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
    </AnimatedTransparentTextOverlay>
  )
})
