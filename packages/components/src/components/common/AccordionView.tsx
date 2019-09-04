import React, { useCallback, useRef, useState } from 'react'
import { LayoutChangeEvent, ScrollView, View } from 'react-native'
import { useSpring } from 'react-spring/native'

import { constants } from '@devhub/core'
import { usePrevious } from '../../hooks/use-previous'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'

export interface AccordionViewProps {
  // animation?: 'height' | 'slideRight'
  children: React.ReactNode
  isOpen?: boolean
}

export interface AccordionView {}

export const AccordionView = React.memo((props: AccordionViewProps) => {
  const { children, isOpen } = props

  const hasCompletedAnimationRef = useRef(false)

  const wasOpen = usePrevious(isOpen)
  const [size, setSize] = useState<number | 'auto'>(isOpen ? 'auto' : 0)

  const immediate = constants.DISABLE_ANIMATIONS
  const animatedStyles = useSpring<any>({
    immediate,
    config: getDefaultReactSpringAnimationConfig({ precision: 1 }),
    from: { height: 0 },
    to: { height: isOpen ? size : 0 },
    // onStart: () => {
    //   hasCompletedAnimationRef.current = false
    // },
    onRest: () => {
      hasCompletedAnimationRef.current = !!isOpen
    },
  })

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      if (size !== height && height > 0) setSize(height)
    },
    [size],
  )

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    handleContentSizeChange(width, height)
  }, [])

  return (
    <SpringAnimatedView
      style={[
        sharedStyles.overflowHidden,
        {
          height:
            isOpen && wasOpen === isOpen && hasCompletedAnimationRef.current
              ? 'auto'
              : animatedStyles.height.to(value =>
                  value === 'auto' ? value : value > 0 ? Math.floor(value) : 0,
                ),
          opacity: animatedStyles.height.to(value =>
            value === 'auto' || value > 0 ? 1 : 0,
          ),

          // [web] disable keyboard focus for this tree when accordion is collapsed
          ['visibility' as any]: animatedStyles.height.to(value =>
            value === 'auto' || value > 0 ? 'visible' : 'hidden',
          ),
          ['willChange' as any]: 'height',
        },
      ]}
    >
      {Platform.OS === 'web' ? (
        <View onLayout={onLayout}>{children}</View>
      ) : (
        <ScrollView
          bounces={false}
          onContentSizeChange={handleContentSizeChange}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )}
    </SpringAnimatedView>
  )
})

AccordionView.displayName = 'AccordionView'
