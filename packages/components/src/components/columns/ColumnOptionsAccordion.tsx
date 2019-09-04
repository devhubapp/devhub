import React, { useLayoutEffect, useRef, useState } from 'react'

import { useColumn } from '../../hooks/use-column'
import { AccordionView } from '../common/AccordionView'
import { ColumnOptions, ColumnOptionsProps } from './ColumnOptions'

export interface ColumnOptionsAccordionProps extends ColumnOptionsProps {
  isOpen?: boolean
}

export type ColumnOptionCategory = 'badge'

export interface ColumnOptionsAccordionInstance {
  isOpened: () => boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const ColumnOptionsAccordion = React.memo(
  React.forwardRef<ColumnOptionsAccordionInstance, ColumnOptionsProps>(
    (props, ref) => {
      const { columnId, isOpen: _isOpen } = props

      const { column } = useColumn(columnId)

      const [isOpen, setIsOpen] = useState(_isOpen)

      const isOpenRef = useRef(isOpen)
      isOpenRef.current = isOpen

      useLayoutEffect(() => {
        if (_isOpen !== isOpenRef.current) setIsOpen(_isOpen)
      }, [_isOpen])

      React.useImperativeHandle(
        ref,
        () => ({
          isOpened: () => !!isOpenRef.current,
          open: () => setIsOpen(true),
          close: () => setIsOpen(true),
          toggle: () => setIsOpen(v => !v),
        }),
        [],
      )

      if (!column) return null

      return (
        <AccordionView isOpen={isOpen}>
          <ColumnOptions {...props} />
        </AccordionView>
      )
    },
  ),
)

ColumnOptionsAccordion.displayName = 'ColumnOptionsAccordion'

export type ColumnOptionsAccordion = ColumnOptionsAccordionInstance
