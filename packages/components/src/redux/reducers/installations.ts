import immer from 'immer'
import _ from 'lodash'

import {
  Installation,
  InstallationAccount,
  InstallationRepository,
  InstallationResponse,
} from '@devhub/core'
import { Reducer } from '../types'

export interface State {
  allInstallationIds: number[]
  allOwnerIds: number[]
  allRepoIds: number[]
  byInstallationId: Record<number, InstallationResponse>
  byOwnerName: Record<number, number>
  byRepoName: Record<number, number>
}

const initialState: State = {
  allInstallationIds: [],
  allOwnerIds: [],
  allRepoIds: [],
  byInstallationId: {},
  byOwnerName: {},
  byRepoName: {},
}

export const installationsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    default:
      return state
  }
}
