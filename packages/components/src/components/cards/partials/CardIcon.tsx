import React from 'react'
import { StyleSheet } from 'react-native'

import { Omit } from '@devhub/core/dist/types'
import { IconProps } from 'react-native-vector-icons/Icon'
import { Octicons as Icon } from '../../../libs/vector-icons'
import { contentPadding } from '../../../styles/variables'

export interface CardIconProps extends Omit<IconProps, 'accessibilityRole'> {}

const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    marginLeft: contentPadding,
  },
})

export function CardIcon(props: CardIconProps) {
  return <Icon {...props} style={[styles.container, props.style]} />
}
