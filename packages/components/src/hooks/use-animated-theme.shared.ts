import { useEffect, useRef, useState } from 'react'
import { Animated, Easing } from 'react-native'

import { useReduxStore } from '../redux/context/ReduxStoreContext'
import { themeSelector } from '../redux/selectors'

export function useAnimatedTheme() {
  const store = useReduxStore()

  const themeRef = useRef(themeSelector(store.getState()))
  const animatedValueRef = useRef(new Animated.Value(0))

  const [animatedTheme, setAnimatedTheme] = useState(() => {
    const getInterpolate = (value: string) =>
      animatedValueRef.current.interpolate({
        inputRange: [0, 0],
        outputRange: [value, value],
      })

    return {
      backgroundColor: getInterpolate(themeRef.current.backgroundColor) as any,
      backgroundColorDarker08: getInterpolate(
        themeRef.current.backgroundColorDarker08,
      ) as any,
      backgroundColorDarker16: getInterpolate(
        themeRef.current.backgroundColorDarker16,
      ) as any,
      backgroundColorLess08: getInterpolate(
        themeRef.current.backgroundColorLess08,
      ) as any,
      backgroundColorLess16: getInterpolate(
        themeRef.current.backgroundColorLess16,
      ) as any,
      backgroundColorLighther08: getInterpolate(
        themeRef.current.backgroundColorLighther08,
      ) as any,
      backgroundColorLighther16: getInterpolate(
        themeRef.current.backgroundColorLighther16,
      ) as any,
      backgroundColorMore08: getInterpolate(
        themeRef.current.backgroundColorMore08,
      ) as any,
      backgroundColorMore16: getInterpolate(
        themeRef.current.backgroundColorMore16,
      ) as any,
      backgroundColorTransparent10: getInterpolate(
        themeRef.current.backgroundColorTransparent10,
      ) as any,
      foregroundColor: getInterpolate(themeRef.current.foregroundColor) as any,
      foregroundColorMuted50: getInterpolate(
        themeRef.current.foregroundColorMuted50,
      ) as any,
    }
  })

  useEffect(
    () => {
      return store.subscribe(() => {
        const newTheme = themeSelector(store.getState())
        if (newTheme === themeRef.current) return

        animatedValueRef.current.setValue(0)

        const keys = Object.keys(animatedTheme) as Array<
          keyof typeof animatedTheme
        >
        keys.forEach(key => {
          const currentValue = themeRef.current[key]
          const newValue = newTheme[key]

          animatedTheme[key] = animatedValueRef.current.interpolate({
            inputRange: [0, 1],
            outputRange: [currentValue, newValue],
          })
        })

        themeRef.current = newTheme

        Animated.timing(animatedValueRef.current, {
          easing: Easing.out(Easing.ease),
          toValue: 1,
          duration: 200,
        }).start()

        setAnimatedTheme({ ...animatedTheme })
      })
    },
    [store, animatedTheme],
  )

  return animatedTheme
}
