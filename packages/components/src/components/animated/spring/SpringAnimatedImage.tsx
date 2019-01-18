import { Image, ImageProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedImage = createSpringAnimatedComponent(Image)

export interface SpringAnimatedImageProps extends ImageProps {}
