import React from 'react'

import { Omit } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { Spacer } from '../common/Spacer'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem, ColumnHeaderItemProps } from './ColumnHeaderItem'

export interface ModalColumnProps
  extends Omit<ColumnHeaderItemProps, 'analyticsAction' | 'analyticsLabel'> {
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
            analyticsLabel="modal"
            analyticsAction="back"
            iconName="chevron-left"
            onPress={() => popModal()}
          />
        )}

        <ColumnHeaderItem
          analyticsLabel={undefined}
          {...otherProps}
          iconName={undefined}
          style={[canGoBack && { padding: 0 }]}
        />

        <Spacer flex={1} />

        {!hideCloseButton && (
          <ColumnHeaderItem
            analyticsAction="close"
            analyticsLabel="modal"
            iconName="x"
            onPress={() => closeAllModals()}
          />
        )}

        {right && (
          <ColumnHeaderItem analyticsLabel={undefined} noPadding>
            {right}
          </ColumnHeaderItem>
        )}
      </ColumnHeader>

      {children}
    </Column>
  )
})
