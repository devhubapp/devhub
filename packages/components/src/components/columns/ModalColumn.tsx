import React from 'react'

import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem, ColumnHeaderItemProps } from './ColumnHeaderItem'

export interface ModalColumnProps extends ColumnHeaderItemProps {
  columnId: string
  hideCloseButton?: boolean
  right?: React.ReactNode
}

export const ModalColumn = React.memo((props: ModalColumnProps) => {
  const modalStack = useReduxState(selectors.modalStack)
  const popModal = useReduxAction(actions.popModal)
  const closeAllModals = useReduxAction(actions.closeAllModals)

  const canGoBack = !!(modalStack && modalStack.length > 1)

  const { children, hideCloseButton, right, columnId, ...otherProps } = props

  return (
    <Column
      columnId={columnId}
      style={[
        {
          zIndex: 100,
        },
      ]}
    >
      <ColumnHeader>
        {canGoBack && (
          <ColumnHeaderItem
            iconName="chevron-left"
            onPress={() => popModal()}
          />
        )}

        <ColumnHeaderItem
          {...otherProps}
          iconName={undefined}
          style={[{ flex: 1 }, canGoBack && { padding: 0 }]}
        />

        {!hideCloseButton && (
          <ColumnHeaderItem iconName="x" onPress={() => closeAllModals()} />
        )}

        {right && <ColumnHeaderItem>{right}</ColumnHeaderItem>}
      </ColumnHeader>

      {children}
    </Column>
  )
})
