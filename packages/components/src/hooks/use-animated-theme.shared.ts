import _ from 'lodash'
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
      backgroundColor: getInterpolate(themeRef.current.backgroundColor),
      backgroundColorDarker08: getInterpolate(
        themeRef.current.backgroundColorDarker08,
      ),
      backgroundColorLess08: getInterpolate(
        themeRef.current.backgroundColorLess08,
      ),
      backgroundColorLighther08: getInterpolate(
        themeRef.current.backgroundColorLighther08,
      ),
      backgroundColorMore08: getInterpolate(
        themeRef.current.backgroundColorMore08,
      ),
      backgroundColorTransparent10: getInterpolate(
        themeRef.current.backgroundColorTransparent10,
      ),
      foregroundColor: getInterpolate(themeRef.current.foregroundColor),
      foregroundColorMuted50: getInterpolate(
        themeRef.current.foregroundColorMuted50,
      ),
      foregroundColorTransparent50: getInterpolate(
        themeRef.current.foregroundColorTransparent50,
      ),
      foregroundColorTransparent80: getInterpolate(
        themeRef.current.foregroundColorTransparent80,
      ),
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
