import React, { ReactType } from 'react'
import { StyleSheet } from 'react-native'
import { animated } from 'react-spring/hooks'

// TODO: Simplify all this after react-spring fix array support
// @see https://github.com/react-spring/react-spring/issues/439

function flattenStyleProps(props: any) {
  const newProps = { ...props }

  const keys = Object.keys(newProps)

  keys.forEach(key => {
    if (!(key === 'style' || key.endsWith('Style'))) return

    if (typeof newProps[key] === 'undefined') return
    newProps[key] = StyleSheet.flatten(newProps[key])
  })

  return newProps
}

export function createSpringAnimatedComponent<T extends ReactType<any>>(
  component: T,
) {
  const animatedComponent = animated(component)
  const AnimatedComponent = animatedComponent as any

  const name = (component as any).displayName || (component as any).name
  AnimatedComponent.displayName = `SpringAnimated${name || 'Component'}`

  return (React.forwardRef((props: any, ref) => (
    <AnimatedComponent ref={ref} {...flattenStyleProps(props)} />
  )) as any) as typeof animatedComponent
}
