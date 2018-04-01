declare module 'react-navigation-header-buttons' {
  import { Component, ComponentType, ReactElement } from 'react'
  import { ViewStyle } from 'react-native'

  interface HeaderItemProps {
    IconElement?: ReactElement<any>
    buttonStyle?: ViewStyle
    buttonWrapperStyle?: ViewStyle
    color?: string
    iconName?: string
    iconSize?: number
    onPress?: () => void
    show?: string
    title: string
  }

  interface HeaderButtonsProps {
    IconComponent?: ComponentType<any>
    OverflowIcon?: ReactElement<any>
    cancelButtonLabel?: string
    children: ReactElement<any>
    color?: string
    iconSize?: number
    left?: boolean
    overflowButtonWrapperStyle?: ViewStyle
  }

  class HeaderButtons extends Component<HeaderButtonsProps> {
    static Item: ComponentType<HeaderItemProps>
  }

  export default HeaderButtons
}
