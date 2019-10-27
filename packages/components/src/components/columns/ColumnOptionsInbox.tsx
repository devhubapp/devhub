import React from 'react'

import { Checkbox, CheckboxProps } from '../common/Checkbox'
import { columnHeaderItemContentSize } from './ColumnHeader'
import { ColumnOptionsRow, ColumnOptionsRowProps } from './ColumnOptionsRow'
import { sharedColumnOptionsStyles } from './options/shared'

export interface ColumnOptionsInboxProps
  extends ColumnOptionsInboxContentProps {
  containerStyle?: ColumnOptionsRowProps['containerStyle']
  contentContainerStyle?: ColumnOptionsRowProps['contentContainerStyle']
  enableBackgroundHover: ColumnOptionsRowProps['enableBackgroundHover']
  isOpen: boolean
  onToggleRowVisibility?: (() => void) | undefined
  right?: ColumnOptionsRowProps['right']
}

export function ColumnOptionsInbox(props: ColumnOptionsInboxProps) {
  const {
    containerStyle,
    contentContainerStyle,
    enableBackgroundHover,
    getCheckboxPropsFor,
    inbox,
    isOpen,
    onChange,
    onToggleRowVisibility,
    right,
  } = props

  return (
    <ColumnOptionsRow
      analyticsLabel="inbox"
      containerStyle={containerStyle}
      contentContainerStyle={contentContainerStyle}
      enableBackgroundHover={enableBackgroundHover}
      hasChanged={false}
      headerItemFixedIconSize={columnHeaderItemContentSize}
      icon={{ family: 'octicon', name: 'inbox' }}
      isOpen={isOpen}
      onToggle={onToggleRowVisibility}
      right={right}
      title="Inbox"
    >
      <ColumnOptionsInboxContent
        getCheckboxPropsFor={getCheckboxPropsFor}
        inbox={inbox}
        onChange={onChange}
      />
    </ColumnOptionsRow>
  )
}

export interface ColumnOptionsInboxContentProps {
  getCheckboxPropsFor?: (
    inbox: 'all' | 'participating',
  ) => Partial<CheckboxProps>
  inbox: 'all' | 'participating'
  onChange: (inbox: 'all' | 'participating') => void
}

export function ColumnOptionsInboxContent(
  props: ColumnOptionsInboxContentProps,
) {
  const { getCheckboxPropsFor, inbox, onChange } = props

  return (
    <>
      <Checkbox
        analyticsLabel="all_notifications"
        checked={inbox === 'all'}
        circle
        containerStyle={sharedColumnOptionsStyles.fullWidthCheckboxContainer}
        defaultValue={false}
        label="All"
        squareContainerStyle={sharedColumnOptionsStyles.checkboxSquareContainer}
        onChange={() => {
          onChange('all')
        }}
        {...(getCheckboxPropsFor && getCheckboxPropsFor('all'))}
      />

      <Checkbox
        analyticsLabel="participating_notifications"
        checked={inbox === 'participating'}
        circle
        containerStyle={sharedColumnOptionsStyles.fullWidthCheckboxContainer}
        defaultValue={false}
        label="Participating"
        squareContainerStyle={sharedColumnOptionsStyles.checkboxSquareContainer}
        onChange={() => {
          onChange('participating')
        }}
        {...(getCheckboxPropsFor && getCheckboxPropsFor('participating'))}
      />
    </>
  )
}
