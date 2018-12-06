import { Animated, TextInput, TextInputProps } from 'react-native'

export type AnimatedTextInputProps = TextInputProps

export const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)
