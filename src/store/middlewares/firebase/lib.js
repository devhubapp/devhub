// @flow

import _ from 'lodash'
import moment from 'moment'

import {
  fixFirebaseKey,
  fixFirebaseKeysFromObject,
  getObjectFilteredByMap,
  getRelativePathFromRef,
  getMapAnalysis,
} from './helpers'

import { forEach, get, isObjectOrMap } from '../../../utils/immutable'

export const firebaseCharMap = { '/': '__STRIPE__' }
export const firebaseInvertedCharMap = _.invert(firebaseCharMap)

export function createFirebaseHandler({
  blacklist,
  callback,
  debug = __DEV__,
  eventName,
  ignoreFn,
  map,
  rootDatabaseRef,
}) {
  const counterMap = {}

  return snapshot => {
    const fullPath = getRelativePathFromRef(snapshot.ref, rootDatabaseRef)
    let value = snapshot.val()
    let blacklisted = false
    let ignore = false

    counterMap[fullPath] = (counterMap[fullPath] || 0) + 1

    if (eventName === 'value' && isObjectOrMap(value)) {
      value = getObjectFilteredByMap(value, map)
    } else {
      blacklisted =
        blacklist && blacklist.length && blacklist.includes(snapshot.key)
    }

    if (ignoreFn && ignoreFn({ count: counterMap[fullPath], eventName }))
      ignore = true

    if (debug) {
      const action = blacklisted
        ? 'Blacklisted'
        : ignore ? 'Ignored' : 'Received'

      console.debug(
        `[FIREBASE] ${action} ${eventName} on ${fullPath || '/'}:`,
        value,
      )
    }

    if (blacklisted || ignore) {
      return
    }

    const firebasePathArr = fullPath.split('/').filter(Boolean)
    const statePathArr = firebasePathArr.map(path =>
      fixFirebaseKey(path, false),
    )
    value = fixFirebaseKeysFromObject(value, false)

    if (typeof callback === 'function') {
      callback({
        eventName,
        firebasePathArr,
        statePathArr,
        value,
      })
    }
  }
}

export const addFirebaseListener = ({
  blacklist,
  callback,
  debug = __DEV__,
  eventName,
  ignoreFn,
  map,
  once,
  ref,
  rootDatabaseRef,
  ...rest
}) => {
  const fullPath = getRelativePathFromRef(ref, rootDatabaseRef)
  let message = `[FIREBASE] Watching ${fullPath || '/'} ${eventName}${once ? ' once' : ''}`

  if (blacklist && blacklist.length) {
    message = `${message}, except ${blacklist.join(', ')}`
  }

  if (debug && !rest.isRecursiveCall) console.debug(message)

  if (eventName === 'children' || Array.isArray(eventName)) {
    const eventNames = Array.isArray(eventName)
      ? eventName
      : ['child_added', 'child_changed', 'child_removed']

    eventNames.forEach(realEventName => {
      addFirebaseListener({
        ...rest,
        blacklist,
        callback,
        debug,
        eventName: realEventName,
        ignoreFn,
        map,
        once,
        ref,
        rootDatabaseRef,
        isRecursiveCall: true,
      })
    })

    return
  }

  if (once) {
    ref.once(
      eventName,
      createFirebaseHandler({
        blacklist,
        callback,
        debug,
        eventName,
        ignoreFn,
        map,
        once,
        rootDatabaseRef,
      }),
    )
  } else {
    ref.on(
      eventName,
      createFirebaseHandler({
        blacklist,
        callback,
        debug,
        eventName,
        ignoreFn,
        map,
        once,
        rootDatabaseRef,
      }),
    )
  }
}

export function watchFirebaseFromMap({
  callback,
  debug = __DEV__,
  ignoreFn,
  map,
  once,
  rootDatabaseRef,
  ref = rootDatabaseRef,
  ...rest
}) {
  const mapAnalysis = getMapAnalysis(map)
  if (!mapAnalysis) return

  const { blacklist, count, hasAsterisk, objects, whitelist } = mapAnalysis

  objects.forEach(field => {
    watchFirebaseFromMap({
      ...rest,
      callback,
      debug,
      ignoreFn,
      map: get(map, field),
      once,
      ref: ref.child(field),
      rootDatabaseRef,
    })
  })

  if (count === 0 || (hasAsterisk && count === 1)) {
    // passed an empty object, so listen to it's children
    addFirebaseListener({
      ...rest,
      callback,
      debug,
      eventName: 'children',
      ignoreFn,
      map,
      once,
      ref,
      rootDatabaseRef,
    })
  } else if (blacklist.length) {
    // listen to all children, except the ones specified
    addFirebaseListener({
      ...rest,
      blacklist,
      callback,
      debug,
      eventName: 'children',
      ignoreFn,
      map,
      once,
      ref,
      rootDatabaseRef,
    })
  } else if (whitelist.length) {
    // listen only to the specified children
    whitelist.forEach(field =>
      addFirebaseListener({
        ...rest,
        callback,
        debug,
        eventName: 'value',
        ignoreFn,
        map,
        once,
        ref: ref.child(field),
        rootDatabaseRef,
      }),
    )
  }
}

export const applyPatchOnFirebase = ({
  debug = __DEV__,
  depth = -1,
  patch,
  rootDatabaseRef,
  ref = rootDatabaseRef,
  ...rest
}) => {
  if (!(ref && patch && isObjectOrMap(patch))) return

  const currentDepth = Number(rest.currentDepth) || 1
  const maxDepth = Number(depth) > 0 ? depth : -1

  forEach(patch, (value, field) => {
    const fixedPath = fixFirebaseKey(field, true)

    if (isObjectOrMap(value) && (currentDepth < maxDepth || maxDepth === -1)) {
      applyPatchOnFirebase({
        ...rest,
        debug,
        patch: value,
        ref: ref.child(fixedPath),
        rootDatabaseRef,
        currentDepth: currentDepth + 1,
      })

      return
    }

    if (debug) {
      const fullPath = `${getRelativePathFromRef(ref, rootDatabaseRef)}/${field}`
      console.debug(`[FIREBASE] Patching on ${fullPath || '/'}`, value)
    }

    // value fixes
    let _value = value
    if (_value instanceof Date) _value = moment(_value).toISOString()
    if (Number.isNaN(_value)) _value = 0

    ref.child(fixedPath).set(_value)
  })
}
