// @flow
/* eslint-disable import/prefer-default-export */

import {
  APP_CLEANUP,
  APP_READY,
  CREATE_COLUMN,
  DELETE_COLUMN,
  FIREBASE_RECEIVED_EVENT,
  RESET_APP_DATA,
  RESET_APP_DATA_REQUEST,
  SET_THEME,
  STAR_REPO,
  UNSTAR_REPO,
} from '../utils/constants/actions'

import { action } from '../utils/helpers/actions'

import type { Column, Theme } from '../utils/types'

export * from './auth'
export * from './events'
export * from './notifications'
export * from './subscriptions'

export const cleanupApp = (other?: Object) =>
  action(APP_CLEANUP, undefined, other)

export const appReady = (other?: Object) => action(APP_READY, undefined, other)

export const resetAppData = (other?: Object) =>
  action(RESET_APP_DATA, undefined, other)

export const resetAppDataRequest = (other?: Object) =>
  action(RESET_APP_DATA_REQUEST, undefined, other)

// COLUMN
type CreateColumnParams = { title: string, subscriptionIds: Array<string> }
export const createColumn = (
  { order, subscriptionIds, title }: CreateColumnParams,
  other?: Object,
) => action(CREATE_COLUMN, ({ order, subscriptionIds, title }: Column), other)

export const deleteColumn = (id: string, other?: Object) =>
  action(DELETE_COLUMN, ({ id }: Column), other)

// THEME

export const setTheme = (theme: Theme, other?: Object) =>
  action(SET_THEME, theme, other)

// STAR

export const starRepo = ({ repoId, repoFullName }, other?: Object) =>
  action(STAR_REPO, { repoId: `${repoId}`, repoFullName }, other)

export const unstarRepo = ({ repoId, repoFullName }, other?: Object) =>
  action(UNSTAR_REPO, { repoId: `${repoId}`, repoFullName }, other)

// FIREBASE

export const firebaseReceivedEvent = (
  { eventName, firebasePathArr, statePathArr, value },
  other?: Object,
) =>
  action(
    FIREBASE_RECEIVED_EVENT,
    { eventName, firebasePathArr, statePathArr, value },
    other,
  )
