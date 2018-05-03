import React, { SFC } from 'react'
import { View, ViewStyle } from 'react-native'
import { LinearGradientProps as OriginalLinearGradientProps } from 'react-native-linear-gradient'

type LinearGradientPoint =
  | OriginalLinearGradientProps['startPoint']
  | OriginalLinearGradientProps['endPoint']

export interface LinearGradientProps extends OriginalLinearGradientProps {
  height: number
  style?: ViewStyle
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

const pointsToDeg = (
  startPoint: LinearGradientPoint,
  endPoint: LinearGradientPoint,
) => `${pointsToAngle(startPoint, endPoint)}deg`

const propsToLinearGradient = ({
  colors,
  endPoint,
  startPoint,
}: Pick<LinearGradientProps, 'colors' | 'endPoint' | 'startPoint'>) =>
  `linear-gradient(${pointsToDeg(startPoint, endPoint)}, ${colors.join(', ')})`

const LinearGradient: SFC<LinearGradientProps> = ({
  colors,
  endPoint,
  // locations,
  startPoint,
  style,
  ...props
}) => (
  <View
    {...props}
    style={[
      style,
      {
        backgroundColor: propsToLinearGradient({
          colors,
          endPoint,
          // locations,
          startPoint,
        }),
      },
    ]}
  />
)

export default LinearGradient
