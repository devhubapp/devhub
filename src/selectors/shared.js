import _ from 'lodash';
import moment from 'moment';
import { is, Iterable, List } from 'immutable';
import { createSelectorCreator } from 'reselect';

export const stateSelector = state => state;
export const entitiesSelector = state => state.get('entities');

export function shallowEqualityCheck(a, b) {
  return a === b;
}

export function deepImmutableEqualityCheck(a, b) {
  return Iterable.isIterable(a) && Iterable.isIterable(b)
    ? is(a, b)
    : _.isEqual(a, b);
}

export function immutableMemoize(
  func,
  equalityCheck = shallowEqualityCheck,
  numberOfArgsToMemoize = null,
) {
  let lastArgs = null;
  let lastResult = null;
  const isEqualToLastArg = (value, index) => equalityCheck(value, lastArgs[index]);

  return (...args) => {
    const slicedArgs = Number(numberOfArgsToMemoize) > 0
      ? args.slice(0, numberOfArgsToMemoize)
      : args
    ;

    if (
      lastArgs === null ||
      lastArgs.length !== slicedArgs.length ||
      !slicedArgs.every(isEqualToLastArg)
    ) {
      const newResult = func(...args);
      // const isArray = Array.isArray(newResult)
      //   || newResult instanceof List
      //   || newResult instanceof Seq
      //   || newResult instanceof Set;

      if (
        !(
          shallowEqualityCheck(newResult, lastResult) ||
          (/*isArray && */deepImmutableEqualityCheck(newResult, lastResult))
        )
      ) {
        lastResult = newResult;
      }
    }

    lastArgs = slicedArgs;
    return lastResult;
  };
}

const getKeysFromImmutableObject = obj => (obj ? obj.keySeq().toList() : List());
export const objectKeysMemoized = immutableMemoize(getKeysFromImmutableObject);

export const createImmutableSelectorCreator = _.memoize((numberOfArgsToMemoize) => (
  createSelectorCreator(
    _.bind(immutableMemoize, null, _, _, numberOfArgsToMemoize),
    shallowEqualityCheck,
  )
));

export const createImmutableSelector = createImmutableSelectorCreator();

export function isArchivedFilter(obj) {
  if (!obj) return false;

  return obj.get('archived_at') &&
    !(
      // if any update ocurres after it was archived, it is consided unarchived
      obj.get('updated_at') &&
      moment(obj.get('updated_at')).isAfter(obj.get('archived_at'))
    )
  ;
}

export function isReadFilter(obj) {
  if (!obj) return false;

  return obj.get('last_read_at') &&
    !(
      // preserves the latest state between last_read_at and last_unread_at
      obj.get('last_unread_at') &&
      moment(obj.get('last_unread_at')).isAfter(obj.get('last_read_at'))
    )
  ;
}
