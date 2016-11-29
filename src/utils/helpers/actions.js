// @flow

import type { Action, ActionType } from '../types';

/**
 * Create an action object
 *
 * Example:
 * action('SET_THEME', 'dark')
 * produces
 * { type: 'SET_THEME', payload: 'dark' }
 */
export function action<T>(type: ActionType, payload: T): Action<T> {
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
