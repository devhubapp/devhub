/*
import React from 'react'
import { Animated } from 'react-native'

export function createAnimatedComponent<
  T extends React.ComponentClass<any, any>
>(component: T) {
  return Animated.createAnimatedComponent(component)
}
*/

import React from 'react'
import { StyleSheet } from 'react-native'
import { animated } from 'react-spring/hooks'

export function createAnimatedComponent<
  T extends React.ComponentClass<any, any>
>(component: T) {
  const animatedComponent = animated(component)
  const AnimatedComponent = animatedComponent as any

  return (React.forwardRef((props: any, ref) => (
    <AnimatedComponent
      ref={ref}
      {...props}
      {...(typeof props.contentContainerStyle !== 'undefined'
        ? {
            contentContainerStyle: StyleSheet.flatten(
              props.contentContainerStyle,
            ),
          }
        : {})}
      style={StyleSheet.flatten(props.style)}
    />
  )) as any) as typeof animatedComponent
}
