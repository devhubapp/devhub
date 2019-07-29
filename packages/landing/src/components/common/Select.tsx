import classNames from 'classnames'
import React, { ReactElement } from 'react'

export interface SelectProps<T extends string> {
  children: Array<ReactElement<SelectOptionProps<T>>>
  onChange: (option: T) => void
  placeholder?: string
}

export interface SelectOptionProps<T extends string> {
  id: T
  children: React.ReactNode
  selected?: boolean
}

export function Select<T extends string>(props: SelectProps<T>) {
  const { children, onChange, placeholder = 'Select' } = props

  const childrenArr = React.Children.toArray(children)
  const selectedIndex = childrenArr.findIndex(
    child => child.props.selected === true,
  )

  return (
    <span className="select-container my-1 cursor-default">
      <span className="bg-more-1 border border-bg-less-2 rounded-lg shadow text-left">
        <span className="relative w-full h-full">
          <span className="selected-option w-full px-2 py-1 hover:bg-less-2 whitespace-no-wrap cursor-pointer">
            <span className="text-default">
              {childrenArr[selectedIndex] || placeholder}
            </span>
            <small className="text-default">▼</small>
          </span>

          <span
            className="options absolute"
            style={{
              top: selectedIndex >= 0 ? `-${110 * selectedIndex + 6}%` : 0,
              left: -1,
            }}
          >
            <span className="flex flex-col bg-more-1 border border-bg-less-2 rounded-lg shadow overflow-hidden">
              {React.Children.map(children, child => (
                <span
                  className="w-full px-2 py-1 hover:bg-less-2  whitespace-no-wrap cursor-pointer"
                  onClick={
                    onChange ? () => onChange(child.props.id) : undefined
                  }
                >
                  <span className="text-default">{child}</span>
                  <small
                    className={classNames(
                      'text-default',
                      !child.props.selected && 'opacity-0',
                    )}
                  >
                    ▼
                  </small>
                </span>
              ))}
            </span>
          </span>
        </span>
      </span>

      <style jsx>
        {`
          .options {
            display: none;
            height: 0;
          }

          .select-container:hover .options,
          .select-container:focus .options {
            display: flex;
            height: auto;
          }
        `}
      </style>
    </span>
  )
}

export function SelectOption<T extends string>(props: SelectOptionProps<T>) {
  return <>{props.children}</>
}

Select.Option = SelectOption
