import classNames from 'classnames'
import React, { ReactElement } from 'react'

export interface TabsProps<TabId extends string> {
  className?: string
  children: Array<ReactElement<TabProps<TabId>>>
  onTabChange: (id: TabId) => void
}

export function Tabs<TabId extends string>(props: TabsProps<TabId>) {
  const { children, className, onTabChange } = props

  return (
    <div className="flex flex-row items-center justify-center">
      <div
        className={classNames(
          'flex flex-row self-center mx-auto bg-less-1 rounded-full',
          className,
        )}
      >
        {React.Children.map(children, child => (
          <div
            className="cursor-pointer"
            onClick={() => onTabChange(child.props.id)}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export interface TabProps<TabId extends string> {
  active?: boolean
  id: TabId
  title: React.ReactNode
}

Tabs.Tab = function Tab<TabId extends string>(props: TabProps<TabId>) {
  const { active, title } = props

  return (
    <div
      className={classNames(
        'flex flex-col m-1 py-1 px-6 text-default text-center rounded-full',
        active && 'bg-lighther-2 font-bold',
      )}
    >
      <span className="truncate">{title}</span>
      <span
        className="font-bold truncate invisible pointer-events-none"
        style={{ marginTop: '-1.5rem' }}
      >
        {title}
      </span>
    </div>
  )
}
