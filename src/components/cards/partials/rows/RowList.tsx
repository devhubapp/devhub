import React, { ReactNode, SFC } from 'react'
import { ScrollView } from 'react-native'

import { contentPadding } from '../../../../styles/variables'
import { ITheme } from '../../../../types'
import TransparentTextOverlay from '../../../common/TransparentTextOverlay'

export interface IProps {
  data: any[]
  maxHeight?: number
  narrow?: boolean
  renderItem: ({ item, index }: { item: any; index: number }) => ReactNode
  theme: ITheme
}

const RowList: SFC<IProps> = ({
  data,
  maxHeight = 200,
  narrow,
  renderItem,
  theme,
  ...props
}) => {
  if (!(data && data.length > 0)) return null

  if (data.length === 1) return renderItem({ item: data[0], index: 0 })

  return (
    <TransparentTextOverlay
      {...props}
      color={theme.base02}
      size={narrow ? contentPadding / 2 : contentPadding}
      from="vertical"
      containerStyle={{ flex: 0 }}
    >
      <ScrollView
        style={{ maxHeight }}
        contentContainerStyle={{
          paddingBottom: narrow ? contentPadding / 2 : contentPadding,
        }}
        alwaysBounceVertical={false}
      >
        {data.map((item, index) => renderItem({ item, index }))}
      </ScrollView>
    </TransparentTextOverlay>
  )
}

export default RowList
