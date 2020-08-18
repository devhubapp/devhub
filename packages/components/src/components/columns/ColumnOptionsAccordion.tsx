import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
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

let isSharedColumnOptionsOpen = false
export const ColumnOptionsAccordion = React.memo(
  React.forwardRef<ColumnOptionsAccordionInstance, ColumnOptionsAccordionProps>(
    (props, ref) => {
      const { columnId, isOpen: _isOpen } = props

      const { column } = useColumn(columnId)
      const { appViewMode } = useAppViewMode()
      const [isOpen, setIsOpen] = useState(
        _isOpen ||
          (appViewMode === 'single-column' ? isSharedColumnOptionsOpen : false),
      )

      const isOpenRef = useRef(isOpen)
      isOpenRef.current = isOpen

      const isFirstRef = useRef(true)
      useLayoutEffect(() => {
        if (isFirstRef.current) {
          isFirstRef.current = false
          return
        }

        if (_isOpen !== isOpenRef.current) setIsOpen(!!_isOpen)
      }, [_isOpen])

      React.useImperativeHandle(
        ref,
        () => ({
          isOpened: () => !!isOpenRef.current,
          open: () => setIsOpen(true),
          close: () => setIsOpen(false),
          toggle: () => setIsOpen((v) => !v),
        }),
        [],
      )

      useEffect(() => {
        isSharedColumnOptionsOpen = appViewMode === 'single-column' && isOpen
      }, [appViewMode, isOpen])

      return useMemo(() => {
        if (!column) return null

        return (
          <AccordionView isOpen={isOpen}>
            <ColumnOptions {...props} />
          </AccordionView>
        )
      }, [!!column, columnId, isOpen])
    },
  ),
)

ColumnOptionsAccordion.displayName = 'ColumnOptionsAccordion'

export type ColumnOptionsAccordion = ColumnOptionsAccordionInstance
