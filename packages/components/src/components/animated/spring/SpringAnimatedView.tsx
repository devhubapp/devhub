import { View, ViewProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedView = createSpringAnimatedComponent(View)

export interface SpringAnimatedViewProps extends ViewProps {}
