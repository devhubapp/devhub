import { TextInput, TextInputProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedTextInput = createSpringAnimatedComponent(TextInput)

export interface SpringAnimatedTextInputProps extends TextInputProps {}
