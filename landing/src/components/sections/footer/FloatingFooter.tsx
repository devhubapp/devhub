import classNames from 'classnames'
import React, { useState } from 'react'

import { QuickFeedbackInput } from '../../common/QuickFeedbackInput'

export interface FloatingFooterProps {}

const fixed = true
export default function FloatingFooter(_props: FloatingFooterProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <>
      <section
        className={classNames(
          fixed && 'fixed bottom-0 left-0 right-0',
          'mt-10',
          !isFocused && 'sm:pointer-events-none',
        )}
        style={{
          ...(fixed && {
            minHeight: 42,
            ...(isFocused && {
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }),
            zIndex: 100,
          }),
        }}
      >
        {!!(fixed && isFocused) && (
          <div className="absolute inset-0 bg-default opacity-75" />
        )}

        <div className="relative container py-2 overflow-x-visible">
          <div className="flex flex-row items-center justify-center sm:justify-end overflow-x-auto">
            <QuickFeedbackInput
              className={classNames(
                /* isFocused ? 'w-full' : */ 'w-full sm:w-auto',
                'text-center pointer-events-auto',
              )}
              onBlur={() => {
                setIsFocused(false)
              }}
              onFocus={() => {
                setIsFocused(true)
              }}
            />
          </div>
        </div>
      </section>

      {!!fixed && <div className="mt-10" style={{ minHeight: 42 }} />}
    </>
  )
}
