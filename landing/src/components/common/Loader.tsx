/** Source: https://loading.io/css/ */

import classNames from 'classnames'
import React from 'react'

export interface LoaderProps {
  className?: string
  size?: number
  style?: React.CSSProperties
}

export function Loader(props: LoaderProps) {
  const { className, size = 20, style } = props

  return (
    <div
      className={classNames('lds-ring', className)}
      style={{ width: size, height: size, ...style }}
    >
      <div />
      <div />
      <div />
      <div />

      <style jsx>{`
        .lds-ring {
          display: inline-block;
          position: relative;
          width: ${Math.round(size)}px;
          height: ${Math.round(size)}px;
        }

        .lds-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: ${Math.round(size * 0.8)}px;
          height: ${Math.round(size * 0.8)}px;
          margin: ${Math.round(size * 0.1)}px;
          border: ${Math.round(size * 0.1)}px solid currentColor;
          border-radius: 50%;
          animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: currentColor transparent transparent transparent;
        }

        .lds-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }

        .lds-ring div:nth-child(2) {
          animation-delay: -0.3s;
        }

        .lds-ring div:nth-child(3) {
          animation-delay: -0.15s;
        }

        @keyframes lds-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
