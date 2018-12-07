import { Animated, SafeAreaView } from 'react-native'

export const AnimatedSafeAreaView = Animated.createAnimatedComponent(
  SafeAreaView,
) as typeof SafeAreaView
