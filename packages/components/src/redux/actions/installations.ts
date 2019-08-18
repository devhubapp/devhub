import { FetchInstallationsOptions, Installation } from '@devhub/core'
import { createAction, createErrorAction } from '../helpers'

export function refreshInstallationsRequest(
  payload: FetchInstallationsOptions,
) {
  return createAction('REFRESH_INSTALLATIONS_REQUEST', payload)
}

export function refreshInstallationsSuccess(payload: Installation[]) {
  return createAction('REFRESH_INSTALLATIONS_SUCCESS', payload)
}

export function refreshInstallationsFailure<E extends Error>(
  error: E & { status?: number },
) {
  return createErrorAction('REFRESH_INSTALLATIONS_FAILURE', error)
}

export function refreshInstallationsNoop() {
  return createAction('REFRESH_INSTALLATIONS_NOOP')
}
