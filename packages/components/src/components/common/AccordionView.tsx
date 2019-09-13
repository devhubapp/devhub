import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AppState,
  InteractionManager,
  LayoutChangeEvent,
  ScrollView,
  View,
} from 'react-native'
import { useTransition } from 'react-spring/native'

import { constants } from '@devhub/core'
import { usePrevious } from '../../hooks/use-previous'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'

export interface AccordionViewProps {
  children: React.ReactNode
  isOpen?: boolean
}

export interface AccordionView {}

export const AccordionView = React.memo((props: AccordionViewProps) => {
  const { children, isOpen } = props

  const hasCompletedAnimationRef = useRef(false)
  const wasOpen = usePrevious(isOpen)
  const [size, setSize] = useState<number | 'auto'>(isOpen ? 'auto' : 0)
  const [isRenderEnabled, setIsRenderEnabled] = useState(isOpen)

  const immediate = constants.DISABLE_ANIMATIONS
  const transitions = useTransition(
    isOpen ? [true] : [],
    isOpen ? ['accordion-view'] : [],
    {
      immediate,
      config: getDefaultReactSpringAnimationConfig({ precision: 1 }),

      from: { height: 0 },
      enter: { height: isOpen ? size : 0 },
      leave: { height: 0 },
      update: { height: isOpen ? size : 0 },
      // onStart: () => {
      //   hasCompletedAnimationRef.current = false
      // },
      onRest: () => {
        hasCompletedAnimationRef.current = !!isOpen
      },
    },
  )

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

  useEffect(() => {
    if (isRenderEnabled) return
    if (AppState.currentState === 'active') {
      InteractionManager.runAfterInteractions(() => {
        setIsRenderEnabled(true)
      })
    } else {
      setIsRenderEnabled(true)
    }
  }, [isRenderEnabled])

  const Content = useMemo(
    () =>
      Platform.OS === 'web' ? (
        <View onLayout={onLayout}>{!!isRenderEnabled && children}</View>
      ) : (
        <ScrollView
          bounces={false}
          onContentSizeChange={handleContentSizeChange}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {!!isRenderEnabled && children}
        </ScrollView>
      ),
    [onLayout, isRenderEnabled, children, handleContentSizeChange],
  )

  return (
    <>
      {transitions.map(
        transition =>
          !!(transition && transition.item && transition.props) && (
            <SpringAnimatedView
              hidden={(transition.props.height.to as any)(
                (value: 'auto' | number) =>
                  (value === 'auto' || value > 0 ? false : true) as any,
              )}
              style={[
                sharedStyles.overflowHidden,
                {
                  height:
                    isOpen &&
                    wasOpen === isOpen &&
                    hasCompletedAnimationRef.current
                      ? 'auto'
                      : (transition.props.height.to as any)(
                          (value: 'auto' | number) =>
                            value === 'auto'
                              ? value
                              : value > 0
                              ? Math.floor(value)
                              : 0,
                        ),
                  opacity: (transition.props.height.to as any)(
                    (value: 'auto' | number) =>
                      value === 'auto' || value > 0 ? 1 : 0,
                  ),

                  // [web] disable keyboard focus for this tree when accordion is collapsed
                  ['visibility' as any]: (transition.props.height.to as any)(
                    (value: 'auto' | number) =>
                      value === 'auto' || value > 0 ? 'visible' : 'hidden',
                  ),
                  ['willChange' as any]: 'height',
                },
              ]}
            >
              {Content}
            </SpringAnimatedView>
          ),
      )}
    </>
  )
})

AccordionView.displayName = 'AccordionView'
