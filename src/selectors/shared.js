import { is, Iterable, List } from 'immutable';
import { isEqual } from 'lodash';
import { createSelectorCreator } from 'reselect';

export const stateSelector = state => state;
export const entitiesSelector = state => state.get('entities');

export function shallowEqualityCheck(a, b) {
  return a === b;
}

export function deepImmutableEqualityCheck(a, b) {
  return Iterable.isIterable(a) && Iterable.isIterable(b)
    ? is(a, b)
    : isEqual(a, b);
}

export function immutableMemoize(func, equalityCheck = shallowEqualityCheck) {
  let lastArgs = null;
  let lastResult = null;
  const isEqualToLastArg = (value, index) => equalityCheck(value, lastArgs[index]);

  return (...args) => {
    if (
      lastArgs === null ||
      lastArgs.length !== args.length ||
      !args.every(isEqualToLastArg)
    ) {
      const newResult = func(...args);
      if (
        !shallowEqualityCheck(newResult, lastResult) &&
        !deepImmutableEqualityCheck(newResult, lastResult)
      ) {
        lastResult = newResult;
      }
    }

    lastArgs = args;
    return lastResult;
  };
}

const getKeysFromImmutableObject = obj => (obj ? obj.keySeq().toList() : List());
export const objectKeysMemoized = immutableMemoize(getKeysFromImmutableObject);

export function createImmutableSelectorCreator(
  memoize = immutableMemoize,
  equalityCheck = shallowEqualityCheck,
) {
  return createSelectorCreator(memoize, equalityCheck);
}

export const createImmutableSelector = createImmutableSelectorCreator();
