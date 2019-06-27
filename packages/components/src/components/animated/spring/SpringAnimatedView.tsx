import { View, ViewProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedView = createSpringAnimatedComponent(View)
;(SpringAnimatedView as any).displayName = 'SpringAnimatedView'

export interface SpringAnimatedViewProps extends ViewProps {}
