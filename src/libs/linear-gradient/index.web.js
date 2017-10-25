// @flow

import React from 'react'
import { View } from 'react-native'

const radToDeg = angle => angle * (180 / Math.PI)
const pointsToAngle = (p1, p2) =>
  radToDeg(Math.atan2(p2.y - p1.y, p2.x - p1.x)) + 90

const propsToDeg = ({ start, end }) => `${pointsToAngle(start, end)}deg`

const propsToLinearGradient = ({ colors, ...props }) =>
  `linear-gradient(${propsToDeg(props)}, ${colors.join(', ')})`

type Props = {
  colors: Array<string>,
  end: Array<number> | { x: number, y: number },
  height: number,
  locations: Array<string>,
  start: Array<number> | { x: number, y: number },
  style: object | Array<object>,
  width: number,
}

const LinearGradient = ({ style, ...props }: Props) => (
  <View
    style={[style, { background: propsToLinearGradient(props) }]}
    {...props}
  />
)

export default LinearGradient
