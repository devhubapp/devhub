import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image, ImageProps } from 'react-native'

import { Platform } from '../../libs/platform'
import { SpringAnimatedImage } from '../animated/spring/SpringAnimatedImage'

export interface ImageWithLoadingProps extends ImageProps {
  animated?: boolean
  backgroundColorFailed: string | any
  backgroundColorLoaded: string | any
  backgroundColorLoading: string | any
  onError?: ImageProps['onError']
  onLoad?: ImageProps['onLoad']
  onLoadEnd?: ImageProps['onLoadEnd']
  onLoadStart?: ImageProps['onLoadStart']
  style: any
}

export const ImageWithLoading = React.memo((props: ImageWithLoadingProps) => {
  const {
    animated,
    backgroundColorFailed,
    backgroundColorLoaded,
    backgroundColorLoading,
    onError,
    onLoad,
    onLoadEnd,
    onLoadStart,
    ...otherProps
  } = props

  const imageRef = useRef<Image>(null)
  const cacheRef = useRef({ error: false, isLoading: false })

  useEffect(() => {
    updateStyles()
  }, [])

  const handleLoad = useCallback(
    e => {
      cacheRef.current.isLoading = false
      cacheRef.current.error = false
      updateStyles()

      if (typeof onLoad === 'function') onLoad(e)
    },
    [onLoad],
  )

  const handleLoadStart = useCallback(
    () => {
      cacheRef.current.isLoading = true
      updateStyles()

      if (typeof onLoadStart === 'function') onLoadStart()
    },
    [onLoadStart],
  )

  const handleLoadEnd = useCallback(
    () => {
      cacheRef.current.isLoading = false
      updateStyles()

      if (typeof onLoadEnd === 'function') onLoadEnd()
    },
    [onLoadEnd],
  )

  const handleError = useCallback(
    e => {
      cacheRef.current.isLoading = false
      cacheRef.current.error = true
      updateStyles()

      if (typeof onError === 'function') onError(e)
    },
    [onError],
  )

  function updateStyles() {
    const { error, isLoading } = cacheRef.current

    if (imageRef.current) {
      const imageURL =
        otherProps && otherProps.source && (otherProps.source as any).uri

      imageRef.current.setNativeProps({
        style: {
          backgroundColor: error
            ? backgroundColorFailed
            : isLoading
            ? backgroundColorLoading
            : backgroundColorLoaded,
          ...(Platform.OS === 'web' &&
            !!imageURL && {
              backgroundImage: `url(${JSON.stringify(imageURL)})`,
              backgroundSize: 'cover',
            }),
        },
      })
    }
  }

  const ImageComponent = true ? SpringAnimatedImage : Image

  return (
    <ImageComponent
      {...otherProps}
      ref={imageRef}
      onError={handleError}
      onLoad={handleLoad}
      onLoadEnd={handleLoadEnd}
      onLoadStart={handleLoadStart}
    />
  )
})
