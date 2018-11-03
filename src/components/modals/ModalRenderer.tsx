import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { SettingsModal } from '../../components/modals/SettingsModal'
import * as selectors from '../../redux/selectors'
import { ExtractPropsFromConnector } from '../../types'
import { AddColumnDetailsModal } from './AddColumnDetailsModal'
import { AddColumnModal } from './AddColumnModal'

const connectToStore = connect((state: any) => ({
  currentOpenedModal: selectors.currentOpenedModal(state),
}))

class ModalRendererComponent extends PureComponent<
  ExtractPropsFromConnector<typeof connectToStore>
> {
  render() {
    const { currentOpenedModal } = this.props

    if (!currentOpenedModal) return null

    switch (currentOpenedModal.name) {
      case 'ADD_COLUMN':
        return <AddColumnModal />

      case 'ADD_COLUMN_DETAILS':
        return <AddColumnDetailsModal {...currentOpenedModal.params} />

      case 'SETTINGS':
        return <SettingsModal />

      default:
        return null
    }
  }
}

export const ModalRenderer = connectToStore(ModalRendererComponent)

hoistNonReactStatics(ModalRenderer, ModalRendererComponent as any)
