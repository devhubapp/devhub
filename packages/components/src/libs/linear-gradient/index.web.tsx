import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { LinearGradientProps as OriginalLinearGradientProps } from 'react-native-linear-gradient'

import { Omit } from '@devhub/core'
import { SpringAnimatedView } from '../../components/animated/spring/SpringAnimatedView'

type LinearGradientPoint =
  | OriginalLinearGradientProps['start']
  | OriginalLinearGradientProps['end']

export interface LinearGradientProps
  extends Omit<OriginalLinearGradientProps, 'colors'> {
  animated?: boolean
  colors: Array<string | any>
  style?: StyleProp<ViewStyle>
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
    animated,
    colors,
    end,
    // locations,
    start,
    style,
    ...otherProps
  } = props

  const ViewComponent = animated ? SpringAnimatedView : View

  return (
    <ViewComponent
      {...otherProps}
      style={[
        style,
        {
          backgroundImage: propsToLinearGradient({
            colors,
            end,
            // locations,
            start,
          }),
        } as any,
      ]}
    />
  )
}

export interface SpringAnimatedLinearGradientProps
  extends LinearGradientProps {}

export function SpringAnimatedLinearGradient(
  props: SpringAnimatedLinearGradientProps,
) {
  return <LinearGradient {...props} animated />
}
