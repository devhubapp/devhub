import React from 'react'
import { InteractionManager, View } from 'react-native'
import { useSpring } from 'react-spring/native'

import { ThemeColors } from '@devhub/core'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'

export const progressBarHeight = 1

export interface ProgressBarProps {
  color?: keyof ThemeColors
  indeterminate?: boolean
  indeterminateSize?: number
  progress?: number
}

export const ProgressBar = React.memo((props: ProgressBarProps) => {
  const {
    color = 'primaryBackgroundColor',
    indeterminate: _indeterminate,
    indeterminateSize = 90,
    progress: _progress,
  } = props

  const indeterminate = !!(_indeterminate || typeof _progress !== 'number')
  const progress = indeterminate
    ? 100
    : typeof _progress === 'number'
    ? Math.min(Math.max(0, _progress), 100)
    : 0

  const theme = useTheme()

  const springAnimatedStyles = useSpring<any>({
    config: getDefaultReactSpringAnimationConfig(),
    from: {
      left: '0%',
      width: '0%',
    },
    to: async (next: any) => {
      while (1) {
        if (indeterminate) {
          await InteractionManager.runAfterInteractions()
          await next({
            immediate: true,
            left: `-${indeterminateSize}%`,
            width: `${indeterminateSize}%`,
          })
          await next({ immediate: false })

          await InteractionManager.runAfterInteractions()
          await next({
            left: '100%',
            width: `${indeterminateSize}%`,
          })

          // await InteractionManager.runAfterInteractions()
          // await next({
          //   left: `-${indeterminateSize}%`,
          //   width: `${indeterminateSize}%`,
          // })

          continue
        }

        await InteractionManager.runAfterInteractions()
        await next({ left: '0%', width: `${progress}%` })
      }
    },
  })

  return (
    <View
      style={{ width: '100%', height: progressBarHeight, overflow: 'hidden' }}
    >
      <SpringAnimatedView
        style={{
          top: 0,
          bottom: 0,
          left: springAnimatedStyles.left,
          width: springAnimatedStyles.width,
          height: progressBarHeight,
          backgroundColor: getThemeColorOrItself(theme, color, {
            enableCSSVariable: false,
          }),
        }}
      />
    </View>
  )
})

ProgressBar.displayName = 'ProgressBar'
