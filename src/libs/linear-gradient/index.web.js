import React, { PropTypes } from 'react'
import { View } from 'react-native'

const radToDeg = angle => angle * (180 / Math.PI)
const pointsToAngle = (p1, p2) =>
  radToDeg(Math.atan2(p2.y - p1.y, p2.x - p1.x)) + 90

const propsToDeg = ({ start, end }) => `${pointsToAngle(start, end)}deg`

const propsToLinearGradient = ({
  colors,
  ...props
}) => `linear-gradient(${propsToDeg(props)}, ${colors.join(', ')})`

const LinearGradient = ({ style, ...props }) => (
  <View
    style={[style, { background: propsToLinearGradient(props) }]}
    {...props}
  />
)

LinearGradient.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  end: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  ]),
  height: PropTypes.number,
  locations: PropTypes.arrayOf(PropTypes.string),
  start: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  ]),
  width: PropTypes.number,
}

export default LinearGradient
