// @flow

import _ from 'lodash';
import moment from 'moment';

import { fixFirebaseKey, fixFirebaseKeysFromObject, getPathFromRef, getMapAnalysis } from './helpers';

import {
  forEach,
  get,
  isObjectOrMap,
  omit,
  set,
} from '../../../utils/immutable';

_.mixin({
  deepMapKeys(obj, fn) {
    if (!_.isPlainObject(obj)) return obj;

    let newObj = {};
    _.forOwn(obj, (v, k) => {
      let _v = v;
      if (_.isPlainObject(_v)) _v = _.deepMapKeys(v, fn);
      newObj = set(newObj, fn(_v, k), _v);
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
    const key = snapshot.key;
    let value = snapshot.val();
    let blacklisted = false;

    if (blacklist && blacklist.length) {
      if (eventName === 'value' && isObjectOrMap(value)) {
        value = omit(value, blacklist);
      } else {
        blacklisted = blacklist.includes(key);
      }
    }

    if (debug) {
      const blacklistedText = blacklisted ? ', but ignored' : '';
      console.debug(`[FIREBASE] Received ${eventName} on ${fullPath}${blacklistedText}:`, value);
    }

    if (blacklisted) {
      return;
    }

    const firebasePathArr = fullPath.split('/').filter(Boolean);
    const statePathArr = firebasePathArr.map(path => fixFirebaseKey(path, false));
    value = fixFirebaseKeysFromObject(value, true);

    if (typeof callback === 'function') {
      callback({
        eventName,
        firebasePathArr,
        statePathArr,
        value,
      });
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
      map: get(map, field),
      ref: ref.child(field),
      root: false,
    });
  });

  if (count === 0) {
    // passed an empty object, so listen to it's children
    addFirebaseListener({
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
      eventName: 'children',
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

    // value fixes
    let _value = value;
    if (_value instanceof Date) _value = moment(_value).toISOString();
    // if (Number.isNaN(value)) _value = 0;

    ref.child(fixedPath).set(_value);
  });
};
