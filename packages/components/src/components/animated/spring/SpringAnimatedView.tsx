import { View, ViewProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedView = createSpringAnimatedComponent(View)
SpringAnimatedView.displayName = 'SpringAnimatedView'

export type SpringAnimatedViewProps = ViewProps
