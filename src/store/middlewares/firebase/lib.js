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
  map,
  rootDatabaseRef,
}) {
  return snapshot => {
    const fullPath = getRelativePathFromRef(snapshot.ref, rootDatabaseRef)
    let value = snapshot.val()
    let blacklisted = false

    if (eventName === 'value' && isObjectOrMap(value)) {
      value = getObjectFilteredByMap(value, map)
    } else {
      blacklisted =
        blacklist && blacklist.length && blacklist.includes(snapshot.key)
    }

    if (debug) {
      const suffix = blacklisted ? ', but ignored.' : ':'
      console.debug(
        `[FIREBASE] Received ${eventName} on ${fullPath || '/'}${suffix}`,
        value,
      )
    }

    if (blacklisted) {
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
  map,
  once,
  ref,
  rootDatabaseRef,
  ...rest
}) => {
  const fullPath = getRelativePathFromRef(ref, rootDatabaseRef)
  let message = `[FIREBASE] Watching ${fullPath || '/'} ${eventName}`

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
        map,
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
        map,
        rootDatabaseRef,
      }),
    )
  }
}

export function watchFirebaseFromMap({
  callback,
  debug = __DEV__,
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
