import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { SettingsModal } from '../../components/modals/SettingsModal'
import * as selectors from '../../redux/selectors'
import { ExtractPropsFromConnector } from '../../types'

const connectToStore = connect((state: any) => ({
  currentOpenedModal: selectors.currentOpenedModal(state),
}))

class ModalRendererComponent extends PureComponent<
  ExtractPropsFromConnector<typeof connectToStore>
> {
  render() {
    const { currentOpenedModal } = this.props

    if (!currentOpenedModal) return null

    switch (currentOpenedModal) {
      case 'SETTINGS':
        return <SettingsModal />

      default:
        return null
    }
  }
}

export const ModalRenderer = connectToStore(ModalRendererComponent)

hoistNonReactStatics(ModalRenderer, ModalRendererComponent as any)
