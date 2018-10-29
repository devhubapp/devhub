import { Modal } from '../../types'
import {
  createActionCreator,
  createActionCreatorCreator,
} from '../../utils/helpers/redux'

export const pushModal = createActionCreatorCreator('PUSH_MODAL')<Modal>()

export const replaceModal = createActionCreatorCreator('REPLACE_MODAL')<Modal>()

export const popModal = createActionCreator('POP_MODAL')

export const closeAllModals = createActionCreator('CLOSE_ALL_MODALS')
