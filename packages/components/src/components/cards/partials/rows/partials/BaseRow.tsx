import React from 'react'
import { View, ViewProps } from 'react-native'

import { CardViewMode } from '@devhub/core'
import { cardStyles } from '../../../styles'
import { cardRowStyles } from '../styles'

export interface BaseRowProps {
  containerStyle?: ViewProps['style']
  left: React.ReactNode
  leftContainerStyle?: ViewProps['style']
  right: React.ReactNode
  rightContainerStyle?: ViewProps['style']
  viewMode: CardViewMode
  withTopMargin: boolean
}

export interface BaseRowState {}

export function BaseRow(props: BaseRowProps) {
  const {
    containerStyle,
    left,
    leftContainerStyle,
    right,
    rightContainerStyle,
    viewMode,
    withTopMargin,
  } = props

  return (
    <View
      style={[
        cardRowStyles.container,
        withTopMargin && cardRowStyles.container__margin,
        containerStyle,
      ]}
    >
      <View
        style={[
          cardStyles.leftColumn,
          viewMode === 'compact'
            ? cardStyles.leftColumn__small
            : cardStyles.leftColumn__big,
          leftContainerStyle,
        ]}
      >
        {left}
      </View>

      <View style={[cardStyles.rightColumn, rightContainerStyle]}>{right}</View>
    </View>
  )
}
