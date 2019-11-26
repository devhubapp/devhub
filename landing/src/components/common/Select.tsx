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
      <span className="bg-default border border-bg-less-2 rounded-lg shadow text-left">
        <span className="relative w-full h-full">
          <span
            className={classNames(
              'selected-option w-full px-2 py-1 whitespace-no-wrap',
              childrenArr.length > 1 && 'hover:bg-less-2 cursor-pointer',
            )}
          >
            <span className="text-default">
              {childrenArr[selectedIndex] || placeholder}
            </span>
            {childrenArr.length > 1 && (
              <small className="text-default" style={{ fontSize: '75%' }}>
                {` ▼`}
              </small>
            )}
          </span>

          {childrenArr.length > 1 && (
            <span
              className="options absolute"
              style={{
                top: selectedIndex >= 0 ? `-${110 * selectedIndex + 6}%` : 0,
                left: -1,
                zIndex: 1000,
              }}
            >
              <span className="flex flex-col bg-default border border-bg-less-2 rounded-lg shadow overflow-hidden">
                {React.Children.map(children, child => (
                  <span
                    className={classNames(
                      'w-full px-2 py-1 whitespace-no-wrap',
                      childrenArr.length > 1 &&
                        'hover:bg-less-2 cursor-pointer',
                    )}
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
                      style={{ fontSize: '75%' }}
                    >
                      {` ▼`}
                    </small>
                  </span>
                ))}
              </span>
            </span>
          )}
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
