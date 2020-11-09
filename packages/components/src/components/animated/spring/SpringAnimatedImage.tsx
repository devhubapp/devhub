import { Image, ImageProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export type SpringAnimatedImageProps = ImageProps

export const SpringAnimatedImage = createSpringAnimatedComponent(Image)
SpringAnimatedImage.displayName = 'SpringAnimatedImage'
