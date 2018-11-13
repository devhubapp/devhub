import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { View } from 'react-native'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { ExtractPropsFromConnector } from '../../types'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Separator } from '../common/Separator'
import { Column, ColumnProps } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem, ColumnHeaderItemProps } from './ColumnHeaderItem'

export interface ModalColumnProps extends ColumnHeaderItemProps {
  columnId: string
  hideCloseButton?: boolean
  minWidth?: ColumnProps['minWidth']
  maxWidth?: ColumnProps['maxWidth']
}

export interface ModalColumnState {}

const connectToStore = connect(
  (state: any) => {
    const modalStack = selectors.modalStack(state)

    return {
      canGoBack: !!(modalStack && modalStack.length > 1),
    }
  },
  {
    popModal: actions.popModal,
    closeAllModals: actions.closeAllModals,
  },
)

class ModalColumnComponent extends PureComponent<
  ModalColumnProps & ExtractPropsFromConnector<typeof connectToStore>,
  ModalColumnState
> {
  handleBack = () => {
    this.props.popModal()
  }

  handleClose = () => {
    this.props.closeAllModals()
  }

  render() {
    const {
      canGoBack,
      children,
      hideCloseButton,
      maxWidth,
      minWidth,
      ...props
    } = this.props
    delete props.popModal

    return (
      <Column
        columnId={this.props.columnId}
        maxWidth={maxWidth}
        minWidth={minWidth}
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
              onPress={this.handleBack}
              style={{ paddingRight: 0 }}
            />
          )}

          <ColumnHeaderItem
            {...props}
            iconName={undefined}
            style={{ flex: 1 }}
          />

          {!hideCloseButton && (
            <ColumnHeaderItem iconName="x" onPress={this.handleClose} />
          )}
        </ColumnHeader>

        <CardItemSeparator />

        {children}
      </Column>
    )
  }
}

export const ModalColumn = connectToStore(ModalColumnComponent)

hoistNonReactStatics(ModalColumn, ModalColumnComponent as any)
