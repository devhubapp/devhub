import React, { PureComponent } from 'react'
import { TextStyle, TouchableOpacity } from 'react-native'

const defaultIconSize = 24

export interface IScreenIconProps {
  onPress: () => void
  color?: string
  name: string
  size?: number
  style: TextStyle
}

const createIconButton = (IconFont: any) =>
  class IconButton extends PureComponent<IScreenIconProps> {
    static componentId = `org.brunolemos.devhub.${IconFont.name}`

    render() {
      const {
        color,
        name,
        onPress,
        size = defaultIconSize,
        style,
        ...props
      } = this.props

      return (
        <TouchableOpacity onPress={onPress} {...props}>
          <IconFont color={color} name={name} size={size} style={style} />
        </TouchableOpacity>
      )
    }
  }

export default createIconButton
