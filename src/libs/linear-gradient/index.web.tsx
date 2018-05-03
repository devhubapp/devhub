import React, { SFC } from 'react'
import { PointProperties, View, ViewStyle } from 'react-native'

export interface IProps {
  colors: string[]
  endPoint: PointProperties
  height: number
  // locations: string[]
  startPoint: PointProperties
  style?: ViewStyle
  width: number
}

const radToDeg = (angle: number) => angle * (180 / Math.PI)
const pointsToAngle = (p1: PointProperties, p2: PointProperties) =>
  radToDeg(Math.atan2(p2.y - p1.y, p2.x - p1.x)) + 90

const pointsToDeg = (startPoint: PointProperties, endPoint: PointProperties) =>
  `${pointsToAngle(startPoint, endPoint)}deg`

const propsToLinearGradient = ({
  colors,
  endPoint,
  startPoint,
}: Pick<IProps, 'colors' | 'endPoint' | 'startPoint'>) =>
  `linear-gradient(${pointsToDeg(startPoint, endPoint)}, ${colors.join(', ')})`

const LinearGradient: SFC<IProps> = ({
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
