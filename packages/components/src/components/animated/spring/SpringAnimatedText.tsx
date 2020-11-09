import { Text, TextProps } from '../../common/Text'
import { createSpringAnimatedComponent } from './helpers'

export type SpringAnimatedTextProps = TextProps

export const SpringAnimatedText = createSpringAnimatedComponent(Text)
SpringAnimatedText.displayName = 'SpringAnimatedText'

export type SpringAnimatedText = typeof SpringAnimatedText
