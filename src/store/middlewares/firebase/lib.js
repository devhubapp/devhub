// @flow

import _ from 'lodash';

import {
  deepImmutableEqualityCheck,
  forEach,
  get,
  getEmptyObjectFromTheSameType,
  isObjectOrMap,
  omit,
  pick,
  remove,
  set,
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

let _databaseRef;

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

export function getPathFromRef(ref, rootRef = _databaseRef) {
  if (!ref) return '';
  let path = ref.toString();

  if (rootRef) path = path.substring(rootRef.toString().length);
  while (path.slice(-1) === '/') { path = path.slice(0, -1); }

  return path;
}

export function createFirebaseHandler(
  { blacklist, callback, debug, eventName },
) {
  return snapshot => {
    const fullPath = getPathFromRef(snapshot.ref);
    let value = snapshot.val();

    if (blacklist && blacklist.length) {
      value = _.omit(value, blacklist);
    }

    value = fixFirebaseKeysFromObject(value, false);

    if (debug) {
      console.debug(`[FIREBASE] Received ${eventName} on ${fullPath}:`, value);
    }

    const pathArr = fullPath.split('/').filter(Boolean);
    const firebasePathArr = pathArr.map(path => fixFirebaseKey(path, true));
    const statePathArr = pathArr.map(path => fixFirebaseKey(path, false));

    if (typeof callback === 'function') {
      let _callbackResult = callback({
        eventName,
        firebasePathArr,
        statePathArr,
        value,
      });

      if (callback.constructor.name === 'GeneratorFunction') {
        while (
          _callbackResult.done === false &&
          typeof _callbackResult.next === 'function'
        ) {
          _callbackResult = _callbackResult.next();
        }
      }
    }
  };
}

export const addFirebaseListener = (
  { blacklist, callback, debug, eventName, ref, ...rest },
) => {
  const fullPath = getPathFromRef(ref);
  let message = `[FIREBASE] Watching ${fullPath} ${eventName}`;

  if (blacklist && blacklist.length) {
    message = `${message}, except ${blacklist.join(', ')}`;
  }

  if (debug && !rest.isRecursiveCall) console.debug(message);

  if (eventName === 'children' || Array.isArray(eventName)) {
    const eventNames = Array.isArray(eventName)
      ? eventName
      : ['child_added', 'child_changed', 'child_removed'];

    eventNames.forEach(realEventName => {
      addFirebaseListener({
        blacklist,
        callback,
        debug,
        eventName: realEventName,
        ref,
        isRecursiveCall: true,
      });
    });

    return;
  }

  ref.on(
    eventName,
    createFirebaseHandler({ blacklist, callback, debug, eventName }),
  );
};

export function getMapAnalysis(map) {
  const blacklist = [];
  const objects = [];
  const others = [];
  const whitelist = [];

  let count = 0;

  if (typeof map !== 'object') {
    console.error(`[MAPPER] Map should be an object. Received: ${typeof map}`);
    return null;
  }

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const field in map) {
    count++;
    const value = map[field];

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
  }

  if (blacklist.length && whitelist.length) {
    console.error(
      '[MAPPER] You cannot pass both true and false values to the same map field.',
    );
    return null;
  }

  return { blacklist, count, objects, others, whitelist };
}

export function watchFirebaseFromMap(
  { callback, debug = false, map, ref, ...rest },
) {
  const mapAnalysis = getMapAnalysis(map);
  if (!mapAnalysis) return;

  if (rest.root !== false) {
    _databaseRef = ref;
  }

  const { blacklist, count, objects, whitelist } = mapAnalysis;

  objects.forEach(field => {
    watchFirebaseFromMap({
      callback,
      debug,
      map: map[field],
      ref: ref.child(field),
      root: false,
    });
  });

  if (count === 0) {
    // passed an empty object, so listen to it's children
    addFirebaseListener({
      blacklist,
      callback,
      debug,
      ref,
      eventName: 'children',
    });
  } else if (blacklist.length) {
    // listen to all children, except the ones specified
    addFirebaseListener({
      blacklist,
      callback,
      debug,
      ref,
      eventName: 'value',
    });
  } else if (whitelist.length) {
    // listen only to the specified children
    whitelist.forEach(field => addFirebaseListener({
      callback,
      debug,
      eventName: 'value',
      ref: ref.child(field),
    }));
  }
}

export function getObjectFilteredByMap(object, map) {
  if (map === true) return object;
  if (!map || !object) return null;

  const mapAnalysis = getMapAnalysis(map);
  if (!mapAnalysis) return object;

  const { blacklist, count, objects, whitelist } = mapAnalysis;

  if (count === 0) {
    // passed an empty object, so we don't modify anything
    return object;
  }

  let filteredObject = getEmptyObjectFromTheSameType(object);

  if (blacklist && blacklist.length) {
    filteredObject = omit(object, blacklist);
  } else if (whitelist && whitelist.length) {
    filteredObject = pick(object, blacklist);
  }

  if (objects && objects.length) {
    objects.forEach(field => {
      filteredObject = set(
        filteredObject,
        field,
        getObjectFilteredByMap(get(object, field), get(map, field)),
      );
    });
  }

  return filteredObject;
}

export function getObjectDiff(oldObject, newObject, map, ...rest) {
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

export const applyPatchOnFirebase = ({ debug, patch, ref = _databaseRef }) => {
  if (!(ref && patch && isObjectOrMap(patch))) return;

  forEach(patch, (value, field) => {
    const fixedPath = fixFirebaseKey(field, true);

    if (isObjectOrMap(value)) {
      applyPatchOnFirebase({ debug, patch: value, ref: ref.child(fixedPath) });
      return;
    }

    if (debug) {
      const fullPath = `${getPathFromRef(ref)}/${field}`;
      console.debug(`[FIREBASE] Patching on ${fullPath}`, value);
    }

    ref.child(fixedPath).set(value);
  });
};
