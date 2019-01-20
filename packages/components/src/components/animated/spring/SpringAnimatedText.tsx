import { Text, TextProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedTextProps extends TextProps {}

export const SpringAnimatedText = createSpringAnimatedComponent(Text)
