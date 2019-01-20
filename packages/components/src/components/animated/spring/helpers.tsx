import React, { ReactType } from 'react'
import { animated } from 'react-spring/native-hooks'

export function createSpringAnimatedComponent<T extends ReactType<any>>(
  component: T,
) {
  const animatedComponent = animated(component)
  const AnimatedComponent = animatedComponent as any

  const name = (component as any).displayName || (component as any).name
  AnimatedComponent.displayName = `SpringAnimated${name || 'Component'}`

  return (React.forwardRef((props: any, ref) => (
    <AnimatedComponent ref={ref} {...props} />
  )) as any) as typeof animatedComponent
}
