/**
 * This file is from https://github.com/gpbl/denormalizr
 */

import reduce from 'lodash/reduce';

/**
 * If the object responds to getIn, that's called directly. Otherwise
 * recursively apply object/array access to get the value.
 *
 * @param  {Object, Immutable.Map, Immutable.Record} object
 * @param  {Array<string, number>} keyPath
 * @return {Any}
 */
export function getIn(object, keyPath) {
  if (object.getIn) {
    return object.getIn(stringifiedArray(keyPath));
  }

  return reduce(
    keyPath,
    (memo, key) => memo[key],
    object,
  );
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
  if (object.setIn) {
    return object.setIn(stringifiedArray(keyPath), value);
  }

  const lastKey = keyPath.pop();
  const location = getIn(object, keyPath);

  location[lastKey] = value;

  return object;
}
