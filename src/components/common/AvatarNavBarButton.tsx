import React, { PureComponent } from 'react'
import { TextStyle, TouchableOpacity } from 'react-native'

import Avatar from './Avatar';

const defaultIconSize = 24

export interface IScreenIconProps {
  onPress: () => void
  color?: string
  username: string
  size?: number
  style: TextStyle
}

export default class AvatarNavBarButton extends PureComponent<IScreenIconProps> {
  static componentId = 'org.brunolemos.devhub.AvatarNavBarButton'

  render() {
    const { onPress, username, size = defaultIconSize, style, ...props } = this.props

    return (
      <TouchableOpacity onPress={onPress} {...props}>
        <Avatar username={username} size={size} style={style} />
      </TouchableOpacity>
    )
  }
}
