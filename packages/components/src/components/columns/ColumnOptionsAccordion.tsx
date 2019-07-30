import React, { useLayoutEffect, useRef, useState } from 'react'

import { useColumn } from '../../hooks/use-column'
import { AccordionView } from '../common/AccordionView'
import { ColumnOptions, ColumnOptionsProps } from './ColumnOptions'

export interface ColumnOptionsAccordionProps extends ColumnOptionsProps {
  isOpen?: boolean
}

export type ColumnOptionCategory = 'badge'

export const ColumnOptionsAccordion = React.memo(
  React.forwardRef<
    {
      toggle: () => void
    },
    ColumnOptionsProps
  >((props, ref) => {
    const { columnId, isOpen: _isOpen } = props

    const { column } = useColumn(columnId)

    const [isOpen, setIsOpen] = useState(_isOpen)

    const isOpenRef = useRef(isOpen)
    isOpenRef.current = isOpen

    useLayoutEffect(() => {
      if (_isOpen !== isOpenRef.current) setIsOpen(_isOpen)
    }, [_isOpen])

    React.useImperativeHandle(ref, () => ({
      toggle: () => setIsOpen(v => !v),
    }))

    if (!column) return null

    return (
      <AccordionView isOpen={isOpen}>
        <ColumnOptions {...props} />
      </AccordionView>
    )
  }),
)

ColumnOptionsAccordion.displayName = 'ColumnOptionsAccordion'
