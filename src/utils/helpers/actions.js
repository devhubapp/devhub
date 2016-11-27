// @flow

import type { ActionType } from '../types';

/**
 * Create an action object
 *
 * Example:
 * action('LOGIN_REQUEST', { email, password })
 * produces
 * { type: 'LOGIN_REQUEST', payload: { email: '...', password: '...' } }
 */
export function action(type: ActionType, payload: any) {
  return { type, payload };
}

/**
 * Create an action error object
 *
 * Example:
 * errorAction('LOGIN_FAILURE', { message: 'No internet connection' })
 * produces
 * { type: 'LOGIN_FAILURE', error: { message: '...' } }
 */
export function errorAction(type: ActionType, error: any) {
  return { type, error };
}
