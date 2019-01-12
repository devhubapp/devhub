export * from 'react-native'

declare module 'react-native' {
  export namespace Animated {
    export type AnimatedComponent<
      T extends React.ComponentClass
    > = (T extends React.ComponentClass<infer P>
      ? React.ComponentClass<P>
      : React.ComponentClass) & {
      getNode(): InstanceType<T>
    }

    export function createAnimatedComponent<
      T extends React.ComponentClass<any, any>
    >(component: T): AnimatedComponent<T>

    export const View: AnimatedComponent<typeof View>
    export const Image: AnimatedComponent<typeof Image>
    export const Text: AnimatedComponent<typeof Text>
    export const ScrollView: AnimatedComponent<typeof ScrollView>
  }
}
