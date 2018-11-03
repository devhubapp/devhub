import { ModalPayload } from '../../types'
import {
  createActionCreator,
  createActionCreatorCreator,
} from '../../utils/helpers/redux'

export const pushModal = createActionCreatorCreator('PUSH_MODAL')<
  ModalPayload
>()

export const replaceModal = createActionCreatorCreator('REPLACE_MODAL')<
  ModalPayload
>()

export const popModal = createActionCreator('POP_MODAL')

export const closeAllModals = createActionCreator('CLOSE_ALL_MODALS')
