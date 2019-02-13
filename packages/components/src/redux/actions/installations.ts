import {
  FetchInstallationsOptions,
  InstallationsConnection,
} from '@devhub/core'
import { createAction, createErrorAction } from '../helpers'

export function fetchInstallationsRequest(payload: FetchInstallationsOptions) {
  return createAction('FETCH_INSTALLATIONS_REQUEST', payload)
}

export function fetchInstallationsSuccess(payload: InstallationsConnection) {
  return createAction('FETCH_INSTALLATIONS_SUCCESS', payload)
}

export function fetchInstallationsFailure<E extends Error>(
  error: E & { status?: number },
) {
  return createErrorAction('FETCH_INSTALLATIONS_FAILURE', error)
}
