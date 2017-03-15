/* global __DEV__ */

/**
 * This file is from https://github.com/gpbl/denormalizr
 */

import _ from 'lodash';
import Immutable from 'immutable';

/**
 * Helpers to enable Immutable-JS compatibility.
 */
function stringifiedArray(array: Array) {
  return array.map(item => `${item}`);
}

export function isImmutable(object) {
  return object && Immutable.Iterable.isIterable(object);
}

/**
 * Returns an immutable object
 *
 * @param  {Immutable} object
 * @return {Any}
 */
export function fromJS(object) {
  return Immutable.fromJS(object);
}

/**
 * Returns a non-immutable object
 *
 * @param  {Immutable} object
 * @return {Any}
 */
export function toJS(object) {
  if (isImmutable(object)) {
    return object.toJS();
  }

  return object;
}

/**
 * Shallow copy between two variables
 */
export function shallowEqualityCheck(a, b) {
  return a === b;
}

/**
 * Deep copy between two variables.
 * It uses lodash isEqual for normal objects, and Immutable.is for immutable
 */
export function deepImmutableEqualityCheck(a, b) {
  return isImmutable(a) || isImmutable(b)
    ? Immutable.is(Immutable.fromJS(a), Immutable.fromJS(b))
    : _.isEqual(toJS(a), toJS(b));
}

/**
 * If the object responds to get, that's called directly. Otherwise
 * get the object key value as usual.
 *
 * @param  {Object, Immutable.Map, Immutable.Record} object
 * @param  {Array<string, number>} keyPath
 * @return {Any}
 */
export function get(object, keyName) {
  if (!__DEV__ && !object) return null;

  if (isImmutable(object)) {
    return object.get(`${keyName}`);
  }

  return object[keyName];
}

/**
 * If the object responds to getIn, that's called directly. Otherwise
 * recursively apply object/array access to get the value.
 *
 * @param  {Object, Immutable.Map, Immutable.Record} object
 * @param  {Array<string, number>} keyPath
 * @return {Any}
 */
export function getIn(object, keyPath) {
  if (!__DEV__ && !object) return null;

  if (isImmutable(object)) {
    return object.getIn(stringifiedArray(keyPath));
  }

  return _.reduce(keyPath: Array<string>, (memo, key) => get(memo, key), object);
}

/**
 * If the object responds to set, that's called directly. Otherwise
 * creates a new shallow copy of the object setting the new value.
 *
 * @param  {Object, Immutable.Map, Immutable.Record} object
 * @param  {Array<string, number>} keyPath
 * @param  {Any} value
 * @return {Any}
 */
export function set(object, keyName, value) {
  if (!__DEV__ && !object) return null;

  if (isImmutable(object)) {
    return object.set(keyName, value);
  }

  return { ...object, [keyName]: value };
}

/**
 * If the object responds to setIn, that's called directly. Otherwise
 * recursively apply object/array access and set the value at that location.
 *
 * @param  {Object, Immutable.Map, Immutable.Record} object
 * @param  {Array<string, number>} keyPath
 * @param  {Any} value
 * @return {Any}
 */
export function setIn(object, keyPath: Array<string>, value) {
  if (!__DEV__ && !object) return null;

  if (isImmutable(object)) {
    return object.setIn(stringifiedArray(keyPath), value);
  }

  const lastKeyName = keyPath.pop();
  const lastKeyLocation = keyPath.length > 0 ? getIn(object, keyPath) : object;

  // TODO: Prevent this mutation. Return new instance of all objects instead of only the last one
  lastKeyLocation[lastKeyName] = set(lastKeyLocation, lastKeyName, value);

  return object;
}

export function updateIn(object, keyPath: Array<string>, updater: Function) {
  if (!__DEV__ && !object) return null;

  if (isImmutable(object)) {
    return object.updateIn(stringifiedArray(keyPath), updater);
  }

  const value = getIn(object, keyPath);
  return setIn(object, keyPath, updater(value));
}

/**
 * Get the length of an array or object.
 *
 * @param  {Object, Immutable.Map, Immutable.Record} object
 * @param  {Array<string, number>} keyPath
 * @return {Any}
 */
export function sizeOf(object) {
  if (!__DEV__ && !object) return null;

  if (isImmutable(object)) {
    return object.size;
  }

  if (_.isPlainObject(object)) {
    return Object.keys(object).length;
  }

  return object.length;
}

export function forEach(object, fn) {
  if (isImmutable(object)) {
    return object.forEach(fn);
  }

  return _.forEach(object, fn);
}

export function filter(object, fn) {
  if (isImmutable(object)) {
    return object.filter(fn);
  }

  return _.isPlainObject(object) ? _.pick(object, _.filter(object, fn)) : _.filter(object, fn);
}

export function map(object, fn) {
  if (isImmutable(object)) {
    return object.map(fn);
  }

  return _.isPlainObject(object) ? _.mapValues(object, fn) : _.map(object, fn);
}

function _immutableKeyInFilter(keys) {
  const keySet = Immutable.Set(keys);
  return (v, k) => keySet.has(k);
}

export function omit(object, keys) {
  if (!__DEV__ && !object) return null;

  if (isImmutable(object)) {
    return object.filterNot(_immutableKeyInFilter(keys));
  }

  return _.omit(object, keys);
}

export function pick(object, keys) {
  if (!__DEV__ && !object) return null;

  if (isImmutable(object)) {
    return object.filter(_immutableKeyInFilter(keys));
  }

  return _.pick(object, keys);
}

export function remove(object, key) {
  if (isImmutable(object)) {
    return object.remove(key);
  }

  const { [key]: removedKey, ...newObject } = object; // eslint-disable-line no-unused-vars
  return newObject;
}

export function getEmptyObjectFromTheSameType(object) {
  if (isImmutable(object)) {
    if (Immutable.List.isList(object)) return Immutable.List();
    else if (Immutable.Seq.isSeq(object)) return Immutable.Seq();
    else if (Immutable.Set.isSet(object)) return Immutable.Set();
    else if (Immutable.OrderedSet.isOrderedSet(object)) return Immutable.OrderedSet();
    else if (Immutable.OrderedMap.isOrderedMap(object)) return Immutable.OrderedMap();

    return Immutable.Map();
  }

  return Array.isArray(object) ? [] : {};
}

export function isList(object) {
  if (isImmutable(object)) {
    return Immutable.List.isList(object) || Immutable.Seq.isSeq(object);
  }

  return !!object && Array.isArray(object);
}

export function isObjectOrMap(object) {
  if (isImmutable(object)) {
    return Immutable.Map.isMap(object) || Immutable.OrderedMap.isOrderedMap(object);
  }

  return !!object && _.isPlainObject(object);
}
