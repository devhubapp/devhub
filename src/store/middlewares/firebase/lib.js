// @flow

import _ from 'lodash';

import { fixFirebaseKey, fixFirebaseKeysFromObject, getPathFromRef, getMapAnalysis } from './helpers';

import {
  forEach,
  isObjectOrMap,
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

export function createFirebaseHandler(
  { blacklist, callback, debug, eventName },
) {
  return snapshot => {
    const fullPath = getPathFromRef(snapshot.ref, _databaseRef);
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
  const fullPath = getPathFromRef(ref, _databaseRef);
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

export const applyPatchOnFirebase = ({ debug, patch, ref = _databaseRef }) => {
  if (!(ref && patch && isObjectOrMap(patch))) return;

  forEach(patch, (value, field) => {
    const fixedPath = fixFirebaseKey(field, true);

    if (isObjectOrMap(value)) {
      applyPatchOnFirebase({ debug, patch: value, ref: ref.child(fixedPath) });
      return;
    }

    if (debug) {
      const fullPath = `${getPathFromRef(ref, _databaseRef)}/${field}`;
      console.debug(`[FIREBASE] Patching on ${fullPath}`, value);
    }

    ref.child(fixedPath).set(value);
  });
};
