import classNames from 'classnames'
import React, { useState } from 'react'

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function TextInput(props: TextInputProps) {
  const {} = props

  const [isFocused, setIsFocused] = useState(false)

  return (
    <input
      {...props}
      className={classNames(
        'bg-more-3 py-2 px-10 text-default placeholder-text-muted-65 border rounded-full overflow-hidden outline-none',
        isFocused ? ' shadow-md border-primary' : ' border-bg-less-3 shadow',
        props.className,
      )}
      onBlur={e => {
        setIsFocused(false)
        if (props.onBlur) props.onBlur(e)
      }}
      onFocus={e => {
        setIsFocused(true)
        if (props.onFocus) props.onFocus(e)
      }}
    />
  )
}
