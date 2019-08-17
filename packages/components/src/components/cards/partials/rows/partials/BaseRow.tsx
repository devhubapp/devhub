import React from 'react'
import { View, ViewProps } from 'react-native'

import { cardStyles } from '../../../styles'
import { cardRowStyles } from '../styles'

export interface BaseRowProps {
  containerStyle?: ViewProps['style']
  disableLeft?: boolean
  left: React.ReactNode
  leftContainerStyle?: ViewProps['style']
  right: React.ReactNode
  rightContainerStyle?: ViewProps['style']
  smallLeftColumn?: boolean
  withTopMargin: boolean
}

export interface BaseRowState {}

export function BaseRow(props: BaseRowProps) {
  const {
    containerStyle,
    disableLeft,
    left,
    leftContainerStyle,
    right,
    rightContainerStyle,
    smallLeftColumn = true,
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
      {!disableLeft && (
        <View
          style={[
            cardStyles.leftColumn,
            smallLeftColumn
              ? cardStyles.leftColumn__small
              : cardStyles.leftColumn__big,
            leftContainerStyle,
          ]}
        >
          {left}
        </View>
      )}

      <View style={[cardStyles.rightColumn, rightContainerStyle]}>{right}</View>
    </View>
  )
}
