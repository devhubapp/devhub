import classNames from 'classnames'
import React, { CSSProperties } from 'react'

import { aspectRatioToStyle } from '../../helpers'

export interface ResponsiveImageProps {
  alt: string
  aspectRatio: number
  containerClassName?: string
  disableHorizontalScrolling?: boolean
  enableBorder?: boolean
  imageClassName?: string
  imageStyle?: CSSProperties
  minHeight?: number
  src: string
}

export function ResponsiveImage(props: ResponsiveImageProps) {
  const {
    alt,
    aspectRatio,
    containerClassName,
    disableHorizontalScrolling,
    enableBorder,
    imageClassName,
    imageStyle,
    minHeight = 500,
    src,
  } = props

  const defaultStyle = { minHeight, minWidth: minHeight * aspectRatio }

  return (
    <div
      className={classNames(
        !disableHorizontalScrolling && 'overflow-x-auto overflow-y-hidden',
        '-ml-8 sm:ml-0 -mr-8 sm:mr-0',
        containerClassName || 'sm:w-full',
      )}
    >
      <div
        className={classNames(
          enableBorder && 'sm:p-2',
          'bg-less-1 sm:rounded-lg',
        )}
        style={defaultStyle}
      >
        <div
          className="relative w-full h-full bg-less-1 rounded-lg"
          style={aspectRatioToStyle(aspectRatio)}
        >
          <img
            alt={alt}
            src={src}
            className={classNames(
              'hidden sm:block absolute inset-0 object-cover w-full rounded',
              imageClassName,
            )}
            style={imageStyle}
          />
          <div
            className={classNames(
              'block sm:hidden absolute inset-0 bg-cover w-full h-full rounded',
              imageClassName,
            )}
            style={{
              backgroundImage: `url(${src})`,
              ...imageStyle,
            }}
          />
        </div>
      </div>
    </div>
  )
}
