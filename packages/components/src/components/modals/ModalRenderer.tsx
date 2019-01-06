import React from 'react'

import { SettingsModal } from '../../components/modals/SettingsModal'
import { useReduxState } from '../../hooks/use-redux-state'
import { analytics } from '../../libs/analytics'
import * as selectors from '../../redux/selectors'
import { AddColumnDetailsModal } from './AddColumnDetailsModal'
import { AddColumnModal } from './AddColumnModal'
import { EnterpriseSetupModal } from './EnterpriseSetupModal'

export function ModalRenderer() {
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  if (!currentOpenedModal) return null

  analytics.trackModalView(currentOpenedModal.name)

  switch (currentOpenedModal.name) {
    case 'ADD_COLUMN':
      return <AddColumnModal />

    case 'ADD_COLUMN_DETAILS':
      return <AddColumnDetailsModal {...currentOpenedModal.params} />

    case 'SETTINGS':
      return <SettingsModal />

    case 'SETUP_GITHUB_ENTERPRISE':
      return <EnterpriseSetupModal />

    default:
      return null
  }
}
