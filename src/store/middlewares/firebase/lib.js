// @flow

import _ from 'lodash';
import moment from 'moment';

import {
  fixFirebaseKey,
  fixFirebaseKeysFromObject,
  getObjectFilteredByMap,
  getPathFromRef,
  getMapAnalysis,
} from './helpers';

import {
  forEach,
  get,
  isObjectOrMap,
} from '../../../utils/immutable';

export const firebaseCharMap = { '/': '__STRIPE__' };
export const firebaseInvertedCharMap = _.invert(firebaseCharMap);

let _databaseRef;

export function createFirebaseHandler(
  { blacklist, callback, debug, eventName, map },
) {
  return snapshot => {
    const fullPath = getPathFromRef(snapshot.ref, _databaseRef);
    let value = snapshot.val();
    let blacklisted = false;

    if (eventName === 'value' && isObjectOrMap(value)) {
      value = getObjectFilteredByMap(value, map);
    } else {
      blacklisted = blacklist && blacklist.length && blacklist.includes(snapshot.key);
    }

    if (debug) {
      const blacklistedText = blacklisted ? ', but ignored' : '';
      console.debug(`[FIREBASE] Received ${eventName} on ${fullPath}${blacklistedText}:`, snapshot.val());
    }

    if (blacklisted) {
      return;
    }

    const firebasePathArr = fullPath.split('/').filter(Boolean);
    const statePathArr = firebasePathArr.map(path => fixFirebaseKey(path, false));
    value = fixFirebaseKeysFromObject(value, false);

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
  { blacklist, callback, debug, eventName, map, ref, ...rest },
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
        map,
        ref,
        isRecursiveCall: true,
      });
    });

    return;
  }

  ref.on(
    eventName,
    createFirebaseHandler({ blacklist, callback, debug, eventName, map }),
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

  const { blacklist, count, hasAsterisk, objects, whitelist } = mapAnalysis;

  objects.forEach(field => {
    watchFirebaseFromMap({
      callback,
      debug,
      map: get(map, field),
      ref: ref.child(field),
      root: false,
    });
  });

  if (count === 0 || (hasAsterisk && count === 1)) {
    // passed an empty object, so listen to it's children
    addFirebaseListener({
      callback,
      debug,
      eventName: 'children',
      map,
      ref,
    });
  } else if (blacklist.length) {
    // listen to all children, except the ones specified
    addFirebaseListener({
      blacklist,
      callback,
      debug,
      eventName: 'children',
      map,
      ref,
    });
  } else if (whitelist.length) {
    // listen only to the specified children
    whitelist.forEach(field => addFirebaseListener({
      callback,
      debug,
      eventName: 'value',
      map,
      ref: ref.child(field),
    }));
  }
}

export const applyPatchOnFirebase = ({ debug, depth = -1, patch, ref = _databaseRef, ...rest }) => {
  if (!(ref && patch && isObjectOrMap(patch))) return;

  const currentDepth = Number(rest.currentDepth) || 1;
  const maxDepth = Number(depth) > 0 ? depth : -1;

  forEach(patch, (value, field) => {
    const fixedPath = fixFirebaseKey(field, true);

    if (isObjectOrMap(value) && (currentDepth < maxDepth || maxDepth === -1)) {
      applyPatchOnFirebase({
        debug,
        patch: value,
        ref: ref.child(fixedPath),
        ...rest,
        currentDepth: currentDepth + 1,
      });

      return;
    }

    if (debug) {
      const fullPath = `${getPathFromRef(ref, _databaseRef)}/${field}`;
      console.debug(`[FIREBASE] Patching on ${fullPath}`, value);
    }

    // value fixes
    let _value = value;
    if (_value instanceof Date) _value = moment(_value).toISOString();
    if (Number.isNaN(_value)) _value = 0;

    ref.child(fixedPath).set(_value);
  });
};
