import React, { useCallback, useState } from 'react'
import { Image, ImageProps } from 'react-native'

export interface ImageWithLoadingProps extends ImageProps {
  backgroundColorFailed: string
  backgroundColorLoaded: string
  backgroundColorLoading: string
  onError?: ImageProps['onError']
  onLoad?: ImageProps['onLoad']
  onLoadEnd?: ImageProps['onLoadEnd']
  onLoadStart?: ImageProps['onLoadStart']
}

export const ImageWithLoading = React.memo((props: ImageWithLoadingProps) => {
  const {
    backgroundColorFailed,
    backgroundColorLoaded,
    backgroundColorLoading,
    onError,
    onLoad,
    onLoadEnd,
    onLoadStart,
    style,
    ...otherProps
  } = props

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLoad = useCallback(
    e => {
      setLoading(false)
      setError(false)
      if (typeof onLoad === 'function') onLoad(e)
    },
    [onLoad],
  )

  const handleLoadStart = useCallback(
    () => {
      setLoading(true)
      if (typeof onLoadStart === 'function') onLoadStart()
    },
    [onLoadStart],
  )

  const handleLoadEnd = useCallback(
    () => {
      setLoading(false)
      if (typeof onLoadEnd === 'function') onLoadEnd()
    },
    [onLoadEnd],
  )

  const handleError = useCallback(
    e => {
      setLoading(false)
      setError(true)
      if (typeof onError === 'function') onError(e)
    },
    [onError],
  )

  return (
    <Image
      {...otherProps}
      onError={handleError}
      onLoad={handleLoad}
      onLoadEnd={handleLoadEnd}
      onLoadStart={handleLoadStart}
      style={[
        style,
        {
          backgroundColor: error
            ? backgroundColorFailed
            : loading
            ? backgroundColorLoading
            : backgroundColorLoaded,
        },
      ]}
    />
  )
})
