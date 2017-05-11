// @flow

import _ from 'lodash'

import {
  deepImmutableEqualityCheck,
  deepMapKeys,
  forEach,
  get,
  getEmptyObjectFromTheSameType,
  isObjectOrMap,
  map as _map,
  omit,
  pick,
  remove,
  set,
  sizeOf,
  toJS,
} from '../../../utils/immutable'

export const firebaseCharMap = {
  $: '__DOLLAR__',
  '#': '__HASH__',
  '.': '__DOT__',
  '/': '__STRIPE__',
  '[': '__BRACKET_OPEN__',
  ']': '__BRACKET_CLOSE__',
}

export const firebaseInvertedCharMap = _.invert(firebaseCharMap)

// firebase does not support some characters as object key, like '/'
export function fixFirebaseKey(key, encrypt = false) {
  if (!key || typeof key !== 'string') {
    console.error({ key, encrypt })
    return key
  }

  const charMap = encrypt ? firebaseCharMap : firebaseInvertedCharMap

  let fixedKey = key
  Object.keys(charMap).forEach(char => {
    if (fixedKey.indexOf(char) >= 0) {
      const find = new RegExp(char, 'g')
      const replace = charMap[char]

      fixedKey = fixedKey.replace(find, replace)
    }
  })

  return fixedKey
}

export function fixFirebaseKeysFromObject(object, encrypt = false) {
  return deepMapKeys(object, (value, key) => fixFirebaseKey(key, encrypt))
}

export function getPathFromRef(ref) {
  if (!ref) return ''

  let path = ref.toString()
  while (path.slice(-1) === '/') {
    path = path.slice(0, -1)
  }

  return path
}

export function getRelativePathFromRef(ref, rootRef) {
  const itemPath = getPathFromRef(ref)
  const rootPath = getPathFromRef(rootRef)

  if (!(itemPath && rootPath)) {
    console.error(
      'Expected both ref and rootRef parameters on getRelativePathFromRef. Received:',
      ref,
      rootPath,
    )
    return ''
  }

  let path = itemPath.replace(rootPath, '')
  while (path.slice(-1) === '/') {
    path = path.slice(0, -1)
  }

  return path
}

export function getMapAnalysis(map) {
  const blacklist = []
  const objects = []
  const others = []
  const whitelist = []
  let hasAsterisk = false

  let count = 0

  if (typeof map !== 'object') {
    console.error(`[MAPPER] Map should be an object. Received: ${typeof map}`)
    return null
  }

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  forEach(map, (value, field) => {
    count++

    if (field === '*') {
      hasAsterisk = true
      return
    }

    if (value === true) {
      whitelist.push(field)
    } else if (value === false) {
      blacklist.push(field)
    } else if (isObjectOrMap(value)) {
      objects.push(field)
    } else {
      others.push(field)
      console.error(
        `[MAPPER] Unknown value received on field ${field}: `,
        value,
      )
    }
  })

  if (blacklist.length && whitelist.length) {
    console.error(
      '[MAPPER] You cannot pass both true and false values to the same map field.',
      toJS(map),
    )
  }

  return { blacklist, count, hasAsterisk, objects, others, whitelist }
}

export function getObjectFilteredByMap(object, map) {
  if (map === true) return object
  if (!map || !object) return null

  const mapAnalysis = getMapAnalysis(map)
  if (!mapAnalysis) return object

  const { blacklist, count, hasAsterisk, objects, whitelist } = mapAnalysis

  if (count === 0) {
    // passed an empty object, so we dont modify anything
    return object
  } else if (hasAsterisk) {
    if (!object) return object

    let filteredObject = object
    if (blacklist && blacklist.length) {
      filteredObject = omit(object, blacklist)
    }

    const itemMap = get(map, '*')
    const newObject = _map(filteredObject, (item, key) =>
      getObjectFilteredByMap(
        item,
        get(map, key) !== undefined ? get(map, key) : itemMap,
      ),
    )
    return newObject
  }

  let filteredObject = getEmptyObjectFromTheSameType(object)

  if (blacklist && blacklist.length) {
    filteredObject = omit(object, blacklist)
  } else if (whitelist && whitelist.length) {
    filteredObject = pick(object, whitelist)
  }

  if (objects && objects.length) {
    forEach(objects, field => {
      const value = getObjectFilteredByMap(get(object, field), get(map, field))
      filteredObject = set(filteredObject, field, value)
    })
  }

  return filteredObject
}

export function getMapSubtractedByMap(mapA, mapB) {
  if (mapA === undefined) return null
  if (mapB === undefined) return mapA
  if (mapB === true || mapB === false) return mapA === mapB ? null : mapA
  if (!isObjectOrMap(mapA) || !isObjectOrMap(mapB)) return null

  if (sizeOf(mapB) === 0) {
    return null
  }

  let newMap = mapA
  let removeAnyField = false

  forEach(mapB, (mapBValue, field) => {
    const value = getMapSubtractedByMap(get(mapA, field), mapBValue)
    if (value === null || value === undefined) {
      newMap = remove(newMap, field)
      removeAnyField = true
    } else {
      newMap = set(newMap, field, value)
    }
  })

  if (removeAnyField && sizeOf(newMap) === 0) {
    return null
  }

  return newMap
}

export function getSubMapFromPath(map, pathArr) {
  if (!Array.isArray(pathArr)) {
    console.error(`[SUBMAP] Invalid arguments passed to getSubMapFromPath. Expected an array for pathArr, received: ${typeof pathArr}.`)
    return null
  }

  const firstKey = get(pathArr, 0)

  if (map === '*') return true
  if (map === true || map === false) return map
  if (isObjectOrMap(map) && get(map, '*'))
    return sizeOf(pathArr) === 0
      ? true // omit(map, '*')
      : getSubMapFromPath(
          get(map, firstKey) !== undefined ? get(map, firstKey) : get(map, '*'),
          pathArr.slice(1),
        )
  if (sizeOf(pathArr) === 0) return map
  if (isObjectOrMap(map) && sizeOf(map) === 0) return map
  if (!isObjectOrMap(map)) return map

  const nextMapValue = get(map, firstKey)

  if (nextMapValue === undefined) {
    const { blacklist, whitelist } = getMapAnalysis(map) || {}
    if (blacklist && sizeOf(blacklist) > 0) return true
    else if (whitelist && sizeOf(whitelist) > 0) return false
  }

  return getSubMapFromPath(nextMapValue, pathArr.slice(1))
}

export function getObjectDiff(oldObject, newObject, map, ...rest) {
  if (oldObject === newObject) return null

  if (!isObjectOrMap(newObject)) {
    console.error(`[OBJECT DIFF] Invalid arguments passed to getObjectDiff. Expected objects, received: ${typeof oldObject} and ${typeof newObject}.`)
    if (__DEV__)
      console.debug('getObjectDiff', { oldObject, newObject, map, rest })
    return newObject
  }

  const depth = rest[0] || 0
  const initialValue = getEmptyObjectFromTheSameType(newObject)
  let result = initialValue

  const _oldObject = map
    ? getObjectFilteredByMap(oldObject || initialValue, map) || initialValue
    : oldObject || initialValue

  const _newObject = map ? getObjectFilteredByMap(newObject, map) : newObject

  if (!isObjectOrMap(result)) {
    return _newObject || null
  }

  // check for deleted fields
  if (isObjectOrMap(_oldObject)) {
    forEach(_oldObject, (oldValue, field) => {
      const newValue = get(_newObject, field)

      if (newValue === undefined) {
        result = set(result, field, null)
        return
      }

      if (isObjectOrMap(oldValue)) {
        result = set(
          result,
          field,
          getObjectDiff(
            oldValue,
            newValue || getEmptyObjectFromTheSameType(oldValue),
            get(map || {}, field),
            depth + 1,
          ),
        )
      }
    })
  }

  // check for modified fields
  if (isObjectOrMap(_newObject)) {
    forEach(_newObject, (newValue, field) => {
      const oldValue = get(_oldObject, field)

      if (
        oldValue === newValue ||
        deepImmutableEqualityCheck(oldValue, newValue)
      ) {
        result = remove(result, field)
        return
      }

      if (isObjectOrMap(newValue)) {
        result = set(
          result,
          field,
          getObjectDiff(oldValue, newValue, get(map || {}, field), depth + 1),
        )
      } else if (isObjectOrMap(result)) {
        result = set(result, field, newValue)
      } else {
        result = newValue
      }
    })
  }

  return depth === 0 && result === initialValue ? null : result
}
