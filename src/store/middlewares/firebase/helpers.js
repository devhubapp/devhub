// @flow

import _ from 'lodash';

import {
  deepImmutableEqualityCheck,
  forEach,
  get,
  getEmptyObjectFromTheSameType,
  isObjectOrMap,
  map as mapFn,
  omit,
  pick,
  remove,
  set,
  sizeOf,
  toJS,
} from '../../../utils/immutable';

_.mixin({
  deepMapKeys(obj, fn) {
    if (!_.isPlainObject(obj)) return obj;

    const newObj = {};
    _.forOwn(obj, (v, k) => {
      let _v = v;
      if (_.isPlainObject(_v)) _v = _.deepMapKeys(v, fn);
      newObj[fn(_v, k)] = _v;
    });

    return newObj;
  },
});

export const firebaseCharMap = { '/': '__STRIPE__' };
export const firebaseInvertedCharMap = _.invert(firebaseCharMap);

// firebase does not support some characters as object key, like '/'
export function fixFirebaseKey(key, encrypt = false) {
  if (!key || typeof key !== 'string') {
    console.error({ key, encrypt });
    return key;
  }

  const charMap = encrypt ? firebaseCharMap : firebaseInvertedCharMap;

  let fixedKey = key;
  Object.keys(charMap).forEach(char => {
    if (fixedKey.indexOf(char) >= 0) {
      const find = new RegExp(char, 'g');
      const replace = charMap[char];

      fixedKey = fixedKey.replace(find, replace);
    }
  });

  return fixedKey;
}

export function fixFirebaseKeysFromObject(object, fromFirebase) {
  return _.deepMapKeys(object, (value, key) =>
    fixFirebaseKey(key, fromFirebase));
}

export function getPathFromRef(ref, rootRef) {
  if (!ref) return '';
  let path = ref.toString();

  if (rootRef) path = path.substring(rootRef.toString().length);
  while (path.slice(-1) === '/') { path = path.slice(0, -1); }

  return path;
}

export function getMapAnalysis(map) {
  const blacklist = [];
  const objects = [];
  const others = [];
  const whitelist = [];
  let hasAsterisk = false;

  let count = 0;

  if (typeof map !== 'object') {
    console.error(`[MAPPER] Map should be an object. Received: ${typeof map}`);
    return null;
  }

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  forEach(map, (value, field) => {
    count++;

    if (field === '*') {
      hasAsterisk = true;
      return;
    }

    if (value === true) {
      whitelist.push(field);
    } else if (value === false) {
      blacklist.push(field);
    } else if (isObjectOrMap(value)) {
      objects.push(field);
    } else {
      others.push(field);
      console.error(
        `[MAPPER] Unknown value received on field ${field}: `,
        value,
      );
    }
  });

  if (blacklist.length && whitelist.length) {
    console.error(
      '[MAPPER] You cannot pass both true and false values to the same map field.',
      toJS(map),
    );
  }

  return { blacklist, count, hasAsterisk, objects, others, whitelist };
}

export function getObjectFilteredByMap(object, map) {
  if (map === true) return object;
  if (!map || !object) return null;

  const mapAnalysis = getMapAnalysis(map);
  if (!mapAnalysis) return object;

  const { blacklist, count, hasAsterisk, objects, whitelist } = mapAnalysis;

  if (count === 0) {
    // passed an empty object, so we dont modify anything
    return object;
  } else if (hasAsterisk && count === 1) {
    if (!object) return object;

    const itemMap = get(map, '*');
    const newObject = mapFn(object, item => getObjectFilteredByMap(item, itemMap));
    return newObject;
  }

  let filteredObject = getEmptyObjectFromTheSameType(object);

  if (blacklist && blacklist.length) {
    filteredObject = omit(object, blacklist);
  } else if (whitelist && whitelist.length) {
    filteredObject = pick(object, whitelist);
  }

  if (objects && objects.length) {
    forEach(objects, (field) => {
      const value = getObjectFilteredByMap(get(object, field), get(map, field));
      filteredObject = set(filteredObject, field, value);
    });
  }

  return filteredObject;
}

export function getMapSubtractedByMap(mapA, mapB) {
  if (mapA === undefined) return null;
  if (mapB === undefined) return mapA;
  if (mapB === true || mapB === false) return mapA === mapB ? null : mapA;
  if (!isObjectOrMap(mapA) || !isObjectOrMap(mapB)) return null;

  if (sizeOf(mapB) === 0) {
    return null;
  }

  let newMap = mapA;
  let removeAnyField = false;

  forEach(mapB, (mapBValue, field) => {
    const value = getMapSubtractedByMap(get(mapA, field), mapBValue);
    if (value === null || value === undefined) {
      newMap = remove(newMap, field);
      removeAnyField = true;
    } else {
      newMap = set(newMap, field, value);
    }
  });

  if (removeAnyField && sizeOf(newMap) === 0) {
    return null;
  }

  return newMap;
}

export function getObjectDiff(oldObject, newObject, map, ...rest) {
  if (oldObject === newObject) return null;

  if (!isObjectOrMap(newObject)) {
    console.error(
      `[OBJECT DIFF] Invalid arguments passed to getObjectDiff. Expected objects, received: ${typeof oldObject} and ${typeof newObject}.`,
    );
  }

  const depth = rest[0] || 0;
  const initialValue = getEmptyObjectFromTheSameType(newObject);
  let result = initialValue;

  const _oldObject = map
    ? getObjectFilteredByMap(oldObject || initialValue, map) || initialValue
    : oldObject || initialValue;

  const _newObject = map ? getObjectFilteredByMap(newObject, map) : newObject;

  if (!isObjectOrMap(result)) {
    return _newObject || null;
  }

  // check for deleted fields
  if (isObjectOrMap(_oldObject)) {
    forEach(_oldObject, (oldValue, field) => {
      const newValue = get(_newObject, field);

      if (newValue === undefined) {
        result = set(result, field, null);
        return;
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
        );
      }
    });
  }

  // check for modified fields
  if (isObjectOrMap(_newObject)) {
    forEach(_newObject, (newValue, field) => {
      const oldValue = get(_oldObject, field);

      if (
        oldValue === newValue || deepImmutableEqualityCheck(oldValue, newValue)
      ) {
        result = remove(result, field);
        return;
      }

      if (isObjectOrMap(newValue)) {
        result = set(
          result,
          field,
          getObjectDiff(oldValue, newValue, get(map || {}, field), depth + 1),
        );
      } else if (isObjectOrMap(result)) {
        result = set(result, field, newValue);
      } else {
        result = newValue;
      }
    });
  }

  return depth === 0 && result === initialValue ? null : result;
}
