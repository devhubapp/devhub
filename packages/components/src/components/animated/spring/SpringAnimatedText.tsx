import { Text, TextProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedText = createSpringAnimatedComponent(Text)

export interface SpringAnimatedTextProps extends TextProps {}
