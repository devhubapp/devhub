import { TextInput, TextInputProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedTextInputProps extends TextInputProps {}

export const SpringAnimatedTextInput = createSpringAnimatedComponent(TextInput)
