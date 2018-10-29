import {
  createActionCreator,
  createActionCreatorCreator,
} from '../../utils/helpers/redux'

type MODAL = 'SETTINGS'

export const showModal = createActionCreatorCreator('SHOW_MODAL')<MODAL>()

export const popModal = createActionCreator('POP_MODAL')
