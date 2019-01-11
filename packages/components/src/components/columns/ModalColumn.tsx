import React from 'react'

import { Omit } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { Spacer } from '../common/Spacer'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem, ColumnHeaderItemProps } from './ColumnHeaderItem'

export interface ModalColumnProps
  extends Omit<ColumnHeaderItemProps, 'analyticsAction' | 'analyticsLabel'> {
  columnId: string
  hideCloseButton?: boolean
  right?: React.ReactNode
  showBackButton: boolean
}

export const ModalColumn = React.memo((props: ModalColumnProps) => {
  const popModal = useReduxAction(actions.popModal)
  const closeAllModals = useReduxAction(actions.closeAllModals)

  const {
    children,
    columnId,
    hideCloseButton,
    right,
    showBackButton,
    ...otherProps
  } = props

  return (
    <Column columnId={columnId} style={{ zIndex: 900 }}>
      <ColumnHeader>
        {!!showBackButton && (
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
          style={[showBackButton && { padding: 0 }]}
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
          <ColumnHeaderItem
            analyticsLabel={undefined}
            noPadding
            style={{
              paddingHorizontal: contentPadding / 2,
            }}
          >
            {right}
          </ColumnHeaderItem>
        )}
      </ColumnHeader>

      {children}
    </Column>
  )
})
