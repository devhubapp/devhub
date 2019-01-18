import { StatusBar, StatusBarProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedStatusBar = createSpringAnimatedComponent(StatusBar)

export interface SpringAnimatedStatusBarProps extends StatusBarProps {}
