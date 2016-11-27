// @flow

import type { ActionType } from '../types';

/**
 * Create the action object
 *
 * Example:
 * action('LOGIN_REQUEST', { email, password })
 * produces
 * { type: 'LOGIN_REQUEST', payload: { email: '...', password: '...' } }
 */
export function action(type: ActionType, payload: any) {
  return { type, payload };
}
