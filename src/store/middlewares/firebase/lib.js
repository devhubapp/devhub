// @flow

import _ from 'lodash';

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
export function fixFirebaseKey(key, fromFirebase = false) {
  if (!key) return key;

  const charMap = fromFirebase ? firebaseInvertedCharMap : firebaseCharMap;

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
  return path;
}

export function createFirebaseHandler(
  { blacklist, callback, debug, eventName },
) {
  return snapshot => {
    const fullPath = fixFirebaseKey(getPathFromRef(snapshot.ref), true);
    let value = snapshot.val();

    if (blacklist && blacklist.length > 0) {
      value = _.omit(value, blacklist);
    }

    value = fixFirebaseKeysFromObject(value, true);

    if (debug) {
      console.debug(`[FIREBASE] Received ${eventName} on ${fullPath}:`, value);
    }

    if (typeof callback === 'function') {
      let _callbackResult = callback({
        eventName,
        fullPath,
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
  { blacklist, callback, debug, eventName, ref },
) => {
  const fullPath = getPathFromRef(ref);
  let message = `[FIREBASE] Watching ${fullPath} ${eventName}`;

  if (blacklist && blacklist.length > 0) {
    message = `${message}, except ${blacklist.join(', ')}`;
  }

  if (debug) console.debug(message);

  if (eventName === 'children' || Array.isArray(eventName)) {
    const eventNames = Array.isArray(eventName)
      ? eventName
      : ['child_added', 'child_changed', 'child_removed'];

    eventNames.forEach(realEventName => {
      addFirebaseListener({
        blacklist,
        callback,
        debug: false,
        eventName: realEventName,
        ref,
      });
    });

    return;
  }

  ref.on(
    eventName,
    createFirebaseHandler({ blacklist, callback, debug, eventName }),
  );
};

export function watchFirebaseFromMap(
  { callback, debug = false, map, ref, ...rest },
) {
  let count = 0;
  const blacklist = [];
  const whitelist = [];

  if (rest.root !== false) {
    _databaseRef = ref;
  }

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const field in map) {
    count++;
    const value = map[field];

    if (value === true) {
      whitelist.push(field);
    } else if (value === false) {
      blacklist.push(field);
    } else if (typeof value === 'object') {
      watchFirebaseFromMap({
        callback,
        debug,
        map: value,
        ref: ref.child(field),
        root: false,
      });
    } else {
      console.error(
        `[FIREBASE MAPPER] Unknown value received on field ${field}: `,
        value,
      );
    }
  }

  if (blacklist.length > 0 && whitelist.length > 0) {
    console.error(
      '[FIREBASE MAPPER] You cannot pass both true and false values to the same map field.',
    );
  } else if (count === 0) {
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
