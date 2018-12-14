import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { LinearGradientProps as OriginalLinearGradientProps } from 'react-native-linear-gradient'
import { Platform } from '../platform'

type LinearGradientPoint =
  | OriginalLinearGradientProps['start']
  | OriginalLinearGradientProps['end']

export interface LinearGradientProps extends OriginalLinearGradientProps {
  height: number
  style?: StyleProp<ViewStyle>
  width: number
}

const radToDeg = (angle: number) => angle * (180 / Math.PI)
const pointsToAngle = (p1: LinearGradientPoint, p2: LinearGradientPoint) =>
  radToDeg(
    Math.atan2(
      ((p2 && p2.y) || 0) - ((p1 && p1.y) || 0),
      ((p2 && p2.x) || 0) - ((p1 && p1.x) || 0),
    ),
  ) + 90

const pointsToDeg = (start: LinearGradientPoint, end: LinearGradientPoint) =>
  `${pointsToAngle(start, end)}deg`

const propsToLinearGradient = ({
  colors,
  end,
  start,
}: Pick<LinearGradientProps, 'colors' | 'end' | 'start'>) =>
  `linear-gradient(${pointsToDeg(start, end)}, ${colors.join(', ')})`

export function LinearGradient(props: LinearGradientProps) {
  const {
    accessibilityStates: _accessibilityStates,
    colors,
    end,
    // locations,
    start,
    style,
    ...otherProps
  } = props

  const backgroundField = Platform.select({
    web: 'backgroundImage',
    default: 'background',
  })

  return (
    <View
      {...otherProps}
      style={[
        style,
        {
          [backgroundField]: propsToLinearGradient({
            colors,
            end,
            // locations,
            start,
          }),
        },
      ]}
    />
  )
}
