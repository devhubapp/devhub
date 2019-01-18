import { createSpringAnimatedComponent } from './spring/helpers'

export function createAnimatedComponent(component: any) {
  const AnimatedComponent = createSpringAnimatedComponent(component)

  const name = (component as any).displayName || (component as any).name
  AnimatedComponent.displayName = `SpringAnimated${name || 'Component'}`

  return AnimatedComponent
}
