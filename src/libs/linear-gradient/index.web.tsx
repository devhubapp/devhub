import React, { SFC } from 'react'
import { PointProperties, View, ViewStyle } from 'react-native'

export interface IProps {
  colors: string[]
  end: PointProperties
  height: number
  locations: string[]
  start: PointProperties
  style?: ViewStyle
  width: number
}

const radToDeg = (angle: number) => angle * (180 / Math.PI)
const pointsToAngle = (p1: PointProperties, p2: PointProperties) =>
  radToDeg(Math.atan2(p2.y - p1.y, p2.x - p1.x)) + 90

const propsToDeg = ({ start, end }: IProps) => `${pointsToAngle(start, end)}deg`

const propsToLinearGradient = (props: IProps) =>
  `linear-gradient(${propsToDeg(props)}, ${props.colors.join(', ')})`

const LinearGradient: SFC<IProps> = props => (
  <View
    {...props}
    style={[props.style, { backgroundColor: propsToLinearGradient(props) }]}
  />
)

export default LinearGradient
