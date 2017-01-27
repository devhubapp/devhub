/**
 * This file is from https://github.com/gpbl/denormalizr
 */

import { isEqual, reduce } from 'lodash';
import Immutable from 'immutable';

/**
 * Helpers to enable Immutable-JS compatibility.
 */
function stringifiedArray(array) {
  return array.map(item => `${item}`);
}

/**
 * Returns a non-immutable object
 *
 * @param  {Immutable} object
 * @return {Any}
 */
export function toJS(object) {
  if (object && typeof object.toJS === 'function') {
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
  return Immutable.Iterable.isIterable(a) && Immutable.Iterable.isIterable(b)
    ? Immutable.is(a, Immutable.fromJS(b))
    : isEqual(a, toJS(b));
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
  if (typeof object.get === 'function') {
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
  if (typeof object.getIn === 'function') {
    return object.getIn(stringifiedArray(keyPath));
  }

  return reduce(
    keyPath,
    (memo, key) => get(memo, key),
    object,
  );
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
  if (typeof object.set === 'function') {
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
export function setIn(object, keyPath, value) {
  if (typeof object.setIn === 'function') {
    return object.setIn(stringifiedArray(keyPath), value);
  }

  const lastKeyName = keyPath.pop();
  const lastKeyLocation = keyPath.length > 0 ? getIn(object, keyPath) : object;

  // TODO: Prevent this mutation. Return new instance of all objects instead of only the last one
  lastKeyLocation[lastKeyName] = set(lastKeyLocation, lastKeyName, value);

  return object;
}
