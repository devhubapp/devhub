import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { Spacer } from '../../components/common/Spacer'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { ExtractPropsFromConnector } from '../../types'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem, ColumnHeaderItemProps } from './ColumnHeaderItem'

export interface ModalColumnProps extends ColumnHeaderItemProps {}

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
    const { children, canGoBack, ...props } = this.props
    delete props.popModal

    return (
      <Column>
        <ColumnHeader>
          {canGoBack && (
            <ColumnHeaderItem
              iconName="chevron-left"
              onPress={this.handleBack}
            />
          )}

          <ColumnHeaderItem {...props} />

          <Spacer flex={1} />

          <ColumnHeaderItem iconName="x" onPress={this.handleClose} />
        </ColumnHeader>

        <CardItemSeparator />

        {children}
      </Column>
    )
  }
}

export const ModalColumn = connectToStore(ModalColumnComponent)

hoistNonReactStatics(ModalColumn, ModalColumnComponent as any)
