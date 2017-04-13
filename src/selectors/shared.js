import _ from 'lodash';
import moment from 'moment';
import { List } from 'immutable';
import { createSelectorCreator } from 'reselect';

import { deepImmutableEqualityCheck, shallowEqualityCheck } from '../utils/immutable';

export const stateSelector = state => state;
export const entitiesSelector = state => state.get('entities');

export function immutableMemoize(
  func,
  equalityCheck = shallowEqualityCheck,
  numberOfArgsToMemoize = null,
) {
  let lastArgs = null;
  let lastResult = null;
  const isEqualToLastArg = (value, index) => equalityCheck(value, lastArgs[index]);

  return (...args) => {
    const slicedArgs = typeof numberOfArgsToMemoize === 'number'
      ? (
        numberOfArgsToMemoize < 0
          ? args.slice(numberOfArgsToMemoize)
          : args.slice(0, numberOfArgsToMemoize)
      )
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
          (/* isArray && */deepImmutableEqualityCheck(newResult, lastResult))
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

export function isDeletedFilter(obj) {
  if (!obj) return true;

  return !!obj.get('deleted_at') &&
    !(obj.get('updated_at') &&
      moment(obj.get('updated_at')).isAfter(obj.get('deleted_at')));
}

export function isArchivedFilter(obj) {
  if (!obj) return false;
  if (isDeletedFilter(obj)) return false;

  return !!obj.get('archived_at') &&
    !(obj.get('updated_at') &&
      moment(obj.get('updated_at')).isAfter(obj.get('archived_at')));
}

export function isReadFilter(obj) {
  if (!obj) return false;
  if (isDeletedFilter(obj)) return false;

  // preserves the latest state between last_read_at and last_unread_at
  if (obj.get('last_read_at') && obj.get('last_unread_at')) {
    return !moment(obj.get('last_unread_at')).isAfter(obj.get('last_read_at'));
  }

  // dont do !obj.get('unread') because unread=undefined on events by default
  return obj.get('unread') === false || obj.get('unread') === null;
}
