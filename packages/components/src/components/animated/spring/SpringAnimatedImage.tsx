import { Image, ImageProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedImageProps extends ImageProps {}

export const SpringAnimatedImage = createSpringAnimatedComponent(Image)
